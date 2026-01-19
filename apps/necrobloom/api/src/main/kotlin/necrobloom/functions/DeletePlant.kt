package necrobloom.functions

import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*
import necrobloom.data.CosmosRepository
import necrobloom.services.StorageService
import necrobloom.utils.SecurityUtils
import java.util.Optional

class DeletePlant {
    companion object {
        private val repository = CosmosRepository()
        private val storageService = StorageService()
    }

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
                .body("Unauthenticated: The Void does not recognize you. Debug: $debug")
                .build()

        context.logger.info("Attempting to banish plant $id for user $userId")

        return try {
            val plant = repository.findById(id, userId)
            
            if (plant != null) {
                // Remove all associated images from storage
                plant.historicalReports.forEach { report ->
                    storageService.deleteImage(report.imageUrl)
                }
                
                // Remove record from Cosmos
                val success = repository.deleteById(id, userId)
                
                if (success) {
                    context.logger.info("Successfully banished plant $id")
                    request.createResponseBuilder(HttpStatus.OK)
                        .body("The specimen and all its traces have been banished back to the Void.")
                        .build()
                } else {
                    context.logger.severe("Failed to delete record for plant $id")
                    request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("The specimen's soul was purged, but its record remains etched in the database.")
                        .build()
                }
            } else {
                context.logger.warning("Plant $id not found for banishment for user $userId")
                request.createResponseBuilder(HttpStatus.NOT_FOUND)
                    .body("The specimen does not exist in this realm.")
                    .build()
            }
        } catch (e: Exception) {
            context.logger.severe("Error deleting plant: ${e.message}")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("The ritual of banishment failed: ${e.message}")
                .build()
        }
    }
}
