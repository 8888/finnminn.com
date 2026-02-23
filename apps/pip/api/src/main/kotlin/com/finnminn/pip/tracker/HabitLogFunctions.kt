package com.finnminn.pip.tracker

import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.time.Instant
import java.util.Optional
import java.util.UUID

class HabitLogFunctions {
    private val mapper = jacksonObjectMapper()
    var repository = CosmosRepository()

    @FunctionName("GetHabitLogs")
    fun getHabitLogs(
        @HttpTrigger(
            name = "req",
            methods = [HttpMethod.GET],
            route = "habitlogs",
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<Optional<String>>,
        context: ExecutionContext
    ): HttpResponseMessage {
        val userId = SecurityUtils.getUserId(request.headers)
            ?: return request.createResponseBuilder(HttpStatus.UNAUTHORIZED).build()

        val startDate = request.queryParameters["startDate"] ?: return request.createResponseBuilder(HttpStatus.BAD_REQUEST).body("Missing startDate").build()
        val endDate = request.queryParameters["endDate"] ?: return request.createResponseBuilder(HttpStatus.BAD_REQUEST).body("Missing endDate").build()

        return try {
            val logs = repository.findAllHabitLogsByUserIdAndDateRange(userId, startDate, endDate)
            request.createResponseBuilder(HttpStatus.OK)
                .body(mapper.writeValueAsString(logs))
                .header("Content-Type", "application/json")
                .build()
        } catch (e: Exception) {
            context.logger.severe("Error getting habit logs: ${e.message}")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    @FunctionName("ToggleHabitLog")
    fun toggleHabitLog(
        @HttpTrigger(
            name = "req",
            methods = [HttpMethod.POST],
            route = "habitlogs/toggle",
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<Optional<String>>,
        context: ExecutionContext
    ): HttpResponseMessage {
        val userId = SecurityUtils.getUserId(request.headers)
            ?: return request.createResponseBuilder(HttpStatus.UNAUTHORIZED).build()

        val body = request.body.orElse(null)
            ?: return request.createResponseBuilder(HttpStatus.BAD_REQUEST).body("Missing body").build()

        return try {
            val partialLog = mapper.readValue(body, HabitLog::class.java)
            if (partialLog.ritualId.isBlank() || partialLog.date.isBlank()) {
                return request.createResponseBuilder(HttpStatus.BAD_REQUEST).body("ritualId and date are required").build()
            }

            val existingLog = repository.findHabitLogByRitualIdAndDate(userId, partialLog.ritualId, partialLog.date)
            
            val item = if (existingLog != null) {
                existingLog.copy(
                    completed = !existingLog.completed,
                    timestamp = Instant.now().toString()
                )
            } else {
                HabitLog(
                    id = UUID.randomUUID().toString(),
                    userId = userId,
                    type = "habitLog",
                    ritualId = partialLog.ritualId,
                    date = partialLog.date,
                    completed = true,
                    timestamp = Instant.now().toString()
                )
            }

            repository.save(item)

            request.createResponseBuilder(HttpStatus.OK)
                .body(mapper.writeValueAsString(item))
                .header("Content-Type", "application/json")
                .build()
        } catch (e: Exception) {
            context.logger.severe("Error toggling habit log: ${e.message}")
            request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }
}
