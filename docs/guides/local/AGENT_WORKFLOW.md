# Agentic Local Development Workflow

This guide is designed for **Gemini Agents** to autonomously run and test the application suite.

## Architecture Overview

1.  **Frontend**: `http://localhost:5173` (Vite)
2.  **Backend**: `http://localhost:7071` (Azure Functions)
3.  **Storage**: `http://localhost:10000` (Azurite)

## Responsibility Matrix

| Process / Task | Responsible Party | Notes |
| :--- | :--- | :--- |
| **Emulators (Cosmos/Azurite)**| **Agent / User** | Use `docker compose up -d` if Docker is active. |
| **Backend (Functions)** | **Agent** | Start via `./gradlew azureFunctionsRun`. |
| **Frontend (Vite)** | **Agent** | Start via `npm run dev -- --filter=<app>`. |
| **Authentication** | **User / Agent** | Agent uses local mock principal. User handles real login if needed. |

---

## Running the Application (Agent Instructions)

### Step 1: Bootstrap the Environment
Use the automated script to start emulators and generate configurations:
```bash
npm run bootstrap
```

### Step 2: Start the Backend (Azure Functions)
Run this from the root or the API directory. Warm-up: ~15-30s.

**NOTE**: The `azureFunctionsRun` task will automatically create `local.settings.json` from `local.settings.example.json` if it is missing.

```bash
lsof -ti:7071 || (cd apps/pip/api && nohup ./gradlew azureFunctionsRun > backend.log 2>&1 &)
```
**Verification**: Poll until it returns "hello world" (Pip) or "Vitality stable" (NecroBloom):
```bash
curl -s http://localhost:7071/api/hello
```

### Step 3: Start the Frontend (Vite)
**IMPORTANT**: Always use `localhost` (not `127.0.0.1`) to ensure MSAL redirect URIs match.
```bash
lsof -ti:5173 || nohup npm run dev -- --filter=pip --host localhost > frontend.log 2>&1 &
```
**Verification**: Confirm port 5173 is listening and check `frontend.log` for "VITE ready".

---

## Agent Workflow: Testing & Browser Control

1.  **Monitor Logs**: If a service isn't responding, check the local `.log` files created in the steps above (`frontend.log`, `backend.log`).
2.  **Open Browser**: Call `new_page` with `url: "http://localhost:5173"`.
3.  **Authentication**:
    - **Local Mocking**: The Vite proxy automatically injects a mock `x-ms-client-principal` header for backend requests.
    - **User Action**: If the frontend shows a "Login" button or the console shows `NO_ACTIVE_ACCOUNT`, the agent **MUST** stop and ask the USER to sign in manually via the browser. Automated testing cannot proceed until a session is active.
4.  **Detect Interface**: Wait for "QUICK_CAPTURE" (Pip) or "COLLECTION FROM THE VOID" (NecroBloom) to appear.
5.  **Execute Tests**: Use `click`, `fill`, and `take_snapshot` to verify functionality.

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
