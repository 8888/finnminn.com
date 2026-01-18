package necrobloom.data

import java.util.UUID

data class Plant(
    val id: String = UUID.randomUUID().toString(),
    val userId: String,
    val species: String,
    val alias: String,
    val environment: Environment,
    val historicalReports: MutableList<HealthReport> = mutableListOf()
)

data class Environment(
    val zip: String,
    val lighting: String
)

data class HealthReport(
    val date: String,
    val healthStatus: String,
    val imageUrl: String
)

data class CreatePlantRequest(
    val alias: String,
    val species: String,
    val zip: String,
    val lighting: String,
    val image: String // Base64
)
