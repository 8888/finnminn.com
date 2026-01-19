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
            
            // Image processing
            if (req.image.isNullOrBlank()) {
                return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                    .body("Visual manifestation (image) is required.")
                    .build()
            }

            val mimeType = getMimeType(req.image)
            val cleanBase64 = cleanBase64(req.image)
            val imageBytes = Base64.getDecoder().decode(cleanBase64)
            val extension = mimeType.split("/").getOrElse(1) { "jpg" }
            
            // Upload to storage
            val imageUrl = storageService.uploadImage(imageBytes, extension)

            // Consult the Oracle (Gemini)
            val userClaim = if (!req.species.isNullOrBlank()) "User claims this is a '${req.species}'." else "User has not identified this plant."
            
            val prompt = """
                Analyze the provided plant image. $userClaim
                
                1. Identify the species (Common Name). If the user's claim is accurate, use it. If not, correct it.
                2. Generate a care plan for this specific plant located in zip code "${req.zip}" (infer climate) with lighting "${req.lighting}".
                
                Return strictly valid JSON (no markdown) with this schema:
                {
                  "species": "string (Common Name)",
                  "carePlan": {
                    "waterFrequency": "string",
                    "lightNeeds": "string",
                    "toxicity": "string",
                    "additionalNotes": "string"
                  }
                }
            """.trimIndent()

            val aiResponseText = geminiClient.analyzeImage(cleanBase64, mimeType, prompt)
            val cleanJson = GeminiClient.cleanJson(aiResponseText)
            val oracleResult = gson.fromJson(cleanJson, AIAnalysisResult::class.java)

            val plant = Plant(
                userId = userId,
                species = oracleResult.species,
                alias = req.alias,
                environment = Environment(req.zip, req.lighting),
                carePlan = oracleResult.carePlan,
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

        } catch (e: Exception) {
            context.logger.severe("Error creating plant: ${e.message}")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error manifesting plant in the Void: ${e.message}")
                .build()
        }
    }

    private fun getMimeType(base64String: String): String {
        return if (base64String.contains("data:") && base64String.contains(";base64,")) {
            base64String.split(";")[0].split(":")[1]
        } else {
            "image/jpeg"
        }
    }

    private fun cleanBase64(base64String: String): String {
        return if (base64String.contains(",")) {
            base64String.split(",")[1]
        } else {
            base64String
        }
    }

    private data class AIAnalysisResult(
        val species: String,
        val carePlan: CarePlan
    )
}
