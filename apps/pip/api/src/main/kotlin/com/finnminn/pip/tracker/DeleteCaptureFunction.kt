package com.finnminn.pip.tracker

import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*
import java.util.Optional

class DeleteCaptureFunction {
    var repository = CosmosRepository()

    @FunctionName("DeleteCapture")
    fun deleteCapture(
        @HttpTrigger(
            name = "req",
            methods = [HttpMethod.DELETE],
            route = "capture/{id}",
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<Optional<String>>,
        @BindingName("id") id: String,
        context: ExecutionContext
    ): HttpResponseMessage {
        val userId = SecurityUtils.getUserId(request.headers)
            ?: return request.createResponseBuilder(HttpStatus.UNAUTHORIZED).build()

        context.logger.info("Attempting to delete capture $id for user $userId")

        val success = repository.deleteCapture(id, userId)

        return if (success) {
            request.createResponseBuilder(HttpStatus.NO_CONTENT).build()
        } else {
            context.logger.severe("Failed to delete capture $id for user $userId")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to delete resource")
                .build()
        }
    }
}
