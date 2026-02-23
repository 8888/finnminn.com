package com.finnminn.pip.tracker

import com.microsoft.azure.functions.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.*
import java.util.*
import java.util.logging.Logger

class HabitLogFunctionsTest {

    @Test
    fun testGetHabitLogsSuccess() {
        val function = HabitLogFunctions()
        val repository = mock(CosmosRepository::class.java)
        function.repository = repository
        
        val request = mock(HttpRequestMessage::class.java) as HttpRequestMessage<Optional<String>>
        val context = mock(ExecutionContext::class.java)

        val mockPrincipal = "eyJ1c2VySWQiOiAidGVzdHVzZXIifQ=="
        `when`(request.headers).thenReturn(mapOf("x-ms-client-principal" to mockPrincipal))
        `when`(request.queryParameters).thenReturn(mapOf("startDate" to "2026-02-01", "endDate" to "2026-02-28"))
        `when`(context.logger).thenReturn(Logger.getGlobal())

        val responseBuilder = mock(HttpResponseMessage.Builder::class.java)
        `when`(request.createResponseBuilder(any(HttpStatus::class.java))).thenReturn(responseBuilder)
        `when`(responseBuilder.body(any())).thenReturn(responseBuilder)
        `when`(responseBuilder.header(any(), any())).thenReturn(responseBuilder)

        val response = mock(HttpResponseMessage::class.java)
        `when`(responseBuilder.build()).thenReturn(response)
        `when`(response.status).thenReturn(HttpStatus.OK)

        `when`(repository.findAllHabitLogsByUserIdAndDateRange("testuser", "2026-02-01", "2026-02-28")).thenReturn(listOf())

        val actualResponse = function.getHabitLogs(request, context)

        assertEquals(HttpStatus.OK, actualResponse.status)
    }

    @Test
    fun testToggleHabitLogSuccess() {
        val function = HabitLogFunctions()
        val repository = mock(CosmosRepository::class.java)
        function.repository = repository
        
        val request = mock(HttpRequestMessage::class.java) as HttpRequestMessage<Optional<String>>
        val context = mock(ExecutionContext::class.java)

        val body = """{"ritualId": "r1", "date": "2026-02-23"}"""
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

        `when`(repository.findHabitLogByRitualIdAndDate("testuser", "r1", "2026-02-23")).thenReturn(null)

        val actualResponse = function.toggleHabitLog(request, context)

        assertEquals(HttpStatus.OK, actualResponse.status)
    }
}
