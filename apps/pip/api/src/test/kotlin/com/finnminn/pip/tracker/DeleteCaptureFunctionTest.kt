package com.finnminn.pip.tracker

import com.microsoft.azure.functions.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.*
import java.util.*
import java.util.logging.Logger

class DeleteCaptureFunctionTest {

    @Test
    fun testDeleteCaptureSuccess() {
        val function = DeleteCaptureFunction()
        val repository = mock(CosmosRepository::class.java)
        function.repository = repository

        val request = mock(HttpRequestMessage::class.java) as HttpRequestMessage<Optional<String>>
        val context = mock(ExecutionContext::class.java)

        // {"userId": "testuser"} base64 encoded
        val principalHeader = "eyJ1c2VySWQiOiJ0ZXN0dXNlciJ9"
        `when`(request.headers).thenReturn(mapOf("x-ms-client-principal" to principalHeader))
        `when`(context.logger).thenReturn(Logger.getGlobal())

        val responseBuilder = mock(HttpResponseMessage.Builder::class.java)
        `when`(request.createResponseBuilder(any(HttpStatus::class.java))).thenReturn(responseBuilder)
        val response = mock(HttpResponseMessage::class.java)
        `when`(response.status).thenReturn(HttpStatus.NO_CONTENT)
        `when`(responseBuilder.build()).thenReturn(response)

        val actualResponse = function.deleteCapture(request, "test-id", context)

        verify(repository).delete("test-id", "testuser")
        assertEquals(HttpStatus.NO_CONTENT, actualResponse.status)
    }

    @Test
    fun testDeleteCaptureUnauthorized() {
        val function = DeleteCaptureFunction()
        val repository = mock(CosmosRepository::class.java)
        function.repository = repository

        val request = mock(HttpRequestMessage::class.java) as HttpRequestMessage<Optional<String>>
        val context = mock(ExecutionContext::class.java)

        `when`(request.headers).thenReturn(emptyMap())
        
        val responseBuilder = mock(HttpResponseMessage.Builder::class.java)
        `when`(request.createResponseBuilder(HttpStatus.UNAUTHORIZED)).thenReturn(responseBuilder)
        val response = mock(HttpResponseMessage::class.java)
        `when`(response.status).thenReturn(HttpStatus.UNAUTHORIZED)
        `when`(responseBuilder.build()).thenReturn(response)

        val actualResponse = function.deleteCapture(request, "test-id", context)

        verify(repository, never()).delete(anyString(), anyString())
        assertEquals(HttpStatus.UNAUTHORIZED, actualResponse.status)
    }
}
