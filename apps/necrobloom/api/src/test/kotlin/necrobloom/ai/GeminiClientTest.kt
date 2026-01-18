package necrobloom.ai

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.lang.reflect.Method

class GeminiClientTest {

    @Test
    fun `cleanJson should remove markdown formatting`() {
        val input = "```json\n{\"key\": \"value\"}\n```"
        val expected = "{\"key\": \"value\"}"
        assertEquals(expected, GeminiClient.cleanJson(input))
    }

    @Test
    fun `cleanJson should handle raw triple backticks`() {
        val input = "```{\"key\": \"value\"}```"
        val expected = "{\"key\": \"value\"}"
        assertEquals(expected, GeminiClient.cleanJson(input))
    }

    @Test
    fun `parseResponse should extract text from Gemini JSON`() {
        val json = """
            {
              "candidates": [
                {
                  "content": {
                    "parts": [
                      {
                        "text": "The soul of the plant is healthy."
                      }
                    ]
                  }
                }
              ]
            }
        """.trimIndent()
        
        val client = GeminiClient("dummy-key")
        val method: Method = GeminiClient::class.java.getDeclaredMethod("parseResponse", String::class.java)
        method.isAccessible = true
        
        val result = method.invoke(client, json) as String
        assertEquals("The soul of the plant is healthy.", result)
    }

    @Test
    fun `parseResponse should return empty string if no candidates`() {
        val json = """{"candidates": []}"""
        val client = GeminiClient("dummy-key")
        val method: Method = GeminiClient::class.java.getDeclaredMethod("parseResponse", String::class.java)
        method.isAccessible = true
        
        val result = method.invoke(client, json) as String
        assertEquals("", result)
    }
}

