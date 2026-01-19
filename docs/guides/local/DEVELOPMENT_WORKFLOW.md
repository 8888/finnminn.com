# Local Development Workflow (Human Guide)

This guide is for humans developing and testing the `finnminn.com` suite locally. It uses multiple terminal tabs/windows instead of background processes for easier monitoring and control.

## Prerequisites

1.  **Cosmos DB Emulator**: Ensure the Azure Cosmos DB Emulator is running on your machine (default port `8081`).
2.  **Node.js**: Ensure you have the required Node.js version installed (see root `package.json`).
3.  **Java/JDK**: Ensure JDK 21 is installed for backend development.

---

## Running the Application

Follow these steps in separate terminal windows or tabs:

### 1. Start Azurite (Storage Emulator)
Open a new terminal and run:
```bash
azurite
```
*Keep this running. It handles blob and queue storage locally.*

### 2. Start the Backend (Azure Functions)
Open a second terminal, navigate to the specific app's API directory, and start the functions:

**For NecroBloom:**
```bash
cd apps/necrobloom/api
./gradlew azureFunctionsRun
```

**For Pip:**
```bash
cd apps/pip/api
./gradlew azureFunctionsRun
```
*Wait for the "Worker process started and connected" message (~15-30s).*

### 3. Start the Frontend (Vite)
Open a third terminal in the root directory and run the dev server for your target app:

**For NecroBloom:**
```bash
npm run dev -- --filter=necrobloom
```

**For Pip:**
```bash
npm run dev -- --filter=pip
```

---

## Testing & Authentication

1.  **Access the App**: Open [http://localhost:5173](http://localhost:5173) in your browser.
2.  **Login**: Click **"ESTABLISH CONNECTION"**. You will be redirected to Microsoft Entra ID. Complete the login with your credentials.
3.  **Verify Backend**: If data isn't loading, ensure the backend terminal shows incoming requests and no 500 errors.

---

## Stopping the Processes

To stop any service, simply go to its terminal window and press:
`Ctrl + C`

## Troubleshooting

-   **Port 10000/7071/5173 is busy**: A previous process might still be hanging. You can find and kill it with:
    ```bash
    lsof -ti:5173,7071,10000 | xargs kill -9
    ```
-   **Azurite Errors**: Ensure you don't have multiple instances of Azurite trying to use the same data folder.
-   **Cosmos DB**: If the backend fails to start, verify the Cosmos DB Emulator is actually running and accessible at `https://localhost:8081/_explorer/index.html`.
