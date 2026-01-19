package necrobloom.utils

import com.google.gson.JsonObject
import com.google.gson.JsonParser
import java.util.Base64

object SecurityUtils {
    fun getUserId(headers: Map<String, String>, debug: StringBuilder? = null): String? {
        // 1. Try x-ms-client-principal (Azure EasyAuth / Static Web Apps)
        val principalHeader = headers.entries.find { it.key.equals("x-ms-client-principal", ignoreCase = true) }?.value
        if (principalHeader != null) {
            debug?.append("Found x-ms-client-principal. ")
            try {
                val decoded = String(Base64.getDecoder().decode(principalHeader))
                val json = JsonParser.parseString(decoded).asJsonObject
                val userId = json.get("userId")?.asString
                if (userId != null) return userId
            } catch (e: Exception) {
                debug?.append("Principal decode failed: ${e.message}. ")
            }
        }

        // 2. Fallback to Authorization: Bearer <token> (Direct API calls from SPA)
        val authHeader = headers.entries.find { it.key.equals("authorization", ignoreCase = true) }?.value
        if (authHeader != null && authHeader.startsWith("Bearer ", ignoreCase = true)) {
            debug?.append("Found Authorization header. ")
            val token = authHeader.substring(7)
            try {
                val parts = token.split(".")
                debug?.append("Token parts: ${parts.size}. ")
                if (parts.size >= 2) {
                    var payloadSegment = parts[1]
                    // Normalize for Base64URL (replace -_ with +/ and add padding)
                    // Actually getUrlDecoder should handle -_
                    while (payloadSegment.length % 4 != 0) {
                        payloadSegment += "="
                    }
                    val payload = String(Base64.getUrlDecoder().decode(payloadSegment))
                    debug?.append("Payload decoded. ")
                    val json = JsonParser.parseString(payload).asJsonObject
                    val userId = json.get("oid")?.asString ?: json.get("sub")?.asString
                    if (userId != null) return userId
                    debug?.append("No oid or sub in payload. ")
                }
            } catch (e: Exception) {
                debug?.append("Token parse error: ${e.message}. ")
            }
        } else if (authHeader != null) {
            debug?.append("Auth header does not start with Bearer. ")
        } else {
            debug?.append("No Auth header found. ")
        }

        return null
    }
}
