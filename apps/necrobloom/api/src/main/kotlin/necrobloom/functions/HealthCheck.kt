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

class HealthCheck {
    private val repository = CosmosRepository()
    private val storageService = StorageService()
    private val geminiClient = GeminiClient()
    private val gson = Gson()

    @FunctionName("HealthCheck")
    fun run(
        @HttpTrigger(
            name = "req",
            methods = [HttpMethod.POST],
            route = "plants/{id}/health-check",
            authLevel = AuthorizationLevel.ANONYMOUS
        )
        request: HttpRequestMessage<Optional<String>>,
        @BindingName("id") id: String,
        context: ExecutionContext
    ): HttpResponseMessage {
        val userId = SecurityUtils.getUserId(request.headers)
            ?: return request.createResponseBuilder(HttpStatus.UNAUTHORIZED)
                .body("Unauthenticated: The Void does not recognize you. Auth Header Length: ${request.headers["authorization"]?.length ?: 0}")
                .build()

        val body = request.body.orElse(null)
            ?: return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                .body("Missing request body.")
                .build()

        return try {
            val req = gson.fromJson(body, HealthCheckRequest::class.java)
            if (req?.image == null) {
                return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                    .body("Missing image data.")
                    .build()
            }

            val plant = repository.findById(id, userId)
                ?: return request.createResponseBuilder(HttpStatus.NOT_FOUND)
                    .body("Plant not found in your collection.")
                    .build()

            // Handle image upload
            val mimeType = getMimeType(req.image)
            val cleanBase64 = cleanBase64(req.image)
            val imageBytes = try {
                Base64.getDecoder().decode(cleanBase64)
            } catch (e: IllegalArgumentException) {
                return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                    .body("Invalid image data format.")
                    .build()
            }
            val extension = mimeType.split("/")[1]
            val imageUrl = storageService.uploadImage(imageBytes, extension)

            // Gemini Analysis
            val historyContext = plant.historicalReports.takeLast(3).joinToString("\n") { 
                "Date: ${it.date}, Status: ${it.healthStatus}" 
            }

            val prompt = """
                Analyze the health of this plant based on the current image.
                
                Context:
                - Species: ${plant.species}
                - Alias: ${plant.alias}
                - Care Plan: ${plant.carePlan?.let { gson.toJson(it) } ?: "No care plan"}
                - Recent History:
                $historyContext
                
                Is the plant healthy, thirsty, or dying? Provide a diagnosis.
                Keep the response concise (max 3 sentences) and use a whimsical, slightly gothic tone.
                Return strictly plain text.
            """.trimIndent()

            val diagnosis = geminiClient.analyzeImage(cleanBase64, mimeType, prompt)

            val newReport = HealthReport(
                date = Instant.now().toString(),
                healthStatus = diagnosis,
                imageUrl = imageUrl
            )

            plant.historicalReports.add(newReport)
            val updatedPlant = repository.save(plant)

            // Sign URLs for the response
            val signedPlant = updatedPlant.copy(
                historicalReports = updatedPlant.historicalReports.map { report ->
                    report.copy(imageUrl = storageService.generateSasUrl(report.imageUrl))
                }.toMutableList()
            )

            request.createResponseBuilder(HttpStatus.OK)
                .body(gson.toJson(signedPlant))
                .header("Content-Type", "application/json")
                .build()
        } catch (e: Exception) {
            context.logger.severe("Error performing health check: ${e.message}")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("The spirits of the plant are troubled: ${e.message}")
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
        return if (base64String.contains(',')) {
            base64String.split(",")[1]
        } else {
            base64String
        }
    }
}
