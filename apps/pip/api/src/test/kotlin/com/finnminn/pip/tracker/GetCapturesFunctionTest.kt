package com.finnminn.pip.tracker

import com.microsoft.azure.functions.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.*
import java.util.*
import java.util.logging.Logger

class GetCapturesFunctionTest {

    @Test
    fun testGetCapturesSuccess() {
        val function = GetCapturesFunction()
        val repository = mock(CosmosRepository::class.java)
        function.repository = repository
        `when`(repository.findAllCapturesByUserId(anyString())).thenReturn(emptyList())

        val request = mock(HttpRequestMessage::class.java) as HttpRequestMessage<Optional<String>>
        val context = mock(ExecutionContext::class.java)

        `when`(request.headers).thenReturn(mapOf("x-ms-client-principal-name" to "testuser"))
        `when`(context.logger).thenReturn(Logger.getGlobal())

        val responseBuilder = mock(HttpResponseMessage.Builder::class.java)
        `when`(request.createResponseBuilder(any(HttpStatus::class.java))).thenReturn(responseBuilder)
        `when`(responseBuilder.body(any())).thenReturn(responseBuilder)
        `when`(responseBuilder.header(any(), any())).thenReturn(responseBuilder)

        val response = mock(HttpResponseMessage::class.java)
        `when`(responseBuilder.build()).thenReturn(response)
        `when`(response.status).thenReturn(HttpStatus.OK)

        val actualResponse = function.getCaptures(request, context)

        assertEquals(HttpStatus.OK, actualResponse.status)
    }
}
