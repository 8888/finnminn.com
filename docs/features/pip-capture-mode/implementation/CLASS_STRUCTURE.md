# Class Structure: Pip Capture Mode

## Frontend Components (`apps/pip/src`)

### Pages
- `CapturePage`: `/` route. Orchestrates `CaptureInput` and `VoiceTrigger`.
- `InboxPage`: `/inbox` route. Displays `CaptureList`.
- `TrackerPage`: `/tracker` route (Refactored from old `Home`).

### Components
- `CaptureInput`: A specialized textarea component with auto-resize and terminal styling.
- `VoiceTrigger`: A button component that toggles the microphone and handles permissions.
- `CaptureItem`: A display component for a single thought in the Inbox.
- `CaptureList`: A vertical list container for `CaptureItem`s.
- `Navigation`: A discrete side/bottom menu for switching between Capture, Inbox, and Tracker.

### Hooks
- `useVoiceCapture`: 
    - `isListening: boolean`
    - `transcript: string`
    - `start: () => void`
    - `stop: () => void`
    - `isSupported: boolean`
- `useCaptureManager`:
    - `saveCapture: (content: string, source: 'text' | 'voice') => Promise<void>`
    - `captures: CaptureItem[]`
    - `isSyncing: boolean`

## Backend API (`apps/pip/api`)

### Models (Kotlin)
- `CaptureItem`: `id`, `userId`, `content`, `type`, `source`, `timestamp`.

### Functions
- `PostCapture`: HTTP POST handler.
- `GetCaptures`: HTTP GET handler.
- `DeleteCapture`: HTTP DELETE handler.
