---
name: Local Environment Manager
description: Skill for starting, monitoring, and cleaning up the Finnminn local development environment (Frontend, Backend, and Emulators).
---

# Local Environment Manager

This skill provides a standardized way for agents to manage the local development lifecycle of Finnminn applications.

## 📂 Structure
- `scripts/manage_env.sh`: A multi-purpose script to handle common tasks.
- `SKILL.md`: This instruction file.

## 🚀 Core Tasks

### 1. Bootstrap
Prepares the environment, starts Docker emulators (Cosmos/Azurite), and ensures `local.settings.json` exists.
```bash
./.agents/skills/local_env/scripts/manage_env.sh bootstrap
```

### 2. Start Services
Starts both backend and frontend for a specific app (e.g., `pip`, `necrobloom`, or `web`).

**Backend:**
```bash
./.agents/skills/local_env/scripts/manage_env.sh start_backend <app>
```

**Frontend:**
```bash
./.agents/skills/local_env/scripts/manage_env.sh start_frontend <app>
```

### 3. Start Everything
Starts the entire suite simultaneously on isolated ports and verifies readiness.
```bash
./.agents/skills/local_env/scripts/manage_env.sh start_all
```

### 4. Wait for Ready
Polls all assigned ports and only returns when all services are responsive.
```bash
./.agents/skills/local_env/scripts/manage_env.sh wait_for_ready
```

### 5. Cleanup
Terminate all background processes associated with the dev environment.
```bash
./.agents/skills/local_env/scripts/manage_env.sh cleanup
```

## 🔍 Verification & Port Map

| App | Frontend Port | Backend Port | Debug Port | Verification URL |
| :--- | :--- | :--- | :--- | :--- |
| **Pip** | 5173 | 7071 | 5006 | `http://localhost:7071/api/hello` |
| **Necrobloom** | 5174 | 7072 | 5005 | `http://localhost:7072/api/Ping` |
| **Web** | 5175 | N/A | N/A | `http://localhost:5175` |
| **EventHorizon** | 5176 | N/A | N/A | `http://localhost:5176` |

## ⚠️ Important Notes
- **Hosts**: Always use `localhost` for testing in the browser to ensure the local proxy and mock authentication work correctly.
- **Authentication**: After starting services, verify the authentication state in the browser. If the "Login" page is visible or "NO_ACTIVE_ACCOUNT" is encountered, you **MUST** stop and ask the USER to sign in manually before continuing.
- **Port Isolation**: Each app is assigned a unique port to allow simultaneous local development without collisions.
- **Logs**: All background process logs are stored in the root `logs/` directory.
    - `logs/backend-<app>.log`
    - `logs/frontend-<app>.log`
- **Monorepo Orchestration**: For frontends, prefer using `npx turbo run dev -- --host localhost` from the monorepo root to leverage Turborepo's orchestration and automatic port conflict handling.
