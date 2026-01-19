# Installation & One-Time Setup

This guide covers the initial setup required to run the Finnminn suite locally. These steps typically only need to be performed once.

## Architecture Overview

The applications (e.g., `necrobloom`, `pip`) follow a decoupled architecture:
1.  **Frontend**: React SPA (Vite) running on `http://localhost:5173`.
2.  **Backend**: Azure Functions (Kotlin/Java) running on `http://localhost:7071`.
3.  **Proxy**: The Vite development server proxies `/api` requests to the backend.

---

## Prerequisites & Installation

### 1. Core Tools
*   **Node.js (v20+)**: Recommended to use `nvm`.
    ```bash
    nvm install 20 && nvm use 20
    ```
*   **Java JDK (v21)**: Required for the Kotlin backend.
    ```bash
    # macOS (via Homebrew)
    brew install openjdk@21
    # Ensure JAVA_HOME is set in your shell profile
    ```
*   **Azure CLI**:
    ```bash
    brew install azure-cli
    ```
*   **Azure Functions Core Tools (v4)**:
    ```bash
    brew tap azure/functions
    brew install azure-functions-core-tools@4
    ```

### 2. Emulators
*   **Azurite (Azure Storage Emulator)**:
    ```bash
    npm install -g azurite
    ```
*   **Cosmos DB Emulator**:
    *   **Windows**: [Download & Install](https://learn.microsoft.com/en-us/azure/cosmos-db/local-emulator?tabs=ssl-netstd21).
    *   **macOS (Apple Silicon / Intel)**: Use the `vnext-preview` Docker image.
        ```bash
        docker run --name cosmos-emulator \
          --publish 8081:8081 \
          --publish 10250-10255:10250-10255 \
          --detach \
          mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:vnext-preview
        ```

---

## One-Time Setup (User Action Required)

### 1. Backend Configuration (`local.settings.json`)
The Azure Functions runtime requires a `local.settings.json` file. This file is **gitignored**.

**For `apps/necrobloom/api/`:**
Create `apps/necrobloom/api/local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "java",
    "CosmosDBConnectionString": "AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
    "BlobStorageConnectionString": "UseDevelopmentStorage=true",
    "MAIN_CLASS": "com.necrobloom.api.FunctionTriggers"
  },
  "Host": {
    "CORS": "http://localhost:5173,http://localhost:3000"
  }
}
```

### 2. Verify Emulators
*   **Cosmos DB**: Ensure Data Explorer is accessible at `https://localhost:8081/_explorer/index.html`.
*   **SSL/TLS (Java)**: The emulator uses a self-signed certificate. You may need to import the certificate into your JVM's `cacerts`.

```