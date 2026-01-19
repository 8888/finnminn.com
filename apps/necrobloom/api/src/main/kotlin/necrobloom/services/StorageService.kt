package necrobloom.services

import com.azure.storage.blob.BlobContainerClient
import com.azure.storage.blob.BlobServiceClientBuilder
import java.io.ByteArrayInputStream
import java.util.UUID

class StorageService {

    companion object {
        private val containerClient: BlobContainerClient by lazy {
            val connectionString = System.getenv("BLOB_CONNECTION_STRING")
            val containerName = System.getenv("STORAGE_CONTAINER") ?: "vessel-images"

            val blobServiceClient = BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient()

            val client = blobServiceClient.getBlobContainerClient(containerName)
            client.createIfNotExists()
            client
        }
    }

    fun uploadImage(bytes: ByteArray, extension: String): String {
        val fileName = "${UUID.randomUUID()}.$extension"
        val blobClient = containerClient.getBlobClient(fileName)
        
        blobClient.upload(ByteArrayInputStream(bytes), bytes.size.toLong(), true)
        
        return blobClient.blobUrl
    }
}
