package necrobloom.functions

import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*
import com.google.gson.Gson
import necrobloom.ai.GeminiClient
import necrobloom.data.IdentifyPlantRequest
import necrobloom.utils.SecurityUtils
import java.util.Optional

class IdentifyPlant {
    private val geminiClient by lazy { GeminiClient() }
    private val gson = Gson()

    @FunctionName("IdentifyPlant")
    fun run(
        @HttpTrigger(
            name = "req",
            methods = [HttpMethod.POST],
            route = "identify",
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
            val req = gson.fromJson(body, IdentifyPlantRequest::class.java)
            
            if (req.image.isNullOrBlank()) {
                return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                    .body("Visual manifestation (image) is required for identification.")
                    .build()
            }

            val mimeType = getMimeType(req.image)
            val cleanBase64 = cleanBase64(req.image)
            
            val prompt = """
                Identify this plant species. Return ONLY the common name, nothing else. 
                If you cannot identify it, return "Unknown specimen".
            """.trimIndent()

            val species = geminiClient.analyzeImage(cleanBase64, mimeType, prompt)

            request.createResponseBuilder(HttpStatus.OK)
                .body(gson.toJson(mapOf("species" to species.trim())))
                .header("Content-Type", "application/json")
                .build()

        } catch (e: Exception) {
            context.logger.severe("Error identifying plant: ${e.message}")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("The Oracle is silent; identification failed.")
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
}
