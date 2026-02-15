# Installation & One-Time Setup

This guide covers the initial setup required to run the Finnminn suite locally.

## 🚀 Quick Start (Automated Setup)
We provide a bootstrap script that handles emulators, configuration files, and common environment checks:

```bash
npm run bootstrap
```
This script will:
1. Start Cosmos DB and Azurite emulators (via Docker Compose).
2. Create `local.settings.json` for all API apps.
3. Verify basic connectivity.

---

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

### 2. Emulators (Preferred Method: Docker Compose)
The easiest way to run the required emulators (Cosmos DB and Azurite) is via Docker Compose:

```bash
# Start all dependencies in the background
docker compose up -d
```

**Manual Alternatives**:
*   **Azurite (Azure Storage Emulator)**: `npm install -g azurite`
*   **Cosmos DB Emulator**:
    *   **Windows**: [Download & Install](https://learn.microsoft.com/en-us/azure/cosmos-db/local-emulator?tabs=ssl-netstd21).
    *   **macOS/Linux**: Use the standalone docker command:
        ```bash
        docker run --name cosmos-emulator -p 8081:8081 -p 10250-10255:10250-10255 -d mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:vnext-preview
        ```

---

## One-Time Setup (User Action Required)

### 1. Backend Configuration (`local.settings.json`)
The Azure Functions runtime requires a `local.settings.json` file. This file is **gitignored**.

**For `apps/necrobloom/api/`:**
Create `apps/necrobloom/api/local.settings.json`:
(See existing template below)

**For `apps/pip/api/`:**
Create `apps/pip/api/local.settings.json`. Note that Pip uses `COSMOS_` prefixed keys:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "java",
    "COSMOS_CONNECTION_STRING": "AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
    "COSMOS_KEY": "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
    "COSMOS_ENDPOINT": "https://localhost:8081/",
    "COSMOS_DATABASE": "Pip",
    "COSMOS_CONTAINER": "Items"
  },
  "Host": {
    "CORS": "http://localhost:5173"
  }
}
```

### 2. Verify Emulators
*   **Cosmos DB**: Ensure Data Explorer is accessible at `https://localhost:8081/_explorer/index.html`.
*   **SSL/TLS (Java)**: The emulator uses a self-signed certificate. If the backend fails with `Client initialization failed` or `SSLHandshakeException`, you **must** import the certificate into your JVM's `cacerts`:
    1.  **Download Certificate**: 
        - Open `https://localhost:8081/_explorer/index.html` in a browser.
        - Click the "lock" icon in the address bar -> Connection is secure -> Certificate is valid.
        - Go to the "Details" or "Copy to File" (Windows) / "Export" (macOS) tab and save as `emulator.cer` (Base64 encoded X.509).
        - *Alternatively (CLI)*: `openssl s_client -connect localhost:8081 </dev/null | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > emulator.cer`
    2.  **Import to Keystore**:
        ```bash
        # Identify your JAVA_HOME
        echo $JAVA_HOME
        
        # Import (Default password: changeit)
        sudo keytool -importcert -alias cosmos-emulator -file emulator.cer -keystore $JAVA_HOME/lib/security/cacerts -trustcacerts
        ```
    3.  **Restart**: Restart your terminal and the `./gradlew azureFunctionsRun` task.

### 3. Local Authentication Mocking
To avoid `401 Unauthorized` errors during local development, the Vite proxy for each app (e.g., `apps/pip/vite.config.ts`) is configured to inject a mock `x-ms-client-principal` header.

*   **Mock Identity**: `local-dev-agent`
*   **Roles**: `["authenticated"]`

This allows you to test protected routes without needing a real Azure Static Web App environment. If you need to test with different users, update the `mockPrincipal` Base64 string in `vite.config.ts`.

```