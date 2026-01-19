package necrobloom.functions

import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*
import com.google.gson.Gson
import necrobloom.data.CosmosRepository
import necrobloom.utils.SecurityUtils
import java.util.Optional

class GetPlants {
    private val repository = CosmosRepository()
    private val gson = Gson()

    @FunctionName("GetPlants")
    fun run(
        @HttpTrigger(
            name = "req",
            methods = [HttpMethod.GET],
            route = "plants",
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<Optional<String>>,
        context: ExecutionContext
    ): HttpResponseMessage {
        val userId = SecurityUtils.getUserId(request.headers)
            ?: return request.createResponseBuilder(HttpStatus.UNAUTHORIZED)
                .body("Unauthenticated: The Void does not recognize you. Auth Header Length: ${request.headers["authorization"]?.length ?: 0}")
                .build()

        return try {
            val plants = repository.findAllByUserId(userId)
            request.createResponseBuilder(HttpStatus.OK)
                .body(gson.toJson(plants))
                .header("Content-Type", "application/json")
                .build()
        } catch (e: Exception) {
            context.logger.severe("Error retrieving plants: ${e.message}")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("The spirits are restless; could not retrieve your collection.")
                .build()
        }
    }
}
