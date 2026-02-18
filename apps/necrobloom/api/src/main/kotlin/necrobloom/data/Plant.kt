package necrobloom.data

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import java.util.UUID

@JsonIgnoreProperties(ignoreUnknown = true)
data class Plant(
    val id: String = UUID.randomUUID().toString(),
    val userId: String = "",
    val species: String = "",
    val alias: String = "",
    val environment: Environment = Environment(),
    val historicalReports: MutableList<HealthReport> = mutableListOf(),
    val carePlan: CarePlan? = null
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class Environment(
    val zip: String = "",
    val lighting: String = ""
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class CarePlan(
    val waterFrequency: String = "",
    val lightNeeds: String = "",
    val toxicity: String = "",
    val additionalNotes: String = ""
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class HealthReport(
    val date: String = "",
    val healthStatus: String = "",
    val imageUrl: String = "",
    val advice: String? = null
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
