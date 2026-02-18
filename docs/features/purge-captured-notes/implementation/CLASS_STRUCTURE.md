# Class Structure: Purge Captured Notes

## Backend (Kotlin)

### `com.finnminn.pip.tracker.CosmosRepository`
- `deleteCapture(id: String, userId: String): Boolean`: Deletes an item from the container using its ID and partition key (userId).

### `com.finnminn.pip.tracker.DeleteCaptureFunction`
- `deleteCapture(@HttpTrigger ...)`: 
    - Extracts `id` from route.
    - Extracts `userId` from security headers.
    - Calls repository.
    - Returns `204 No Content` on success.

## Frontend (TypeScript)

### `apps/pip/src/hooks/useCaptureManager.ts`
- `purgeCapture(id: string)`: Public method for components to trigger deletion.
- `syncPendingDeletes()`: Internal method to process `pip_pending_deletes`.

### `apps/pip/src/pages/InboxPage.tsx`
- Updates the list rendering to include a delete action per note.
