package com.finnminn.necrobloom.models

import java.util.UUID

data class Vessel(
    val id: String = UUID.randomUUID().toString(),
    val userId: String,
    val species: String,
    val alias: String? = null,
    val location: String? = null,
    val zipCode: String? = null,
    val carePlan: CarePlan? = null,
    val reports: List<VitalityReport> = emptyList()
)

data class CarePlan(
    val lighting: String,
    val watering: String,
    val notes: String? = null
)

data class VitalityReport(
    val id: String = UUID.randomUUID().toString(),
    val timestamp: Long = System.currentTimeMillis(),
    val status: String,
    val analysis: String,
    val imageUrl: String
)

data class IdentifyRequest(
    val imageUrl: String,
    val zipCode: String? = null,
    val location: String? = null
)
