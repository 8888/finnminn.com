# Design: Purge Captured Notes (User Story 14)

## Overview
This feature adds the ability to permanently delete (hard delete) captured notes from the Pip "Vault" (Inbox). It follows the "PixelGrim" aesthetic, ensuring immediate action without confirmation, but with visual feedback.

## Architecture

### Backend (Azure Functions & Cosmos DB)
- **DeleteCaptureFunction**: A new Azure Function responding to `DELETE /api/capture/{id}`.
- **CosmosRepository**: Added `deleteCapture(id, userId)` method to handle the hard delete in Cosmos DB.
- **Security**: Ensures a user can only delete their own notes by verifying the `userId` from the authenticated principal header.

### Frontend (React & TypeScript)
- **useCaptureManager Hook**:
    - `purgeCapture(id: string)`:
        - Optimistically removes the capture from local state.
        - Attempts a `DELETE` request to the backend.
        - If offline, queues the delete action in `localStorage` (`pip_pending_deletes`).
    - `syncPendingDeletes()`: New sync logic to process queued deletions when online.
- **InboxPage**:
    - Each `Terminal` note will have a `[ VOID ]` or `[ PURGE ]` button.
    - Uses CSS transitions/animations for a "glitch" removal effect.

## Offline Strategy
Two separate storage keys in `localStorage`:
1. `pip_pending_captures`: For new captures created while offline.
2. `pip_pending_deletes`: For captures purged while offline.

The `syncPending` logic will be updated to handle both queues.

## Visual Feedback
- **Immediate Removal**: The UI will reflect the deletion instantly.
- **Glitch Effect**: Utilizing `@finnminn/ui` tokens, the note will briefly glitch or flicker before being removed from the DOM.
