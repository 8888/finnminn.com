# Component Details: Pip Capture Mode

## 1. Frontend Components (`apps/pip/src`)

### 1.1. `CaptureInterface` (New Page)
*   **Role:** The default landing page.
*   **Route:** `/`
*   **Responsibilities:**
    *   Render the main input field (Textarea).
    *   Render the "Record" button.
    *   Handle "Enter" key press for submission.
    *   Manage local state for the input value.
    *   Display "Toast" notifications for success/error.
*   **Key Props/State:**
    *   `input: string`
    *   `isRecording: boolean`
    *   `isSaving: boolean`

### 1.2. `VoiceRecorder` (Hook/Component)
*   **Role:** Manages the `SpeechRecognition` API lifecycle.
*   **Responsibilities:**
    *   Check browser support.
    *   Start/Stop listening.
    *   Handle `onresult`, `onerror`, `onend` events.
    *   Return the live transcript to the parent.
*   **Design Pattern:** Custom Hook (`useVoiceCapture`).

### 1.3. `InboxView` (New Page)
*   **Role:** Read-only list of recent captures.
*   **Route:** `/inbox`
*   **Responsibilities:**
    *   Fetch recent captures from the API (and local queue).
    *   Render list items with content and timestamp.
    *   Provide navigation back to `/`.

### 1.4. `OfflineManager` (Utility/Context)
*   **Role:** Manages the offline queue and synchronization logic.
*   **Responsibilities:**
    *   Listen for `online`/`offline` window events.
    *   Write failed requests to `IndexedDB` (using a library like `idb` or `localforage` recommended).
    *   Retry pending requests when connectivity is restored.

## 2. Backend Components (`apps/pip/api`)

### 2.1. `CaptureFunction` (Azure Function)
*   **Trigger:** HTTP Trigger (`POST /api/capture`)
*   **Role:** Ingest new capture items.
*   **Validation:**
    *   Ensure `content` is not empty.
    *   Verify User ID from the `X-MS-CLIENT-PRINCIPAL` header (or Auth token).
*   **Output Binding:** Cosmos DB Output.

### 2.2. `GetCapturesFunction` (Azure Function)
*   **Trigger:** HTTP Trigger (`GET /api/captures`)
*   **Role:** Retrieve recent captures for the inbox.
*   **Query:** Select * from c where c.userId = {userId} and c.type = 'capture' order by c.timestamp desc.

## 3. Data Model (Cosmos DB)

### 3.1. `CaptureItem` Document
```json
{
  "id": "uuid-v4",
  "userId": "user-guid-from-auth",
  "type": "capture",
  "content": "Buy milk and coffee beans",
  "source": "text" | "voice",
  "timestamp": "2026-02-13T10:00:00Z",
  "status": "inbox" | "processed" | "deleted",
  "metadata": {
    "device": "mobile",
    "duration_seconds": 5 (if voice)
  }
}
```

## 4. Design System Integration (`@finnminn/ui`)

### 4.1. `InputShell`
*   A specialized version of the standard Input component with stripped-down styling for maximum focus.
*   Uses `VT323` font for that "terminal" feel.

### 4.2. `GlitchText`
*   Used for the "Saved" confirmation animation.
*   Reuses existing animations from the design system.
