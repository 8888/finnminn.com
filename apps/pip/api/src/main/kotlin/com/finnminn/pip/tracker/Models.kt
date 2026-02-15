package com.finnminn.pip.tracker

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class CaptureItem(
    val id: String? = null,
    val userId: String? = null,
    val type: String = "capture",
    val content: String,
    val source: String? = "text",
    val timestamp: String? = null,
    val status: String? = "inbox"
)
