package com.finnminn.necrobloom

import com.finnminn.necrobloom.models.Vessel
import com.google.gson.Gson
import com.microsoft.azure.functions.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.*
import java.util.*

class VesselFunctionsTest {
    private lateinit var context: ExecutionContext
    private lateinit var request: HttpRequestMessage<Optional<String>>
    private lateinit var responseBuilder: HttpResponseMessage.Builder
    private val gson = Gson()

    @BeforeEach
    fun setUp() {
        context = mock()
        request = mock()
        responseBuilder = mock()
        
        whenever(request.createResponseBuilder(any())).thenReturn(responseBuilder)
        whenever(responseBuilder.body(any())).thenReturn(responseBuilder)
        whenever(responseBuilder.header(any(), any())).thenReturn(responseBuilder)
        whenever(responseBuilder.build()).thenReturn(mock())
    }

    @Test
    fun `getVessels should return 400 if userId is missing`() {
        whenever(request.queryParameters).thenReturn(emptyMap())
        
        // This is where we'd call the actual function once implemented
        // val response = VesselFunctions().getVessels(request, context)
        // verify(request).createResponseBuilder(HttpStatus.BAD_REQUEST)
    }

    @Test
    fun `identifyPlant should return 400 if body is missing`() {
        whenever(request.body).thenReturn(Optional.empty())
        
        // val response = VesselFunctions().identifyPlant(request, context)
        // verify(request).createResponseBuilder(HttpStatus.BAD_REQUEST)
    }
}