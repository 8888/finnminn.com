# Pip - Serverless Habit Tracker

## Project Overview
Pip is a serverless habit-tracking application featuring a gothic retro-tech aesthetic. It is a member of the Finnminn suite, sharing identity and design tokens with the root domain.

## Architecture
This application is integrated into the `finnminn.com` monorepo and follows a decoupled frontend/backend structure.

- **Frontend**: React + Vite SPA.
- **Backend**: Azure Functions (Kotlin) hosted in the nested `api/` directory.
- **Identity**: Microsoft Entra ID (via `@finnminn/auth`).
- **Design System**: PixelGrim (via `@finnminn/ui`).

### Folder Structure
- `apps/pip/src/`: React frontend source code.
- `apps/pip/api/`: Kotlin backend source code (Azure Functions).
- `apps/pip/public/`: Static assets including mascot animation frames.

## Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS.
- **Backend**: Kotlin (JVM 21), Azure Functions Java Library 3.1.0.
- **Build System**: npm (root) for frontend, Gradle (Kotlin DSL) for backend.
- **Database**: Azure Cosmos DB for NoSQL (Core SQL).

## Deployed Infrastructure (Resource Group: `pip-rg`)
| Resource Name | Type | Location | Details |
| :--- | :--- | :--- | :--- |
| **pip-tracker** | Function App | `canadacentral` | Linux, Consumption Plan (Y1), System Assigned Identity. |
| **ASP-piprg-a804** | App Service Plan | `canadacentral` | Dynamic (Serverless). |
| **piprg9b25** | Storage Account | `canadacentral` | Standard_LRS. Used by Function App. |
| **pip-cosmos** | Cosmos DB Account | `eastus` | NoSQL (Core) API, Serverless mode. |
| **pip-vault** | Key Vault | `eastus` | For managing secrets. |
| **Pip-api** | API Management | `canadacentral` | Consumption Tier gateway. |
| **Pip-web-app** | Static Web App | `eastus2` | Free Tier. Hosts the React frontend. |

## Getting Started

### Local Development
1. **Frontend**:
   From the monorepo root:
   ```bash
   npm run dev -- --filter=pip
   ```
2. **Backend**:
   ```bash
   cd apps/pip/api
   ./gradlew azureFunctionsRun
   ```
   The API will be available at `http://localhost:7071/api/hello`.

### Build
- **Frontend**: `npx turbo run build --filter=pip`
- **Backend**: `cd apps/pip/api && ./gradlew build azureFunctionsPackage`

## CI/CD
The application uses split deployment pipelines:
- **Frontend**: Managed by `.github/workflows/azure-static-web-apps-mango-pebble-0e55b260f.yml`.
- **Backend**: Managed by `.github/workflows/deploy-pip-backend.yml`.

## Features & Implementation
- **Animated Mascot**: Implemented as a React hook-based component (`Mascot.tsx`) that cycles through ASCII frames in the `public/mascot/` folder.
- **Authentication**: Uses the shared `AuthProvider` to ensure only Finnminn agents can access tracker data.