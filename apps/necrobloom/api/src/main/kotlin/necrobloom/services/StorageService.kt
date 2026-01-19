package necrobloom.services

import com.azure.storage.blob.BlobContainerClient
import com.azure.storage.blob.BlobServiceClientBuilder
import com.azure.storage.blob.sas.BlobSasPermission
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues
import java.io.ByteArrayInputStream
import java.time.OffsetDateTime
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

    fun generateSasUrl(blobUrl: String): String {
        if (blobUrl.isBlank()) return ""
        
        return try {
            val cleanUrl = blobUrl.substringBefore("?")
            val blobName = cleanUrl.substringAfterLast("/")
            val blobClient = containerClient.getBlobClient(blobName)
            
            val permission = BlobSasPermission().setReadPermission(true)
            val expiryTime = OffsetDateTime.now().plusHours(2)
            val values = BlobServiceSasSignatureValues(expiryTime, permission)
            
            val sasToken = blobClient.generateSas(values)
            "$cleanUrl?$sasToken"
        } catch (e: Exception) {
            blobUrl // Fallback to original URL
        }
    }

    fun deleteImage(blobUrl: String): Boolean {
        if (blobUrl.isBlank()) return true
        return try {
            val cleanUrl = blobUrl.substringBefore("?")
            val blobName = cleanUrl.substringAfterLast("/")
            val blobClient = containerClient.getBlobClient(blobName)
            blobClient.deleteIfExists()
            true
        } catch (e: Exception) {
            false
        }
    }
}
