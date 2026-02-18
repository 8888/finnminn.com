package necrobloom.functions

import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*
import com.google.gson.Gson
import necrobloom.data.CosmosRepository
import necrobloom.services.StorageService
import necrobloom.utils.SecurityUtils
import java.util.Optional

class GetPlant {
    private val repository by lazy { CosmosRepository() }
    private val storageService by lazy { StorageService() }
    private val gson = Gson()

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
        val userId = SecurityUtils.getUserId(request.headers)
            ?: return request.createResponseBuilder(HttpStatus.UNAUTHORIZED)
                .body("Unauthenticated: The Void does not recognize you.")
                .build()

        return try {
            val plant = repository.findByIdAndUserId(id, userId)
                ?: return request.createResponseBuilder(HttpStatus.NOT_FOUND)
                    .body("Specimen $id not found in your garden.")
                    .build()

            // Sign URLs for all images in history
            val signedPlant = plant.copy(
                historicalReports = plant.historicalReports.map { report ->
                    report.copy(imageUrl = storageService.generateSasUrl(report.imageUrl))
                }.toMutableList()
            )

            request.createResponseBuilder(HttpStatus.OK)
                .body(gson.toJson(signedPlant))
                .header("Content-Type", "application/json")
                .build()
        } catch (e: Exception) {
            context.logger.severe("Error retrieving plant $id: ${e.message}")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving specimen from the Void.")
                .build()
        }
    }
}
