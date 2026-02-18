# Feature: Purge Captured Notes

Implementation of User Story 14: "Purge Captured Notes from the Vault".

## Implementation Plan

1. **Backend Development**:
    - Add `deleteCapture` to `CosmosRepository`.
    - Create `DeleteCaptureFunction`.
    - Verify with mock tests.

2. **Hook Enhancement**:
    - Update `useCaptureManager` to support `purgeCapture`.
    - Add offline queueing for deletions.
    - Implement sync logic for deletions.

3. **UI Integration**:
    - Update `InboxPage` to add the "VOID" button.
    - Implement visual "glitch" removal effect.

4. **Testing**:
    - Unit tests for `useCaptureManager`.
    - Integration test for the delete flow.
