package necrobloom.functions

import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*
import com.google.gson.Gson
import necrobloom.data.CosmosRepository
import necrobloom.services.StorageService
import necrobloom.utils.SecurityUtils
import java.util.Optional

class GetPlant {
    companion object {
        private val repository = CosmosRepository()
        private val storageService = StorageService()
        private val gson = Gson()
    }

    @FunctionName("GetPlant")
    fun run(
        @HttpTrigger(
            name = "req",
            methods = [HttpMethod.GET],
            route = "plants/{id}",
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<Optional<String>>,
        @BindingName("id") id: String,
        context: ExecutionContext
    ): HttpResponseMessage {
        val debug = StringBuilder()
        val userId = SecurityUtils.getUserId(request.headers, debug)
            ?: return request.createResponseBuilder(HttpStatus.UNAUTHORIZED)
                .body("Unauthenticated: The Void does not recognize you. Debug: $debug")
                .build()

        context.logger.info("Attempting to retrieve plant $id for user $userId")

        return try {
            val plant = repository.findById(id, userId)
            
            if (plant != null) {
                context.logger.info("Found plant: ${plant.alias}")
                // Sign URLs for all images
                val signedPlant = plant.copy(
                    historicalReports = plant.historicalReports.map { report ->
                        report.copy(imageUrl = storageService.generateSasUrl(report.imageUrl))
                    }.toMutableList()
                )

                request.createResponseBuilder(HttpStatus.OK)
                    .body(gson.toJson(signedPlant))
                    .header("Content-Type", "application/json")
                    .build()
            } else {
                context.logger.warning("Plant $id not found for user $userId")
                request.createResponseBuilder(HttpStatus.NOT_FOUND)
                    .body("The specimen does not exist in this realm.")
                    .build()
            }
        } catch (e: Exception) {
            context.logger.severe("Error retrieving plant: ${e.message}")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("The spirits are silent: ${e.message}")
                .build()
        }
    }
}
