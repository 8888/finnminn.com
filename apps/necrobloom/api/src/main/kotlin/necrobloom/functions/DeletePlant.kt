package necrobloom.functions

import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*
import necrobloom.data.CosmosRepository
import necrobloom.utils.SecurityUtils
import java.util.Optional

class DeletePlant {
    private val repository by lazy { CosmosRepository() }

    @FunctionName("DeletePlant")
    fun run(
        @HttpTrigger(
            name = "req",
            methods = [HttpMethod.DELETE],
            route = "plants/{id}",
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<Optional<String>>,
        @BindingName("id") id: String,
        context: ExecutionContext
    ): HttpResponseMessage {
        val userId = SecurityUtils.getUserId(request.headers)
            ?: return request.createResponseBuilder(HttpStatus.UNAUTHORIZED)
                .body("Unauthenticated: The Void does not recognize you.")
                .build()

        return try {
            repository.deleteById(id, userId)
            request.createResponseBuilder(HttpStatus.NO_CONTENT).build()
        } catch (e: Exception) {
            context.logger.severe("Error deleting plant $id: ${e.message}")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to banish specimen from the Void.")
                .build()
        }
    }
}
