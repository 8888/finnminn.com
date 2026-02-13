# User Stories: Pip Capture Mode

## Story 1: The Capture Interface (Default Landing)

**User Story Statement**
> **As an** Overloaded Agent,
> **I want** the Pip application to open directly to a distraction-free Capture Interface,
> **So that** I can immediately offload a thought without navigating through menus or waiting for dashboards to load.

**Acceptance Criteria**
- [ ] The default route (`/`) MUST render the Capture Interface immediately upon load.
- [ ] The interface MUST feature a large, auto-focused text input area (or a prominent "Start Typing" affordance).
- [ ] A prominent "Record" (Microphone) button MUST be visible and accessible within the "thumb zone" on mobile devices.
- [ ] The design MUST adhere to the **PixelGrim** aesthetic (Minimalist, High Contrast, Terminal-like) as per the design system.
- [ ] Existing dashboard/habit tracking features MUST NOT be visible on this initial view (deferred to navigation).

**Technical Notes**
- Ensure `manifest.json` `start_url` is updated if necessary.
- Verify "above the fold" rendering performance to meet the < 1.5s TTI requirement.

---

## Story 2: Frictionless Text Capture

**User Story Statement**
> **As a** User with a quick idea,
> **I want** to type a note and have it save instantly with an optimistic UI update,
> **So that** I can clear my mental buffer and trust that the system has secured my data.

**Acceptance Criteria**
- [ ] User MUST be able to type multiline text into the input field.
- [ ] Upon pressing "Enter" (desktop) or a specific "Send/Save" button (mobile), the input field MUST clear immediately.
- [ ] A subtle but clear "Success/Saved" animation (e.g., a "glitch" effect or terminal blink) MUST play to confirm capture.
- [ ] The data MUST be persisted to the backend (Azure Cosmos DB) with:
    - `content`: The text entered.
    - `type`: "text"
    - `timestamp`: Current UTC time.
- [ ] If the backend request fails, the UI MUST notify the user and allow for a retry (or queue locally - see Story 5).

**Technical Notes**
- Implement optimistic UI updates (update state before awaiting backend response).
- Handle "Shift+Enter" for new lines on desktop if "Enter" submits.

---

## Story 3: Voice-to-Text Capture

**User Story Statement**
> **As a** User walking or driving,
> **I want** to tap a single button and speak my thought,
> **So that** it is transcribed and saved as text without me needing to look at the screen or type.

**Acceptance Criteria**
- [ ] Tapping the "Record" button MUST trigger the browser's `SpeechRecognition` API.
- [ ] Visual feedback (e.g., waveform or pulsing icon) MUST indicate the app is listening.
- [ ] Upon silence or tapping "Stop", the app MUST transcribe the audio to text.
- [ ] The transcribed text MUST be saved automatically as a note with `type: "voice-memo"`.
- [ ] If the API is not supported (e.g., unsupported browser), the button should be disabled or show a helpful "Keyboard Only" state.
- [ ] **Constraint:** We are NOT saving the raw audio file in this phase, only the transcription.

**Technical Notes**
- Test thoroughly on iOS Safari (may require specific user interaction to trigger mic).
- Handle permission denial gracefully.

---

## Story 4: The Vault (Inbox View)

**User Story Statement**
> **As a** User who has captured multiple thoughts,
> **I want** to view a raw list of my recent captures in a separate "Inbox" view,
> **So that** I can review what I've offloaded without cluttering the capture experience.

**Acceptance Criteria**
- [ ] Navigation to the "Inbox" (or "Vault") MUST be accessible from the Capture Interface (e.g., via a discrete icon).
- [ ] The Inbox MUST list captured items in reverse chronological order (newest first).
- [ ] Each item MUST display the text content and the timestamp.
- [ ] Items MUST be **Read-Only** or **Delete-Only**. No editing or moving is permitted in this phase.
- [ ] A "Back to Capture" navigation element MUST be present.

**Technical Notes**
- Pagination or "Load More" strategy for the list to ensure performance.

---

## Story 5: Offline Capabilities (PWA)

**User Story Statement**
> **As a** User in an area with poor connectivity,
> **I want** the app to load and accept my input,
> **So that** I don't lose an idea just because I'm offline.

**Acceptance Criteria**
- [ ] The application MUST be installable as a PWA (Service Worker configured).
- [ ] The Capture Interface UI shell MUST load even when the device is offline.
- [ ] If a user submits a Text Capture while offline, the item MUST be queued locally (e.g., `localStorage` or `IndexedDB`).
- [ ] When connectivity is restored, the queued items MUST be synced to the backend automatically.
- [ ] A visual indicator (e.g., "Offline Mode" or "Syncing...") should be present when applicable.

**Technical Notes**
- Use a "stale-while-revalidate" or "network-first" strategy for the app shell, but "cache-first" logic is not appropriate for the dynamic data submission.
- Ensure the Service Worker `fetch` handler correctly manages the `/api` requests or bypasses them to the background sync logic.

---

## Story 6: Navigation Restructuring (Habit Tracker Access)

**User Story Statement**
> **As a** User who still uses the Habit Tracker features,
> **I want** to be able to access the old dashboard via a secondary menu,
> **So that** I don't lose access to my existing data while adopting the new capture workflow.

**Acceptance Criteria**
- [ ] The existing "Habit Tracker" dashboard MUST be moved to a secondary route (e.g., `/tracker`).
- [ ] A navigation menu (e.g., hamburger menu or bottom tab) on the Capture Interface MUST provide a link to the "Habit Tracker".
- [ ] The "Habit Tracker" view MUST include a way to navigate back to the "Capture" home.

**Technical Notes**
- Refactor the existing `App.tsx` routing configuration to accommodate the new home structure.
