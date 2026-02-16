package com.finnminn.pip.tracker

import com.azure.cosmos.CosmosClient
import com.azure.cosmos.CosmosClientBuilder
import com.azure.cosmos.CosmosContainer
import com.azure.cosmos.models.CosmosItemResponse
import com.azure.cosmos.models.PartitionKey
import com.azure.cosmos.models.SqlParameter
import com.azure.cosmos.models.SqlQuerySpec

class CosmosRepository {
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

    fun save(item: CaptureItem): CaptureItem {
        val response: CosmosItemResponse<CaptureItem> = container.upsertItem(item)
        return response.item ?: item
    }

    fun findAllCapturesByUserId(userId: String): List<CaptureItem> {
        val query = "SELECT TOP 50 * FROM c WHERE c.userId = @userId AND c.type = 'capture' ORDER BY c.timestamp DESC"
        val querySpec = SqlQuerySpec(query, SqlParameter("@userId", userId))
        return container.queryItems(querySpec, null, CaptureItem::class.java).toList()
    }

    fun delete(id: String, userId: String) {
        container.deleteItem(id, PartitionKey(userId), null)
    }
}
