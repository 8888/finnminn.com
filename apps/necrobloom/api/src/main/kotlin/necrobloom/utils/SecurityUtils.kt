package necrobloom.utils

import com.google.gson.JsonObject
import com.google.gson.JsonParser
import java.util.Base64

object SecurityUtils {
    fun getUserId(headers: Map<String, String>): String? {
        // 1. Try x-ms-client-principal (Azure EasyAuth / Static Web Apps)
        val principalHeader = headers.entries.find { it.key.equals("x-ms-client-principal", ignoreCase = true) }?.value
        principalHeader?.let { principalBase64 ->
            try {
                val decoded = String(Base64.getDecoder().decode(principalBase64))
                val json = JsonParser.parseString(decoded).asJsonObject
                val userId = json.get("userId")?.asString
                if (userId != null) return userId
            } catch (e: Exception) {}
        }

        // 2. Fallback to Authorization: Bearer <token> (Direct API calls from SPA)
        val authHeader = headers.entries.find { it.key.equals("authorization", ignoreCase = true) }?.value
        if (authHeader != null && authHeader.startsWith("Bearer ", ignoreCase = true)) {
            val token = authHeader.substring(7)
            try {
                val parts = token.split(".")
                if (parts.size >= 2) {
                    val payload = String(Base64.getUrlDecoder().decode(parts[1]))
                    val json = JsonParser.parseString(payload).asJsonObject
                    // Entra ID tokens use 'oid' (Object ID) as the unique user identifier
                    return json.get("oid")?.asString ?: json.get("sub")?.asString
                }
            } catch (e: Exception) {}
        }

        return null
    }
}
