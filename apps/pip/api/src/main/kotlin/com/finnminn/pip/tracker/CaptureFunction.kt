package com.finnminn.pip.tracker

import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.time.Instant
import java.util.Optional
import java.util.UUID

class CaptureFunction {
    private val mapper = jacksonObjectMapper()
    var repository by lazy { CosmosRepository() }

    @FunctionName("PostCapture")
    fun postCapture(
        @HttpTrigger(
            name = "req",
            methods = [HttpMethod.POST],
            route = "capture",
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<Optional<String>>,
        context: ExecutionContext
    ): HttpResponseMessage {
        val userId = SecurityUtils.getUserId(request.headers)
            ?: return request.createResponseBuilder(HttpStatus.UNAUTHORIZED).build()

        val body = request.body.orElse(null)
            ?: return request.createResponseBuilder(HttpStatus.BAD_REQUEST).body("Missing body").build()

        return try {
            val partialItem = mapper.readValue(body, CaptureItem::class.java)
            if (partialItem.content.isBlank()) {
                return request.createResponseBuilder(HttpStatus.BAD_REQUEST).body("Content cannot be blank").build()
            }

            val item = partialItem.copy(
                id = UUID.randomUUID().toString(),
                userId = userId,
                timestamp = Instant.now().toString(),
                type = "capture",
                status = "inbox"
            )

            repository.save(item)

            request.createResponseBuilder(HttpStatus.CREATED)
                .body(mapper.writeValueAsString(item))
                .header("Content-Type", "application/json")
                .build()
        } catch (e: Exception) {
            context.logger.severe("Error saving capture: ${e.message}")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR).body(e.message).build()
        }
    }
}
