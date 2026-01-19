# Agentic Local Development Workflow

This guide is designed for **Gemini Agents** to autonomously run and test the application suite.

## Architecture Overview

1.  **Frontend**: `http://localhost:5173` (Vite)
2.  **Backend**: `http://localhost:7071` (Azure Functions)
3.  **Storage**: `http://localhost:10000` (Azurite)

## Responsibility Matrix

| Process / Task | Responsible Party | Notes |
| :--- | :--- | :--- |
| **Cosmos DB Emulator** | **User** | Must be running before agent starts. |
| **Azurite (Storage)** | **Agent** | Start if not running (`nohup azurite`). |
| **Backend (Functions)** | **Agent** | Start via `./gradlew azureFunctionsRun`. |
| **Frontend (Vite)** | **Agent** | Start via `npm run dev -- --filter=<app>`. |
| **Authentication** | **User** | User performs MSAL login in the agent-opened browser. |

---

## Running the Application (Agent Instructions)

### Step 1: Start Azurite (Storage Emulator)
```bash
lsof -ti:10000 || nohup azurite > /dev/null 2>&1 &
```

### Step 2: Start the Backend (Azure Functions)
Run this from the root or the API directory. Warm-up: ~15-30s.
```bash
lsof -ti:7071 || nohup cd apps/necrobloom/api && ./gradlew azureFunctionsRun > /dev/null 2>&1 &
```
**Verification**: Poll until it returns "Vitality stable":
```bash
curl -s http://localhost:7071/api/Ping
```

### Step 3: Start the Frontend (Vite)
```bash
lsof -ti:5173 || nohup npm run dev -- --filter=necrobloom > /dev/null 2>&1 &
```
**Verification**: Confirm port 5173 is listening.

---

## Agent Workflow: Testing & Browser Control

1.  **Open Browser**: Call `new_page` with `url: "http://localhost:5173"`.
2.  **Trigger Login**: 
    - Click the button labeled **"ESTABLISH CONNECTION"**.
    - Prompt the user: "I have launched the application. Please complete the login in the browser so I can proceed."
3.  **Detect Dashboard**: Wait for "COLLECTION FROM THE VOID" or your Agent ID to appear in the snapshot.
4.  **Execute Tests**: Use `click`, `fill`, and `take_snapshot` to verify functionality.

---

## Cleanup (Mandatory)

Before concluding, terminate all background processes:
```bash
lsof -ti:5173,7071,10000 | xargs kill -9
```

## Troubleshooting

-   **Frontend Logs**: Check `nohup.out` if the port is not responding.
-   **Port Conflicts**: Use `lsof -ti:<port>` to find and kill blocking PIDs.
-   **Cosmos**: Ensure the user has the emulator active on port 8081.
