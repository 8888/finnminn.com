# NecroBloom Implementation Plan

This document serves as the master execution plan for building the **NecroBloom** application. It is designed to be followed by developer agents, with clear checkpoints, defined scopes for Pull Requests, and logical hand-offs.

**Status**: 🚧 In Progress

## 📋 Master Checklist

### Phase 1: Project Scaffolding & Infrastructure
- [x] **1.1** Initialize Frontend Application (`apps/necrobloom`)
- [x] **1.2** Initialize Backend Application (`apps/necrobloom/api`)
- [x] **1.3** Configure Monorepo Integration & CI/CD Pipelines

### Phase 2: Core Backend (Data & Storage)
- [x] **2.1** Implement Cosmos DB Repository Layer
- [x] **2.2** Implement Blob Storage Service
- [x] **2.3** Create Basic CRUD Endpoints (Plant Management)

### Phase 3: Core Frontend (UI & Auth)
- [x] **3.1** Setup Layout & Design System Integration
- [x] **3.2** Integrate Authentication (`@finnminn/auth`)
- [x] **3.3** Build Dashboard & Plant List View
- [x] **3.4** Implement "Add Plant" Form (Basic)

### Phase 4: AI Integration (Identification & Care)
- [x] **4.1** Implement Gemini Service (Backend)
- [x] **4.2** Create "Identify Plant" Workflow
- [x] **4.3** Implement "Generate Care Plan" Logic

### Phase 5: Health Monitoring
- [x] **5.1** Implement Health Check Backend Logic
- [x] **5.2** Build Health Check UI & Visualization

---

## 🚀 Execution Details

### Phase 1: Project Scaffolding & Infrastructure
*Goal: Establish the file structure, build pipelines, and base configuration.*

#### 1.1 Initialize Frontend Application
- **Scope**: Create `apps/necrobloom`.
- **Actions**:
    - Initialize React + Vite + TypeScript project.
    - Install dependencies: `tailwindcss`, `@finnminn/ui`, `@finnminn/auth`.
    - Configure `tailwind.config.js` to use shared config.
    - Create a "Hello World" landing page using a PixelGrim component (e.g., `<Card />`).
- **Verification**: `npm run dev --filter=necrobloom` launches the app locally.

#### 1.2 Initialize Backend Application
- **Scope**: Create `apps/necrobloom/api`.
- **Actions**:
    - Initialize Azure Functions project (Java/Kotlin).
    - Configure `build.gradle.kts` (copy patterns from `apps/pip/api`).
    - specific dependencies: `azure-functions-java-library`, `cosmos`, `blob-storage`.
    - Create a generic `HttpTrigger` ("Ping") to test the setup.
- **Verification**: `./gradlew azureFunctionsRun` starts the host and responds to requests.

#### 1.3 Configure Monorepo & CI/CD
- **Scope**: Root configuration.
- **Actions**:
    - Update `turbo.json` to include `necrobloom` tasks.
    - Create/Update GitHub Actions workflows:
        - Copy `.github/workflows/azure-static-web-apps-mango-pebble-0e55b260f.yml` to a new file for NecroBloom (or update existing if using a monorepo strategy for SWA).
        - **Note**: Deployment is manual per strategy, but build verification should happen on PR.
- **Verification**: PR checks pass for the new app.

> 🛑 **AGENT HANDOFF POINT**: The repository structure is complete. The next agent can focus purely on logic without worrying about build config.

---

### Phase 2: Core Backend (Data & Storage)
*Goal: Enable the API to read/write from Azure services.*

#### 2.1 Implement Cosmos DB Repository Layer
- **Scope**: `apps/necrobloom/api/src/main/kotlin/necrobloom/data`
- **Actions**:
    - Define `Plant` data class (matches schema in `02_COMPONENTS.md`).
    - Create `CosmosRepository` class using the Azure Cosmos SDK.
    - Implement `save`, `findById`, `findAllByUserId`.
- **Note**: Use local emulator or a dev Cosmos instance if available, otherwise mock the client for unit tests.

#### 2.2 Implement Blob Storage Service
- **Scope**: `apps/necrobloom/api/src/main/kotlin/necrobloom/services`
- **Actions**:
    - Create `StorageService`.
    - Implement `uploadImage(bytes, extension): url`.
    - Ensure images are stored in `vessel-images` container.

#### 2.3 Create Basic CRUD Endpoints
- **Scope**: `apps/necrobloom/api/src/main/kotlin/necrobloom/functions`
- **Actions**:
    - `GetPlants`: Retrieves list for logged-in user.
    - `CreatePlant`: Receives JSON metadata + Base64 image. Orchestrates Storage upload -> DB save.
    - **Security**: Ensure all endpoints validate the `X-MS-CLIENT-PRINCIPAL` (or Bearer token) for user ID.

