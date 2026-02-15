# Design Document: Pip Capture Mode

## 1. Overview
Pip Capture Mode is a "Quick Capture" interface designed for maximum speed and minimum friction. It serves as the primary landing page for `pip.finnminn.com`.

## 2. Visual Design (PixelGrim)
- **Background:** `bg-magic-void` (#120B18).
- **Typography:** `VT323` for terminal headers, `Space Mono` for input.
- **Atmosphere:** Fireflies/Mana Motes animated background.
- **Capture Interface:**
    - Large centered `textarea` with a subtle pulse when focused.
    - Large floating microphone button (Radical Pink/Witchcraft).
    - Success feedback: Glitch animation on text submission.

## 3. Technical Architecture

### 3.1. Routing
- `/`: `CaptureInterface` (New)
- `/inbox`: `InboxView` (New)
- `/tracker`: `Home` (Renamed from current Home)
- `/character`: `Character` (Existing)

### 3.2. State Management
- **Local Input:** `useState<string>`
- **Capture List:** `useQuery` (React Query) for fetching, with optimistic updates.
- **Offline Queue:** `localStorage` for simplicity in MVP, containing items that failed to sync.

### 3.3. Speech Recognition
- Uses `window.SpeechRecognition` or `window.webkitSpeechRecognition`.
- Continuous listening while active.
- Real-time transcription visible in the input field.

### 3.4. Backend (Azure Functions)
- `capture-post`: Validates auth and persists to Cosmos DB.
- `capture-get`: Returns last 50 captures for the user.
- `capture-delete`: Soft deletes or removes a capture.

## 4. Offline Strategy
1.  **Intercept Save:** When "Save" is triggered, check `navigator.onLine`.
2.  **Queue:** If offline, save to `localStorage.getItem('pip_pending_captures')`.
3.  **Sync:** On `online` event or app mount, iterate through the queue and send `POST` requests.
4.  **UI Feedback:** Show a "Syncing..." status or offline indicator in the header.
