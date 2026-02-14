# Architecture Overview: Pip Capture Mode

## 1. Introduction
This document outlines the architectural changes required to implement "Capture Mode" for the Pip application (`apps/pip`). The primary goal is to shift the application's focus from habit tracking to rapid, frictionless information capture (text and voice). This involves introducing a new default landing page, offline capabilities via PWA technologies, and a streamlined data ingestion pipeline.

## 2. Problem Statement & Solution
**Problem:** Users experience friction when trying to quickly record thoughts or tasks. The current habit tracking interface requires navigation and categorization, leading to lost ideas.
**Solution:** A "Capture First" architecture that prioritizes speed and reliability. The application will load instantly into a capture interface, support offline data entry, and sync to the cloud in the background.

## 3. High-Level Architecture
The system follows a standard **Single Page Application (SPA)** architecture hosted on **Azure Static Web Apps**, backed by serverless **Azure Functions** and **Azure Cosmos DB**.

### Key Components:
1.  **Frontend (React/Vite):** The user interface, responsible for capturing input, managing offline state, and optimistic UI updates.
2.  **PWA/Service Worker:** Ensures the app loads instantly and handles offline requests.
3.  **Backend API (Azure Functions - Kotlin):** Validates and persists data to the database.
4.  **Database (Azure Cosmos DB):** Stores capture data (notes, transcriptions) in a serverless, low-latency environment.

## 4. Architecture Diagram

```mermaid
graph TD
    User[User (Mobile/Desktop)] -->|Opens App| PWA[PWA Shell (React)]
    User -->|Voice Input| WebSpeech[Browser Web Speech API]
    User -->|Text Input| PWA

    subgraph "Client Side (Browser)"
        PWA -->|Capture| LocalStore[IndexedDB / LocalStorage]
        WebSpeech -->|Transcription| PWA
        ServiceWorker[Service Worker] -->|Intercept Requests| NetworkHandler{Network Available?}
        NetworkHandler -->|No| LocalQueue[Offline Queue]
        NetworkHandler -->|Yes| API
        LocalQueue -->|Sync (When Online)| API
    end

    subgraph "Azure Cloud"
        API[Azure Functions (Kotlin)] -->|Auth Check| EntraID[Microsoft Entra ID]
        API -->|Persist| CosmosDB[Azure Cosmos DB]
    end
```

## 5. Data Flow

### 5.1. Capture Flow (Online)
1.  User enters text or completes voice transcription.
2.  Frontend generates a temporary ID and timestamp.
3.  Frontend optimistically adds the item to the "Inbox" list in the UI.
4.  Frontend sends a `POST /api/capture` request to the backend.
5.  Backend validates the request and user identity.
6.  Backend saves the item to Cosmos DB.
7.  Backend returns the persisted item (with permanent ID).
8.  Frontend updates the item in the local state with the confirmed data.

### 5.2. Capture Flow (Offline)
1.  User enters text/voice.
2.  Frontend detects offline state (or request fails).
3.  Item is saved to `IndexedDB` (or `localStorage`) with a `sync_status: 'pending'` flag.
4.  UI shows the item as "Saved (Offline)".
5.  **Background Sync:** When the `online` event fires or the app reloads:
    a.  Service Worker/Frontend iterates through pending items.
    b.  Sends `POST /api/capture` for each item.
    c.  Upon success, removes the item from the pending queue and updates the main list.

## 6. Key Design Decisions

### 6.1. Client-Side Transcription
**Decision:** Use the browser's native `SpeechRecognition` API instead of a server-side AI service (like Azure Speech Services) for the MVP.
**Justification:**
*   **Latency:** Instant feedback to the user without a round-trip.
*   **Cost:** Zero cost for the API usage.
*   **Privacy:** Audio processing happens locally on the device (mostly).
*   **Constraint:** Limits support to browsers implementing the API (Chrome, Edge, Safari, Android Webview). Fallback to text input is acceptable.

### 6.2. Optimistic UI & Local Queue
**Decision:** Implement an "Offline First" strategy using optimistic UI updates.
**Justification:** The primary metric is "Time-to-Capture". Users must feel the system is instant. Waiting for a server response defeats the purpose of "unloading the mind".

### 6.3. Cosmos DB as "Inbox"
**Decision:** Store captures in the existing `Pip` database but with a distinct `type` discriminator (e.g., `type: 'capture'`).
**Justification:**
*   Leverages existing infrastructure.
*   Allows for easy future integration where "captures" can be promoted to "habits" or "tasks" within the same data model.
