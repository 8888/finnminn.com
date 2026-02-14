# Deployment Strategy: Pip Capture Mode

## 1. Overview
Deployment leverages the existing CI/CD pipelines configured for `apps/pip`. No new infrastructure resources are strictly required, but configuration updates are needed to support the new routing and potential database indexing.

## 2. Infrastructure as Code (IaC) & Configuration

### 2.1. Cosmos DB Indexing
*   **Action:** Verify the indexing policy on the `Items` container (or `Pip` database default) supports efficient sorting by `timestamp`.
*   **Details:** Ensure a range index exists on `timestamp` and `type` to optimize the Inbox query.
*   **Method:** Update via Bicep templates or Azure Portal (Manual Check initially).

### 2.2. Static Web App Configuration (`staticwebapp.config.json`)
*   **Action:** Update routing rules if necessary to support the new client-side routes (`/inbox`, `/tracker`).
*   **Details:** Ensure the fallback route is correctly configured to serve `index.html` for all paths (SPA behavior). This should already be in place, but verify `routes.json` or `staticwebapp.config.json`.

## 3. Application Deployment

### 3.1. Frontend (`apps/pip`)
*   **Workflow:** `.github/workflows/azure-static-web-apps-mango-pebble-0e55b260f.yml`
*   **Trigger:** Push to `main` with changes in `apps/pip/**`.
*   **Steps:**
    1.  Build the React app (`npm run build`).
    2.  Output to `apps/pip/dist`.
    3.  Deploy artifact to Azure Static Web App (`Pip-web-app`).

### 3.2. Backend (`apps/pip/api`)
*   **Workflow:** `.github/workflows/deploy-pip-backend.yml`
*   **Trigger:** Push to `main` with changes in `apps/pip/api/**`.
*   **Steps:**
    1.  Compile Kotlin code (`gradlew build`).
    2.  Package Azure Function (`gradlew azureFunctionsPackage`).
    3.  Deploy to Azure Function App (`pip-tracker`).

## 4. Rollout Plan

### 4.1. Phase 1: Local Development & Verification
1.  Implement the `CaptureFunction` and `GetCapturesFunction` locally.
2.  Run the Cosmos DB Emulator or connect to a Dev instance.
3.  Develop the Frontend UI and test "Offline Mode" by disabling network in DevTools.

### 4.2. Phase 2: Feature Flag (Optional but Recommended)
*   **Action:** If we want to merge code without breaking the existing Habit Tracker immediately for all users, implement a client-side feature flag (e.g., `localStorage.getItem('ENABLE_CAPTURE_MODE')`).
*   **Logic:**
    *   If Flag == True -> Render `CaptureInterface` at `/`.
    *   If Flag == False -> Render existing `HabitTracker` at `/`.

### 4.3. Phase 3: Production Release
1.  Merge backend changes first.
2.  Deploy backend.
3.  Merge frontend changes.
4.  Deploy frontend.
5.  Verify "Time-to-Capture" metric in production using App Insights.

## 5. Security Considerations
*   **Input Validation:** Sanitize all text input on the backend to prevent XSS if rendered unsafely (though React escapes by default).
*   **Rate Limiting:** Ensure the public API endpoint (`/api/capture`) is protected against abuse (APIM or Function App built-in limits).
*   **Auth:** Strictly enforce `X-MS-CLIENT-PRINCIPAL` validation.
