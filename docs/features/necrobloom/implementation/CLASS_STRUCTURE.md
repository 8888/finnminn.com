# NecroBloom Class Structure

## Backend (Kotlin)

### Models
- `Vessel`: Represents a plant in the collection.
    - `id`: UUID
    - `userId`: String
    - `species`: String
    - `alias`: String
    - `location`: String (e.g., "North Window")
    - `zipCode`: String
    - `carePlan`: CarePlan
    - `reports`: List<VitalityReport>
- `CarePlan`: Instructions for plant care.
    - `lighting`: String
    - `watering`: String
    - `notes`: String
- `VitalityReport`: Result of an AI health check.
    - `timestamp`: Long
    - `status`: String (Healthy, Dying, Thirsty)
    - `analysis`: String
    - `imageUrl`: String

### Functions
- `VesselFunctions`: Handles CRUD for plant collection.
- `AIFunctions`: Orchestrates calls to Gemini 3 Flash.
- `StorageService`: Utility for uploading/retrieving blobs.

## Frontend (React/TypeScript)

### Pages
- `CollectionPage`: Grid view of all `Vessel` objects.
- `IdentifyPage`: Image upload and identification UI.
- `VesselDetailPage`: Detailed view of a single plant.

### Components
- `VesselCard`: Individual plant card.
- `VitalityReportList`: List of historical reports.
- `CareTerminal`: Interactive display for AI instructions.

### Hooks
- `useVessels`: Fetching and managing the collection state.
- `useAI`: Triggering identification and health checks.
