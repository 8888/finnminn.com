package com.finnminn.pip.tracker

import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.util.Optional

class GetCapturesFunction {
    private val mapper = jacksonObjectMapper()
    var repository by lazy { CosmosRepository() }

    @FunctionName("GetCaptures")
    fun getCaptures(
        @HttpTrigger(
            name = "req",
            methods = [HttpMethod.GET],
            route = "captures",
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<Optional<String>>,
        context: ExecutionContext
    ): HttpResponseMessage {
        val userId = SecurityUtils.getUserId(request.headers)
            ?: return request.createResponseBuilder(HttpStatus.UNAUTHORIZED).build()

        val result = repository.findAllCapturesByUserId(userId)

        return request.createResponseBuilder(HttpStatus.OK)
            .body(mapper.writeValueAsString(result))
            .header("Content-Type", "application/json")
            .build()
    }
}
