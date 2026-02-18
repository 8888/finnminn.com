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
    private val repository by lazy { CosmosRepository() }
    private val storageService by lazy { StorageService() }
    private val geminiClient by lazy { GeminiClient() }
    private val gson = Gson()

    @FunctionName("HealthCheck")
    fun run(
        @HttpTrigger(
            name = "req",
            methods = [HttpMethod.POST],
            route = "plants/{id}/health",
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<Optional<String>>,
        @BindingName("id") id: String,
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
            val plant = repository.findByIdAndUserId(id, userId)
                ?: return request.createResponseBuilder(HttpStatus.NOT_FOUND)
                    .body("Specimen $id not found.")
                    .build()

            val req = gson.fromJson(body, HealthCheckRequest::class.java)
            
            if (req.image.isNullOrBlank()) {
                return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                    .body("Visual manifestation (image) is required for diagnosis.")
                    .build()
            }

            val mimeType = getMimeType(req.image)
            val cleanBase64 = cleanBase64(req.image)
            val imageBytes = Base64.getDecoder().decode(cleanBase64)
            val extension = getExtensionFromMime(mimeType)
            
            // Upload to storage
            val imageUrl = storageService.uploadImage(imageBytes, extension)

            // Consult the Oracle (Gemini)
            val prompt = """
                Analyze this ${plant.species}. Diagnosis its health based on the image.
                Provide a short status (e.g., "Thriving", "Wilting", "Possessed") and detailed advice.
                
                Return strictly valid JSON:
                {
                  "status": "string",
                  "advice": "string"
                }
            """.trimIndent()

            val aiResponseText = geminiClient.analyzeImage(cleanBase64, mimeType, prompt)
            val cleanJson = GeminiClient.cleanJson(aiResponseText)
            val oracleResult = gson.fromJson(cleanJson, HealthCheckAIResult::class.java)

            val newReport = HealthReport(
                date = Instant.now().toString(),
                healthStatus = oracleResult?.status ?: "Indeterminate",
                imageUrl = imageUrl,
                advice = oracleResult?.advice
            )

            plant.historicalReports.add(0, newReport)
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
            context.logger.severe("Error performing health check for plant $id: ${e.message}")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("The Oracle is blinded; could not diagnose specimen.")
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

    private fun getExtensionFromMime(mimeType: String): String {
        return when (mimeType.lowercase()) {
            "image/jpeg" -> "jpg"
            "image/png" -> "png"
            "image/gif" -> "gif"
            "image/webp" -> "webp"
            "image/svg+xml" -> "svg"
            "image/bmp" -> "bmp"
            else -> "jpg" // Fallback
        }
    }

    private data class HealthCheckAIResult(
        val status: String?,
        val advice: String?
    )
}
