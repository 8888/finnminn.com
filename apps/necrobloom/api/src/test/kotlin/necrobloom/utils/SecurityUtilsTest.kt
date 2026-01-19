package necrobloom.utils

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.util.Base64

class SecurityUtilsTest {

    @Test
    fun `test getUserId with unpadded JWT`() {
        // A minimal JWT payload: {"oid": "user-123"}
        // Encoded: eyJvaWQiOiAidXNlci0xMjMifQ
        // Length: 26. 26 % 4 = 2. Needs 2 padding '='.
        
        // Header: {"alg":"none"} -> eyJhbGciOiJub25lIn0
        
        val header = "eyJhbGciOiJub25lIn0"
        val payload = "eyJvaWQiOiAidXNlci0xMjMifQ" // unpadded
        val token = "$header.$payload."
        
        val headers = mapOf("Authorization" to "Bearer $token")
        
        val userId = SecurityUtils.getUserId(headers)
        
        assertEquals("user-123", userId)
    }
}