> 🛑 **AGENT HANDOFF POINT**: Backend API is functional. Next agent can build the UI to consume these endpoints.

---

### Phase 3: Core Frontend (UI & Auth)
*Goal: Allow users to log in and manage their plant collection.*

#### 3.1 Setup Layout & Design System
- **Scope**: `apps/necrobloom/src`
- **Actions**:
    - Create `Layout.tsx` with the standard PixelGrim shell (Background, Header).
    - Add Navigation (if needed, or just single page with modals).
    - Ensure fonts (`VT323`, `Space Mono`) are loaded.

#### 3.2 Integrate Authentication
- **Scope**: `apps/necrobloom/src/App.tsx`
- **Actions**:
    - Wrap app in `AuthProvider` from `@finnminn/auth`.
    - Create a `Login` component for unauthenticated state.
    - Protect main routes with `RequireAuth`.

#### 3.3 Build Dashboard & List View
- **Scope**: `apps/necrobloom/src/pages/Dashboard.tsx`
- **Actions**:
    - Fetch plants from `/api/plants` on mount.
    - Render `PlantCard` components for each item.
    - Handle loading and empty states (Empty state: " The Void is empty...").

#### 3.4 Implement "Add Plant" Form (Basic)
- **Scope**: `apps/necrobloom/src/components/AddPlantModal.tsx`
- **Actions**:
    - Inputs: Nickname, Species (Manual entry for now), Zip Code.
    - Image Upload: File picker -> Preview -> Base64 conversion.
    - Submit logic: POST to `/api/plants`.

> 🛑 **AGENT HANDOFF POINT**: The app is a functional "dumb" database. Next agent adds the AI "magic".

---

### Phase 4: AI Integration (Identification & Care)
*Goal: Integrate Gemini to automate data entry and care advice.*

#### 4.1 Implement Gemini Service (Backend)
- **Scope**: `apps/necrobloom/api/src/main/kotlin/necrobloom/ai`
- **Actions**:
    - Create `GeminiClient`.
    - Implement `analyzeImage(imageUrl, prompt): String`.
    - Configure `Gemini-3-flash-preview` model settings.

#### 4.2 Create "Identify Plant" Workflow
- **Scope**: Backend & Frontend.
- **Actions**:
    - **Backend**: Update `CreatePlant` (or create new `Identify` endpoint) to trigger Gemini analysis upon image upload.
    - **Prompt**: "Identify this plant. Return JSON with species, scientific name, and brief description."
    - **Frontend**: Update form to show "Analyzing..." state (maybe a scanning animation) and auto-fill fields.

#### 4.3 Implement "Generate Care Plan" Logic
- **Scope**: Backend.
- **Actions**:
    - Triggered after identification or explicitly.
    - **Prompt**: Context includes Species + Zip Code (Climate) + Lighting info. "Generate a care plan: Water frequency, Light needs, Toxicity."
    - Save result to `Plant` record.

> 🛑 **AGENT HANDOFF POINT**: The app is now "smart". Next agent adds the health monitoring features.

---

### Phase 5: Health Monitoring
*Goal: The "Necro" aspect - keeping them alive.*

#### 5.1 Implement Health Check Backend Logic
- **Scope**: `apps/necrobloom/api`
- **Actions**:
    - New Endpoint: `POST /api/plants/{id}/health-check`.
    - Logic:
        1. Save new image.
        2. Fetch plant history.
        3. Gemini Analysis: Compare new image vs old images/status. "Is it dying? Why?"
        4. Append to `historicalReports`.

#### 5.2 Build Health Check UI
- **Scope**: `apps/necrobloom/src`
- **Actions**:
    - "Check Vitality" button on Plant Card.
    - Upload current photo.
    - Display "Vitality Report": A diagnosis card with the AI's feedback.
    - Visual indicator of health trend (Ascii chart or color-coded border).

---

## 🛠 Usage for Agents

When instructed to work on this plan, follow this strict protocol:

1.  **Identify the Phase**: Find the earliest phase in the **Master Checklist** that is not yet marked as complete.
2.  **Branch Strategy**: Create a new git branch for the **entire phase** (e.g., `feat/necrobloom-phase-1-scaffolding`).
3.  **Iterative Implementation**:
    - Work through each sub-step (e.g., 1.1, 1.2) sequentially.
    - **Commit per Sub-step**: Create a distinct commit for each completed sub-step. The commit message should reference the step number (e.g., "feat: [1.1] Initialize frontend application").
    - **Mark Progress**: After completing a sub-step, mark it as checked `[x]` in this file *within that same commit*.
4.  **Completion & PR**:
    - Once all sub-steps in the phase are complete, verify the build/tests pass.
    - Create a **Pull Request** for the branch.
5.  **Stop**: Do not proceed to the next phase. Wait for the PR to be reviewed/merged.
