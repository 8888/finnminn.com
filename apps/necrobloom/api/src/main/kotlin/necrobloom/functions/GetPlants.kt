package necrobloom.functions

import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*
import com.google.gson.Gson
import necrobloom.data.CosmosRepository
import necrobloom.services.StorageService
import necrobloom.utils.SecurityUtils
import java.util.Optional

class GetPlants {
    companion object {
        private val repository = CosmosRepository()
        private val storageService = StorageService()
        private val gson = Gson()
    }

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
        val debug = StringBuilder()
        val userId = SecurityUtils.getUserId(request.headers, debug)
            ?: return request.createResponseBuilder(HttpStatus.UNAUTHORIZED)
                .body("Unauthenticated: The Void does not recognize you. Debug: ${debug}")
                .build()

        return try {
            val plants = repository.findAllByUserId(userId)
            
            // Sign URLs for all images
            val signedPlants = plants.map { plant ->
                plant.copy(
                    historicalReports = plant.historicalReports.map { report ->
                        report.copy(imageUrl = storageService.generateSasUrl(report.imageUrl))
                    }.toMutableList()
                )
            }

            request.createResponseBuilder(HttpStatus.OK)
                .body(gson.toJson(signedPlants))
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
