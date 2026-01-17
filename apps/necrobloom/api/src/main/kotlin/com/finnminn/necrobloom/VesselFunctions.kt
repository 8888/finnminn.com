package com.finnminn.necrobloom

import com.finnminn.necrobloom.models.*
import com.google.gson.Gson
import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*
import java.util.*

class VesselFunctions {
    private val gson = Gson()

    @FunctionName("getVessels")
    fun getVessels(
        @HttpTrigger(
            name = "req",
            methods = [HttpMethod.GET],
            authLevel = AuthorizationLevel.ANONYMOUS,
            route = "vessels"
        ) request: HttpRequestMessage<Optional<String>>,
        context: ExecutionContext
    ): HttpResponseMessage {
        val userId = request.queryParameters["userId"]
            ?: return request.createResponseBuilder(HttpStatus.BAD_REQUEST).body("Missing userId").build()

        context.logger.info("Fetching vessels for user: $userId")
        
        // Mock data for now to pass initial flow, will connect to Cosmos next
        val mockVessels = listOf(
            Vessel(userId = userId, species = "Monstera Adansonii", alias = "Ghost Vine")
        )

        return request.createResponseBuilder(HttpStatus.OK)
            .header("Content-Type", "application/json")
            .body(gson.toJson(mockVessels))
            .build()
    }

    @FunctionName("identifyPlant")
    fun identifyPlant(
        @HttpTrigger(
            name = "req",
            methods = [HttpMethod.POST],
            authLevel = AuthorizationLevel.ANONYMOUS,
            route = "identify"
        ) request: HttpRequestMessage<Optional<String>>,
        context: ExecutionContext
    ): HttpResponseMessage {
        val body = request.body.orElse(null)
            ?: return request.createResponseBuilder(HttpStatus.BAD_REQUEST).body("Missing body").build()
        
        val identifyRequest = gson.fromJson(body, IdentifyRequest::class.java)
        context.logger.info("Identifying plant from URL: ${identifyRequest.imageUrl}")

        // In the next iteration, we will call GeminiService here
        val mockResponse = Vessel(
            userId = "temporary",
            species = "Monstera Deliciosa",
            carePlan = CarePlan(lighting = "Bright Indirect", watering = "Every 1-2 weeks")
        )

        return request.createResponseBuilder(HttpStatus.OK)
            .header("Content-Type", "application/json")
            .body(gson.toJson(mockResponse))
            .build()
    }
}
