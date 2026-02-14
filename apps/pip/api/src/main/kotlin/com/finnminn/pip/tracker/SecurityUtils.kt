package com.finnminn.pip.tracker

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.util.Base64

object SecurityUtils {
    private val mapper = jacksonObjectMapper()

    fun getUserId(headers: Map<String, String>): String? {
        // 1. Try x-ms-client-principal (Azure EasyAuth / Static Web Apps)
        val principalHeader = headers.entries.find { it.key.equals("x-ms-client-principal", ignoreCase = true) }?.value
        if (principalHeader != null) {
            try {
                val decoded = String(Base64.getDecoder().decode(principalHeader))
                val json = mapper.readTree(decoded)
                return json.get("userId")?.asText()
            } catch (e: Exception) {
                // Ignore
            }
        }

        // 2. Fallback to Authorization: Bearer <token>
        val authHeader = headers.entries.find { it.key.equals("authorization", ignoreCase = true) }?.value
        if (authHeader != null && authHeader.startsWith("Bearer ", ignoreCase = true)) {
            val token = authHeader.substring(7).trim()
            try {
                val parts = token.split(".")
                if (parts.size >= 2) {
                    var payloadSegment = parts[1]
                    while (payloadSegment.length % 4 != 0) {
                        payloadSegment += "="
                    }
                    val payload = String(Base64.getUrlDecoder().decode(payloadSegment))
                    val json = mapper.readTree(payload)
                    return json.get("oid")?.asText() ?: json.get("sub")?.asText()
                }
            } catch (e: Exception) {
                // Ignore
            }
        }

        return null
    }
}
