package com.finnminn.pip.tracker

import com.microsoft.azure.functions.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.Mockito.*
import java.util.*
import java.util.logging.Logger

class FunctionAppTest {

    @Test
    fun testRun() {
        // Setup
        val function = FunctionApp()
        val request = mock(HttpRequestMessage::class.java) as HttpRequestMessage<Optional<String>>
        val context = mock(ExecutionContext::class.java)

        val queryParams = mapOf<String, String>()
        `when`(request.queryParameters).thenReturn(queryParams)
        `when`(request.body).thenReturn(Optional.empty())

        `when`(context.logger).thenReturn(Logger.getGlobal())

        val responseBuilder = mock(HttpResponseMessage.Builder::class.java)
        `when`(request.createResponseBuilder(any(HttpStatus::class.java))).thenReturn(responseBuilder)
        `when`(responseBuilder.body(any())).thenReturn(responseBuilder)

        val response = mock(HttpResponseMessage::class.java)
        `when`(responseBuilder.build()).thenReturn(response)
        `when`(response.status).thenReturn(HttpStatus.OK)
        `when`(response.body).thenReturn("hello world")

        // Invoke
        val actualResponse = function.run(request, context)

        // Verify
        assertEquals(HttpStatus.OK, actualResponse.status)
        assertEquals("hello world", actualResponse.body)
    }
}
