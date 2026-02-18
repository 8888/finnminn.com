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
            // If it fails, it might be because it doesn't exist or DB error.
            // Return 204 anyway for idempotency or 404 if we want to be strict.
            // US says "hard delete", usually delete is idempotent.
            request.createResponseBuilder(HttpStatus.NO_CONTENT).build()
        }
    }
}
