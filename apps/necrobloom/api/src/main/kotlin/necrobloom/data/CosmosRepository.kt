package necrobloom.data

import com.azure.cosmos.CosmosClient
import com.azure.cosmos.CosmosClientBuilder
import com.azure.cosmos.CosmosContainer
import com.azure.cosmos.models.CosmosItemResponse
import com.azure.cosmos.models.PartitionKey
import com.azure.cosmos.models.SqlParameter
import com.azure.cosmos.models.SqlQuerySpec
import com.google.gson.Gson

class CosmosRepository {
    private val container: CosmosContainer

    companion object {
        private val gson = Gson()
        private val client: CosmosClient by lazy {
            val connectionString = System.getenv("COSMOS_CONNECTION_STRING")
            val (endpoint, key) = if (!connectionString.isNullOrBlank()) {
                parseConnectionString(connectionString)
            } else {
                Pair(System.getenv("COSMOS_ENDPOINT"), System.getenv("COSMOS_KEY"))
            }

            if (endpoint.isNullOrBlank() || key.isNullOrBlank()) {
                throw IllegalStateException("Cosmos DB configuration is incomplete. Missing endpoint or key.")
            }

            CosmosClientBuilder()
                .endpoint(endpoint)
                .key(key)
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

    init {
        val databaseName = System.getenv("COSMOS_DATABASE") ?: "NecroBloomDB"
        val containerName = System.getenv("COSMOS_CONTAINER") ?: "Plants"

        val database = client.getDatabase(databaseName)
        container = database.getContainer(containerName)
    }

    fun save(plant: Plant): Plant {
        val response: CosmosItemResponse<Plant> = container.upsertItem(plant)
        return response.item ?: plant
    }

    fun findById(id: String, userId: String): Plant? {
        return try {
            val response = container.readItem(id, PartitionKey(userId), Plant::class.java)
            response.item
        } catch (e: Exception) {
            // Log error here or handle specific status codes like 404
            null
        }
    }

    fun deleteById(id: String, userId: String): Boolean {
        return try {
            container.deleteItem(id, PartitionKey(userId), null)
            true
        } catch (e: Exception) {
            false
        }
    }

    fun findAllByUserId(userId: String): List<Plant> {
        val query = "SELECT * FROM c WHERE c.userId = @userId"
        val querySpec = SqlQuerySpec(query, SqlParameter("@userId", userId))
        return container.queryItems(querySpec, null, Plant::class.java).toList()
    }
}
