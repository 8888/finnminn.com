package necrobloom.functions

import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*
import com.google.gson.Gson
import necrobloom.ai.GeminiClient
import necrobloom.data.*
import necrobloom.services.StorageService
import necrobloom.utils.SecurityUtils
import java.time.Instant
import java.util.Base64
import java.util.Optional

class CreatePlant {
    private val repository = CosmosRepository()
    private val storageService = StorageService()
    private val geminiClient = GeminiClient()
    private val gson = Gson()

    @FunctionName("CreatePlant")
    fun run(
        @HttpTrigger(
            name = "req",
            methods = [HttpMethod.POST],
            route = "plants",
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<Optional<String>>,
        context: ExecutionContext
    ): HttpResponseMessage {
        val userId = SecurityUtils.getUserId(request.headers)
            ?: return request.createResponseBuilder(HttpStatus.UNAUTHORIZED)
                .body("Unauthenticated: The Void does not recognize you.")
                .build()

        val body = request.body.orElse(null)
            ?: return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                .body("Missing request body.")
                .build()

        return try {
            val req = gson.fromJson(body, CreatePlantRequest::class.java)
            
            // Handle image upload
            val imageBytes = decodeBase64(req.image)
            val extension = getExtension(req.image)
            val imageUrl = storageService.uploadImage(imageBytes, extension)

            // Generate Care Plan
            val carePlan = try {
                val carePrompt = """
                    Generate a care plan for a plant of species "${req.species}" 
                    located in zip code "${req.zip}" (infer climate) 
                    with lighting condition "${req.lighting}".
                    
                    Return strictly valid JSON (no markdown) with fields:
                    - waterFrequency
                    - lightNeeds
                    - toxicity
                    - additionalNotes
                """.trimIndent()
                
                val careJson = geminiClient.generateText(carePrompt)
                val cleanJson = GeminiClient.cleanJson(careJson)
                gson.fromJson(cleanJson, necrobloom.data.CarePlan::class.java)
            } catch (e: Exception) {
                context.logger.warning("Failed to generate care plan: ${e.message}")
                null
            }

            val plant = Plant(
                userId = userId,
                species = req.species,
                alias = req.alias,
                environment = Environment(req.zip, req.lighting),
                carePlan = carePlan,
                historicalReports = mutableListOf(
                    HealthReport(
                        date = Instant.now().toString(),
                        healthStatus = "Initial Incarnation",
                        imageUrl = imageUrl
                    )
                )
            )

            val savedPlant = repository.save(plant)

            request.createResponseBuilder(HttpStatus.CREATED)
                .body(gson.toJson(savedPlant))
                .header("Content-Type", "application/json")
                .build()
        } catch (e: IllegalArgumentException) {
            context.logger.warning("Validation error: ${e.message}")
            request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                .body("Ritual aborted: ${e.message}")
                .build()
        } catch (e: Exception) {
            context.logger.severe("Error creating plant: ${e.message}")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error manifesting plant in the Void: ${e.message}")
                .build()
        }
    }

    private fun decodeBase64(base64String: String): ByteArray {
        val cleanBase64 = if (base64String.contains(",")) {
            base64String.split(",")[1]
        } else {
            base64String
        }
        return try {
            Base64.getDecoder().decode(cleanBase64)
        } catch (e: IllegalArgumentException) {
            throw IllegalArgumentException("Visual data corruption: Malformed Base64 string.")
        }
    }

    private fun getExtension(base64String: String): String {
        return if (base64String.contains("data:image/") && base64String.contains(";base64,")) {
            base64String.split(";")[0].split("/")[1]
        } else {
            "jpg"
        }
    }
}
