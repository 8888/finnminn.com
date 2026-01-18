package necrobloom.ai

import com.google.gson.Gson
import com.google.gson.JsonArray
import com.google.gson.JsonObject
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

class GeminiClient {

    private val apiKey = System.getenv("GEMINI_API_KEY") 
        ?: throw IllegalStateException("GEMINI_API_KEY is not set. The Void cannot see without the Key.")
    private val model = System.getenv("GEMINI_MODEL") ?: "gemini-2.5-flash"
    private val endpoint = "https://generativelanguage.googleapis.com/v1beta/models/$model:generateContent?key=$apiKey"
    
    private val client = HttpClient.newHttpClient()
    private val gson = Gson()

    companion object {
        fun cleanJson(input: String): String {
            var result = input.trim()
            if (result.startsWith("```json")) {
                result = result.substring(7)
            } else if (result.startsWith("```")) {
                result = result.substring(3)
            }
            
            if (result.endsWith("```")) {
                result = result.substring(0, result.length - 3)
            }
            return result.trim()
        }
    }

    /**
     * Generates text from a given prompt.
     * @param prompt The question or instruction for the AI.
     * @return The text response from Gemini.
     */
    fun generateText(prompt: String): String {
        val textPart = JsonObject().apply {
            addProperty("text", prompt)
        }
        
        val parts = JsonArray().apply {
            add(textPart)
        }
        
        val content = JsonObject().apply {
            add("parts", parts)
        }
        
        val contents = JsonArray().apply {
            add(content)
        }
        
        val requestBody = JsonObject().apply {
            add("contents", contents)
        }

        val request = HttpRequest.newBuilder()
            .uri(URI.create(endpoint))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(gson.toJson(requestBody)))
            .build()

        val response = client.send(request, HttpResponse.BodyHandlers.ofString())

        if (response.statusCode() != 200) {
            throw RuntimeException("Gemini API failed with status ${response.statusCode()}: ${response.body()}")
        }
        
        return parseResponse(response.body())
    }

    /**
     * Analyzes a Base64 encoded image with a given prompt.
     * @param base64Image The raw Base64 string (without data URI prefix).
     * @param mimeType The MIME type (e.g., "image/jpeg").
     * @param prompt The question or instruction for the AI.
     * @return The text response from Gemini.
     */
    fun analyzeImage(base64Image: String, mimeType: String, prompt: String): String {
        val inlineData = JsonObject().apply {
            addProperty("mime_type", mimeType)
            addProperty("data", base64Image)
        }
        
        val imagePart = JsonObject().apply {
            add("inline_data", inlineData)
        }
        
        val textPart = JsonObject().apply {
            addProperty("text", prompt)
        }
        
        val parts = JsonArray().apply {
            add(textPart)
            add(imagePart)
        }
        
        val content = JsonObject().apply {
            add("parts", parts)
        }
        
        val contents = JsonArray().apply {
            add(content)
        }
        
        val requestBody = JsonObject().apply {
            add("contents", contents)
        }

        val request = HttpRequest.newBuilder()
            .uri(URI.create(endpoint))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(gson.toJson(requestBody)))
            .build()

        val response = client.send(request, HttpResponse.BodyHandlers.ofString())

        if (response.statusCode() != 200) {
            // Log the error body for debugging (but maybe sanitize key if it was in URL, though URL is already built)
            throw RuntimeException("Gemini API failed with status ${response.statusCode()}: ${response.body()}")
        }
        
        return parseResponse(response.body())
    }

    private fun parseResponse(jsonBody: String): String {
        try {
            val jsonResponse = gson.fromJson(jsonBody, JsonObject::class.java)
            val candidates = jsonResponse.getAsJsonArray("candidates")
            if (candidates != null && candidates.size() > 0) {
                val candidate = candidates.get(0).asJsonObject
                val content = candidate.getAsJsonObject("content")
                if (content != null) {
                    val parts = content.getAsJsonArray("parts")
                    if (parts != null && parts.size() > 0) {
                        return parts.get(0).asJsonObject.get("text").asString
                    }
                }
            }
            return ""
        } catch (e: Exception) {
            throw RuntimeException("Failed to parse Gemini oracle response: ${e.message}")
        }
    }
}
