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

        val captureId = "test-id-123"
        `when`(request.queryParameters).thenReturn(mapOf("id" to captureId))
        
        // Mock Azure SWA Principal: {"userId": "testuser"}
        val mockPrincipal = "eyJ1c2VySWQiOiAidGVzdHVzZXIifQ=="
        `when`(request.headers).thenReturn(mapOf("x-ms-client-principal" to mockPrincipal))
        `when`(context.logger).thenReturn(Logger.getGlobal())

        `when`(repository.deleteCapture(captureId, "testuser")).thenReturn(true)

        val responseBuilder = mock(HttpResponseMessage.Builder::class.java)
        `when`(request.createResponseBuilder(any(HttpStatus::class.java))).thenReturn(responseBuilder)
        
        val response = mock(HttpResponseMessage::class.java)
        `when`(response.status).thenReturn(HttpStatus.NO_CONTENT)
        `when`(responseBuilder.build()).thenReturn(response)

        val actualResponse = function.deleteCapture(request, captureId, context)

        assertEquals(HttpStatus.NO_CONTENT, actualResponse.status)
        verify(repository).deleteCapture(captureId, "testuser")
    }

    @Test
    fun testDeleteCaptureUnauthorized() {
        val function = DeleteCaptureFunction()
        val request = mock(HttpRequestMessage::class.java) as HttpRequestMessage<Optional<String>>
        val context = mock(ExecutionContext::class.java)

        `when`(request.headers).thenReturn(emptyMap())
        `when`(context.logger).thenReturn(Logger.getGlobal())

        val responseBuilder = mock(HttpResponseMessage.Builder::class.java)
        `when`(request.createResponseBuilder(HttpStatus.UNAUTHORIZED)).thenReturn(responseBuilder)
        
        val response = mock(HttpResponseMessage::class.java)
        `when`(response.status).thenReturn(HttpStatus.UNAUTHORIZED)
        `when`(responseBuilder.build()).thenReturn(response)

        val actualResponse = function.deleteCapture(request, "id", context)

        assertEquals(HttpStatus.UNAUTHORIZED, actualResponse.status)
    }
}
