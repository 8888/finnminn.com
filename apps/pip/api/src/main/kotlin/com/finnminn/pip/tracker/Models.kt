package com.finnminn.pip.tracker

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class CaptureItem(
    val id: String? = null,
    val userId: String? = null,
    val type: String = "capture",
    val content: String = "",
    val source: String? = "text",
    val timestamp: String? = null,
    val status: String? = "inbox"
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class Ritual(
    val id: String? = null,
    val userId: String? = null,
    val type: String = "ritual",
    val name: String = "",
    val nature: String = "light", // "light" or "void"
    val timestamp: String? = null
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class HabitLog(
    val id: String? = null,
    val userId: String? = null,
    val type: String = "habitLog",
    val ritualId: String = "",
    val date: String = "", // YYYY-MM-DD
    val completed: Boolean = false,
    val timestamp: String? = null
)
