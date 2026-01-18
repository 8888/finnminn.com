package necrobloom.utils

import com.google.gson.JsonObject
import com.google.gson.JsonParser
import java.util.Base64

object SecurityUtils {
    fun getUserId(headers: Map<String, String>): String? {
        val principalBase64 = headers["x-ms-client-principal"] ?: return null
        return try {
            val decoded = String(Base64.getDecoder().decode(principalBase64))
            val json = JsonParser.parseString(decoded).asJsonObject
            json.get("userId")?.asString
        } catch (e: Exception) {
            null
        }
    }
}
