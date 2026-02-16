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

        return try {
            repository.delete(id, userId)
            request.createResponseBuilder(HttpStatus.NO_CONTENT).build()
        } catch (e: Exception) {
            context.logger.severe("Error deleting capture $id: ${e.message}")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to delete capture: ${e.message}")
                .build()
        }
    }
}
