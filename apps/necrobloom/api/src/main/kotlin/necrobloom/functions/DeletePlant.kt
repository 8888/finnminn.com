package necrobloom.functions

import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*
import necrobloom.data.CosmosRepository
import necrobloom.utils.SecurityUtils
import java.util.Optional

class DeletePlant {
    private val repository = CosmosRepository()

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
        val debug = StringBuilder()
        val userId = SecurityUtils.getUserId(request.headers, debug)
            ?: return request.createResponseBuilder(HttpStatus.UNAUTHORIZED)
                .body("Unauthenticated: The Void does not recognize you.")
                .build()

        return try {
            val success = repository.deleteById(id, userId)
            if (success) {
                request.createResponseBuilder(HttpStatus.OK)
                    .body("The specimen has been banished back to the Void.")
                    .build()
            } else {
                request.createResponseBuilder(HttpStatus.NOT_FOUND)
                    .body("The specimen could not be found or refused to leave.")
                    .build()
            }
        } catch (e: Exception) {
            context.logger.severe("Error deleting plant: ${e.message}")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("The ritual of banishment failed.")
                .build()
        }
    }
}
