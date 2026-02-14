# Implementation Plan: Pip Capture Mode

## Overview
This feature introduces a "Capture First" workflow to the Pip application.

## Tasks

### Phase 1: Backend Infrastructure
- [ ] Create `CaptureItem` data model.
- [ ] Implement `PostCapture` function in Kotlin.
- [ ] Implement `GetCaptures` function in Kotlin.

### Phase 2: Frontend Foundation
- [ ] Refactor routing in `App.tsx`.
- [ ] Rename `Home.tsx` to `TrackerPage.tsx`.
- [ ] Create `CapturePage.tsx` placeholder.

### Phase 3: Capture Components
- [ ] Implement `useVoiceCapture` hook.
- [ ] Create `CaptureInput` component.
- [ ] Create `VoiceTrigger` component.
- [ ] Integrate with `useCaptureManager` for persistence.

### Phase 4: Inbox & Offline
- [ ] Create `InboxPage` and `CaptureList`.
- [ ] Implement local storage queue in `useCaptureManager`.
- [ ] Add background sync logic.

### Phase 5: PWA & Polish
- [ ] Verify `manifest.json` and service worker.
- [ ] Add "glitch" success animations.
- [ ] Final PixelGrim styling pass.
