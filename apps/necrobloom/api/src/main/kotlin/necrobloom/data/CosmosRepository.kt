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
    private val gson = Gson()

    companion object {
        private val client: CosmosClient by lazy {
            val endpoint = System.getenv("COSMOS_ENDPOINT")
            val key = System.getenv("COSMOS_KEY")
            CosmosClientBuilder()
                .endpoint(endpoint)
                .key(key)
                .buildClient()
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
        return response.item
    }

    fun findById(id: String, userId: String): Plant? {
        return try {
            val response: CosmosItemResponse<Plant> = container.readItem(
                id, PartitionKey(userId), Plant::class.java
            )
            response.item
        } catch (e: Exception) {
            null
        }
    }

    fun findAllByUserId(userId: String): List<Plant> {
        val query = "SELECT * FROM c WHERE c.userId = @userId"
        val querySpec = SqlQuerySpec(query, SqlParameter("@userId", userId))
        return container.queryItems(querySpec, null, Plant::class.java).toList()
    }
}
