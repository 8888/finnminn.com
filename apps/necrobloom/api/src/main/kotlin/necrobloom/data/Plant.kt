package necrobloom.data

import java.util.UUID

data class Plant(
    val id: String = UUID.randomUUID().toString(),
    val userId: String,
    val species: String,
    val alias: String,
    val environment: Environment,
    val historicalReports: MutableList<HealthReport> = mutableListOf(),
    val carePlan: CarePlan? = null
)

data class Environment(
    val zip: String,
    val lighting: String
)

data class CarePlan(
    val waterFrequency: String,
    val lightNeeds: String,
    val toxicity: String,
    val additionalNotes: String
)

data class HealthReport(
    val date: String,
    val healthStatus: String,
    val imageUrl: String
)

data class CreatePlantRequest(
    val alias: String,
    val species: String? = null,
    val zip: String,
    val lighting: String,
    val image: String // Base64
)

data class IdentifyPlantRequest(
    val image: String // Base64
)

data class IdentifyPlantResponse(
    val species: String,
    val scientificName: String,
    val description: String
)

data class HealthCheckRequest(
    val image: String // Base64
)
