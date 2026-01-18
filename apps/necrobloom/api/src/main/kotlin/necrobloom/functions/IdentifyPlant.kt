package necrobloom.functions

import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*
import com.google.gson.Gson
import necrobloom.ai.GeminiClient
import necrobloom.data.IdentifyPlantRequest
import necrobloom.data.IdentifyPlantResponse
import necrobloom.utils.SecurityUtils
import java.util.Optional

class IdentifyPlant {
    private val geminiClient = GeminiClient()
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
        SecurityUtils.getUserId(request.headers)
            ?: return request.createResponseBuilder(HttpStatus.UNAUTHORIZED)
                .body("Unauthenticated: The Void does not recognize you.")
                .build()

        val body = request.body.orElse(null)
            ?: return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                .body("Missing request body.")
                .build()

        return try {
            val req = gson.fromJson(body, IdentifyPlantRequest::class.java)
            
            // Basic validation
            if (req.image.isNullOrBlank()) {
                return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                    .body("The image void is empty.")
                    .build()
            }
            
            val mimeType = getMimeType(req.image)
            val cleanBase64 = cleanBase64(req.image)
            
            val prompt = """
                Identify this plant. 
                Return strictly valid JSON (no markdown) with the following fields:
                - species (Common name)
                - scientificName
                - description (A brief, whimsical description)
            """.trimIndent()

            val aiResponseText = geminiClient.analyzeImage(cleanBase64, mimeType, prompt)
            
            // Attempt to parse AI response to ensure it fits our schema
            val jsonStr = GeminiClient.cleanJson(aiResponseText)
            val responseObj = gson.fromJson(jsonStr, IdentifyPlantResponse::class.java)

            request.createResponseBuilder(HttpStatus.OK)
                .body(gson.toJson(responseObj))
                .header("Content-Type", "application/json")
                .build()

        } catch (e: Exception) {
            context.logger.severe("Error identifying plant: ${e.message}")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("The Oracle failed to see: ${e.message}")
                .build()
        }
    }

    private fun getMimeType(base64String: String): String {
        return if (base64String.contains("data:") && base64String.contains(";base64,")) {
            base64String.split(";")[0].split(":")[1]
        } else {
            "image/jpeg" // Default fallback
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
