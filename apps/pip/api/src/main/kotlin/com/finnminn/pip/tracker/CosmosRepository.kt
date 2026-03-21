package com.finnminn.pip.tracker

import com.azure.cosmos.CosmosClient
import com.azure.cosmos.CosmosClientBuilder
import com.azure.cosmos.CosmosContainer
import com.azure.cosmos.CosmosException
import com.azure.cosmos.models.CosmosItemResponse
import com.azure.cosmos.models.PartitionKey
import com.azure.cosmos.models.SqlParameter
import com.azure.cosmos.models.SqlQuerySpec
import java.util.logging.Logger

class CosmosRepository {
    private val logger = Logger.getLogger(CosmosRepository::class.java.name)
    private val container: CosmosContainer by lazy {
        val databaseName = System.getenv("COSMOS_DATABASE") ?: "Pip"
        val containerName = System.getenv("COSMOS_CONTAINER") ?: "Items"

        client.createDatabaseIfNotExists(databaseName)
        val database = client.getDatabase(databaseName)
        database.createContainerIfNotExists(containerName, "/userId")
        database.getContainer(containerName)
    }

    companion object {
        private val client: CosmosClient by lazy {
            val connectionString = System.getenv("COSMOS_CONNECTION_STRING") 
                ?: System.getenv("CosmosDBConnectionString")
            
            val (endpoint, key) = if (!connectionString.isNullOrBlank()) {
                parseConnectionString(connectionString)
            } else {
                Pair(
                    System.getenv("COSMOS_ENDPOINT"), 
                    System.getenv("COSMOS_KEY")
                )
            }

            CosmosClientBuilder()
                .endpoint(endpoint ?: "https://localhost:8081/")
                .key(key)
                .gatewayMode()
                .buildClient()
        }

        private fun parseConnectionString(connectionString: String): Pair<String?, String?> {
            var endpoint: String? = null
            var key: String? = null
            connectionString.split(";").forEach {
                val parts = it.split("=", limit = 2)
                if (parts.size == 2) {
                    when (parts[0].trim().lowercase()) {
                        "accountendpoint" -> endpoint = parts[1].trim()
                        "accountkey" -> key = parts[1].trim()
                    }
                }
            }
            return Pair(endpoint, key)
        }
    }

    fun <T> save(item: T): T {
        return try {
            val response: CosmosItemResponse<T> = container.upsertItem(item)
            response.item ?: item
        } catch (e: CosmosException) {
            logger.severe("Cosmos error saving item: ${e.message} (Status: ${e.statusCode})")
            throw e
        } catch (e: Exception) {
            logger.severe("Unexpected error saving item: ${e.message}")
            throw e
        }
    }

    fun findAllCapturesByUserId(userId: String): List<CaptureItem> {
        return try {
            val query = "SELECT TOP 50 * FROM c WHERE c.userId = @userId AND c.type = 'capture' ORDER BY c.timestamp DESC"
            val querySpec = SqlQuerySpec(query, SqlParameter("@userId", userId))
            container.queryItems(querySpec, null, CaptureItem::class.java).toList()
        } catch (e: CosmosException) {
            logger.severe("Cosmos error finding captures for user $userId: ${e.message} (Status: ${e.statusCode})")
            emptyList()
        } catch (e: Exception) {
            logger.severe("Unexpected error finding captures for user $userId: ${e.message}")
            emptyList()
        }
    }

    fun findAllRitualsByUserId(userId: String): List<Ritual> {
        return try {
            val query = "SELECT * FROM c WHERE c.userId = @userId AND c.type = 'ritual' ORDER BY c.timestamp DESC"
            val querySpec = SqlQuerySpec(query, SqlParameter("@userId", userId))
            container.queryItems(querySpec, null, Ritual::class.java).toList()
        } catch (e: CosmosException) {
            logger.severe("Cosmos error finding rituals for user $userId: ${e.message} (Status: ${e.statusCode})")
            emptyList()
        } catch (e: Exception) {
            logger.severe("Unexpected error finding rituals for user $userId: ${e.message}")
            emptyList()
        }
    }

    fun findAllHabitLogsByUserIdAndDateRange(userId: String, startDate: String, endDate: String): List<HabitLog> {
        return try {
            val query = "SELECT * FROM c WHERE c.userId = @userId AND c.type = 'habitLog' AND c.date >= @startDate AND c.date <= @endDate"
            val querySpec = SqlQuerySpec(query, 
                SqlParameter("@userId", userId),
                SqlParameter("@startDate", startDate),
                SqlParameter("@endDate", endDate)
            )
            container.queryItems(querySpec, null, HabitLog::class.java).toList()
        } catch (e: CosmosException) {
            logger.severe("Cosmos error finding logs for user $userId in range $startDate to $endDate: ${e.message} (Status: ${e.statusCode})")
            emptyList()
        } catch (e: Exception) {
            logger.severe("Unexpected error finding logs for user $userId: ${e.message}")
            emptyList()
        }
    }

    fun findHabitLogByRitualIdAndDate(userId: String, ritualId: String, date: String): HabitLog? {
        return try {
            val query = "SELECT * FROM c WHERE c.userId = @userId AND c.type = 'habitLog' AND c.ritualId = @ritualId AND c.date = @date"
            val querySpec = SqlQuerySpec(query, 
                SqlParameter("@userId", userId),
                SqlParameter("@ritualId", ritualId),
                SqlParameter("@date", date)
            )
            container.queryItems(querySpec, null, HabitLog::class.java).firstOrNull()
        } catch (e: CosmosException) {
            logger.severe("Cosmos error finding log for ritual $ritualId on $date: ${e.message} (Status: ${e.statusCode})")
            null
        } catch (e: Exception) {
            logger.severe("Unexpected error finding log for ritual $ritualId: ${e.message}")
            null
        }
    }

    fun findAllHabitLogsByUserIdAndRitualId(userId: String, ritualId: String): List<HabitLog> {
        return try {
            val query = "SELECT * FROM c WHERE c.userId = @userId AND c.type = 'habitLog' AND c.ritualId = @ritualId"
            val querySpec = SqlQuerySpec(query,
                SqlParameter("@userId", userId),
                SqlParameter("@ritualId", ritualId)
            )
            container.queryItems(querySpec, null, HabitLog::class.java).toList()
        } catch (e: CosmosException) {
            logger.severe("Cosmos error finding logs for ritual $ritualId for user $userId: ${e.message} (Status: ${e.statusCode})")
            emptyList()
        } catch (e: Exception) {
            logger.severe("Unexpected error finding logs for ritual $ritualId: ${e.message}")
            emptyList()
        }
    }

    fun deleteItem(id: String, userId: String, itemType: String = "Item"): Boolean {
        return try {
            container.deleteItem(id, PartitionKey(userId), null)
            true
        } catch (e: CosmosException) {
            if (e.statusCode == 404) {
                logger.warning("$itemType $id not found for user $userId")
                true // Idempotent success
            } else {
                logger.severe("Cosmos error deleting $itemType $id: ${e.message}")
                false
            }
        } catch (e: Exception) {
            logger.severe("Unexpected error deleting $itemType $id: ${e.message}")
            false
        }
    }

    fun deleteCapture(id: String, userId: String): Boolean {
        return deleteItem(id, userId, "Capture")
    }
}
