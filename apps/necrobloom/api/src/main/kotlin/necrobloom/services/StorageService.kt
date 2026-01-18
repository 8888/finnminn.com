package necrobloom.services

import com.azure.storage.blob.BlobContainerClient
import com.azure.storage.blob.BlobServiceClientBuilder
import java.io.ByteArrayInputStream
import java.util.UUID

class StorageService {
    private val containerClient: BlobContainerClient

    init {
        val connectionString = System.getenv("STORAGE_CONNECTION_STRING")
        val containerName = System.getenv("STORAGE_CONTAINER") ?: "vessel-images"

        val blobServiceClient = BlobServiceClientBuilder()
            .connectionString(connectionString)
            .buildClient()

        containerClient = blobServiceClient.getBlobContainerClient(containerName)
        if (!containerClient.exists()) {
            containerClient.create()
        }
    }

    fun uploadImage(bytes: ByteArray, extension: String): String {
        val fileName = "${UUID.randomUUID()}.$extension"
        val blobClient = containerClient.getBlobClient(fileName)
        
        blobClient.upload(ByteArrayInputStream(bytes), bytes.size.toLong(), true)
        
        return blobClient.blobUrl
    }
}
