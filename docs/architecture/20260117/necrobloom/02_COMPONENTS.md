# NecroBloom Components

## Frontend: `apps/necrobloom`
- **Stack**: React, Vite, Tailwind CSS.
- **Design**: Implements the "PixelGrim" design system via `@finnminn/ui`.
- **Identity**: Uses `@finnminn/auth` for Entra ID integration.
- **Features**: 
    - Dashboard showing the "Collection from the Void".
    - Image upload component with preview.
    - Care instruction terminal interface.

## Backend: `apps/necrobloom/api`
- **Stack**: Kotlin (JVM 21), Azure Functions.
- **Responsibility**: Orchestrates between the UI, Cosmos DB, Blob Storage, and Gemini.
- **Triggers**: HTTP Triggers for CRUD operations and AI analysis.

## Database: Azure Cosmos DB (NoSQL)
- **Mode**: Serverless.
- **Database**: `NecroBloomDB`.
- **Container**: `Plants`.
- **Partition Key**: `/userId`.
- **Schema**:
    - `id`: UUID
    - `userId`: String (from Entra ID sub)
    - `species`: String
    - `alias`: String
    - `environment`: Object (zip, lighting)
    - `historicalReports`: Array (date, healthStatus, imageUrl)

## Storage: Azure Blob Storage
- **Container**: `vessel-images`.
- **Access**: Managed via the Function App using System Assigned Managed Identity.

## AI: Gemini API
- **Model**: `gemini-3-flash-preview`
- **Feature**: Utilizes `thinking_level` parameter for complex health analysis.
- **Authentication**: API Key stored in Function App Application Settings.
