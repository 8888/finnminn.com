# NecroBloom - Gothic Plant Tracker

## Project Overview
NecroBloom is a serverless plant-tracking application featuring a whimsically gothic "PixelGrim" aesthetic. It allows users to identify plants, generate care plans, and monitor health using AI.

## Architecture
- **Frontend**: React + Vite SPA.
- **Backend**: Azure Functions (Kotlin/Java 21).
- **Identity**: Microsoft Entra ID (via `@finnminn/auth`).
- **Design System**: PixelGrim (via `@finnminn/ui`).
- **AI**: Gemini 2.5 Flash.

## Deployed Infrastructure (Resource Group: `necrobloom-rg`)
| Resource Name | Type | Location | Details |
| :--- | :--- | :--- | :--- |
| **necrobloom-api** | Function App | `canadacentral` | Windows, Consumption Plan (Y1), System Assigned Identity. |
| **necrobloom-api** | App Insights | `canadacentral` | Telemetry and logging. |
| **ASP-necrobloomrg-8596** | App Service Plan | `canadacentral` | Dynamic (Serverless). |
| **necrobloomstorage** | Storage Account | `eastus` | Standard_LRS. Primary vessel for images (`vessel-images`). |
| **necrobloomrg9f4f** | Storage Account | `canadacentral` | Internal storage for Function App. |
| **necrobloom-cosmos** | Cosmos DB Account | `westus2` | NoSQL (Core) API, Serverless mode. |
| **necrobloom-web** | Static Web App | `eastus2` | Free Tier. |

## Database & Storage
- **Database**: `NecroBloomDB`
- **Container**: `Plants` (Partition Key: `/userId`)
- **Blob Container**: `vessel-images` (for plant photos)

## Core Features
- **Plant Identification**: AI-powered recognition from photos.
- **Gothic Care Plans**: Automated care instructions with a whimsically dark tone.
- **Health Monitoring**: Real-time health assessment and diagnostic "oracles".
- **Plant Vessel**: A digital garden for tracking plant lifecycle and history.

## Getting Started

### Local Development
1. **Frontend**:
   From the monorepo root:
   ```bash
   npm run dev -- --filter=necrobloom
   ```
2. **Backend**:
   ```bash
   cd apps/necrobloom/api
   ./gradlew azureFunctionsRun
   ```
   The API will be available at `http://localhost:7071/api/plants`.

### Build
- **Frontend**: `npx turbo run build --filter=necrobloom`
- **Backend**: `cd apps/necrobloom/api && ./gradlew build azureFunctionsPackage`

## CI/CD
The application uses split deployment pipelines:
- **Frontend**: Managed by `.github/workflows/azure-static-web-apps-zealous-tree-08c25ec0f.yml`.
- **Backend**: Managed by `.github/workflows/deploy-necrobloom-backend.yml`.

### Troubleshooting & Fixes
- **Backend Deployment (401 Unauthorized)**:
    - **Issue**: GitHub Action failed with `Unauthorized (CODE: 401)` when fetching Kudu App Settings via publish profile.
    - **Fix 1**: Corrected a typo in the secret name in `.github/workflows/deploy-necrobloom-backend.yml` (`AZURE_NECOBLOOM_...` to `AZURE_NECROBLOOM_...`).
    - **Fix 2**: Enabled SCM Basic Auth on the Function App (Azure defaults this to disabled).
    - **Fix 3**: (Action Required) Ensure the GitHub secret `AZURE_NECROBLOOM_API_PUBLISH_PROFILE` contains a **freshly downloaded** publish profile from the Azure Portal.
    - **Command to enable SCM Auth**: `az resource update --ids /subscriptions/892ba278-02fb-4119-90b3-83778aacc71f/resourceGroups/necrobloom-rg/providers/Microsoft.Web/sites/necrobloom-api/basicPublishingCredentialsPolicies/scm --set properties.allow=true`
    - **Note**: `necrobloom-api` is running on **Windows**, unlike `pip-tracker` which is on Linux. Ensure build artifacts are compatible.
