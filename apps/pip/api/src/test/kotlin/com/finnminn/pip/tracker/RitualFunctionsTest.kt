package com.finnminn.pip.tracker

import com.microsoft.azure.functions.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.*
import java.util.*
import java.util.logging.Logger

class RitualFunctionsTest {

    @Test
    fun testGetRitualsSuccess() {
        val function = RitualFunctions()
        val repository = mock(CosmosRepository::class.java)
        function.repository = repository
        
        val request = mock(HttpRequestMessage::class.java) as HttpRequestMessage<Optional<String>>
        val context = mock(ExecutionContext::class.java)

        val mockPrincipal = "eyJ1c2VySWQiOiAidGVzdHVzZXIifQ=="
        `when`(request.headers).thenReturn(mapOf("x-ms-client-principal" to mockPrincipal))
        `when`(context.logger).thenReturn(Logger.getGlobal())

        val responseBuilder = mock(HttpResponseMessage.Builder::class.java)
        `when`(request.createResponseBuilder(any(HttpStatus::class.java))).thenReturn(responseBuilder)
        `when`(responseBuilder.body(any())).thenReturn(responseBuilder)
        `when`(responseBuilder.header(any(), any())).thenReturn(responseBuilder)

        val response = mock(HttpResponseMessage::class.java)
        `when`(responseBuilder.build()).thenReturn(response)
        `when`(response.status).thenReturn(HttpStatus.OK)

        `when`(repository.findAllRitualsByUserId("testuser")).thenReturn(listOf())

        val actualResponse = function.getRituals(request, context)

        assertEquals(HttpStatus.OK, actualResponse.status)
    }

    @Test
    fun testUpsertRitualSuccess() {
        val function = RitualFunctions()
        val repository = mock(CosmosRepository::class.java)
        function.repository = repository
        
        val request = mock(HttpRequestMessage::class.java) as HttpRequestMessage<Optional<String>>
        val context = mock(ExecutionContext::class.java)

        val body = """{"name": "Exercise", "nature": "light"}"""
        `when`(request.body).thenReturn(Optional.of(body))
        val mockPrincipal = "eyJ1c2VySWQiOiAidGVzdHVzZXIifQ=="
        `when`(request.headers).thenReturn(mapOf("x-ms-client-principal" to mockPrincipal))
        `when`(context.logger).thenReturn(Logger.getGlobal())

        val responseBuilder = mock(HttpResponseMessage.Builder::class.java)
        `when`(request.createResponseBuilder(any(HttpStatus::class.java))).thenReturn(responseBuilder)
        `when`(responseBuilder.body(any())).thenReturn(responseBuilder)
        `when`(responseBuilder.header(any(), any())).thenReturn(responseBuilder)

        val response = mock(HttpResponseMessage::class.java)
        `when`(responseBuilder.build()).thenReturn(response)
        `when`(response.status).thenReturn(HttpStatus.OK)

        val actualResponse = function.upsertRitual(request, context)

        assertEquals(HttpStatus.OK, actualResponse.status)
    }
}
