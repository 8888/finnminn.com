# Product Requirement Document: Pip Capture Mode (Quick Thoughts)

| Metadata | Details |
| :--- | :--- |
| **Title** | Pip Capture Mode |
| **Date** | 2026-02-13 |
| **Status** | DRAFT |
| **Target App** | `apps/pip` (Pip - Serverless Habit Tracker) |
| **Owner** | Product Management |

## 1. Executive Summary
We are pivoting the primary entry point of the **Pip** application to focus on **frictionless information capture**. While habit tracking remains a core utility, the immediate "job to be done" upon opening the app—specifically on mobile—will be to offload mental clutter.

This initiative introduces a "Quick Capture" landing page that allows users to instantly record text or voice notes. These notes are stored in a raw "Inbox" state for later processing. This ensures the user achieves a "mind like water" state without being bogged down by organization tasks at the moment of capture.

## 2. Strategic Context (The "Why")

### Problem Statement
Users currently lack a dedicated, low-latency "second brain" buffer within the Finnminn ecosystem. When a thought, task, or idea occurs, the friction of opening a complex app, navigating to the right category, and typing acts as a barrier. This leads to lost ideas and increased cognitive load.

### Target Persona
**The Overloaded Agent:** A user who is constantly switching contexts and needs to "dump" RAM (short-term memory) into disk (storage) immediately. They do not want to categorize; they want to record.

### Value Proposition
"Open, Talk, Close." Pip becomes the fastest way to save a thought, turning the mobile device into a reliable extension of the user's memory.

## 3. Success Metrics

| Metric | Goal |
| :--- | :--- |
| **Time-to-Capture** | < 3 seconds from app open to "Saved" state. |
| **Voice Utilization** | > 30% of total captures are voice-based (indicating low friction). |
| **Retention** | Daily Active Users (DAU) for "Capture" action. |

## 4. User Journeys

### Journey 1: The Walking Thought (Voice)
1.  User has an idea while walking.
2.  User opens Pip (PWA) from home screen.
3.  User taps the large "Record" microphone icon.
4.  User speaks the idea.
5.  App transcribes speech to text in real-time (or near real-time).
6.  User taps "Save" (or auto-save on silence).
7.  App confirms with a "glitch" success animation.

### Journey 2: The Quick Note (Text)
1.  User opens Pip.
2.  User taps the input field (or it auto-focuses).
3.  User types "Buy batteries."
4.  User hits "Enter" or "Send."
5.  Input field clears immediately for the next thought.

## 5. Functional Requirements

### 5.1. The Capture Interface (Landing Page)
*   **REQ-CAP-001:** The default view of `pip.finnminn.com` MUST be the Capture Interface.
*   **REQ-CAP-002:** The interface MUST feature a prominent Text Input area.
*   **REQ-CAP-003:** The interface MUST feature a prominent Voice Capture button.
*   **REQ-CAP-004:** The design MUST adhere to the **PixelGrim** aesthetic (Minimalist, High Contrast, Terminal-like).

### 5.2. Text Capture
*   **REQ-TXT-001:** Users must be able to type multiline text.
*   **REQ-TXT-002:** Submitting the text must optimistically clear the field and show a success state immediately.
*   **REQ-TXT-003:** Data must be persisted to the backend (Azure Cosmos DB) with a `timestamp` and `type: "text"`.

### 5.3. Voice Capture (Voice-to-Text)
*   **REQ-VOC-001:** The app MUST support voice capture via the browser's `SpeechRecognition` API (or equivalent web standard) for the MVP to minimize latency and cost.
*   **REQ-VOC-002:** The app MUST transcribe audio to text.
*   **REQ-VOC-003:** The transcribed text is saved as a note (Payload: `{ content: "Transcribed text", original_audio: null, type: "voice-memo" }`). *Note: Storing raw audio is out of scope for MVP.*

### 5.4. The Inbox (Separated List View)
*   **REQ-LIST-001:** The Inbox view MUST be a separate page/route (e.g., `/inbox`) to avoid cluttering the primary Capture Interface.
*   **REQ-LIST-002:** Access to the Inbox is provided via a discrete navigation element (e.g., a "Vault" or "Memory" icon) on the Capture page.
*   **REQ-LIST-003:** Items in the list are **Read-Only** or **Delete-Only**. No editing or moving is permitted in this phase.

### 5.5. PWA & Offline
*   **REQ-PWA-001:** The app MUST be installable as a PWA on iOS and Android.
*   **REQ-PWA-002:** The app MUST load the UI shell even when offline (Service Worker).
*   **REQ-PWA-003:** If offline, captures MUST be queued locally and synced when online (Local-First Strategy).

## 6. Non-Functional Requirements
*   **Performance:** App Time-to-Interactive (TTI) must be under 1.5 seconds on 4G networks.
*   **Accessibility:** Voice controls must be accessible; input fields must have proper ARIA labels.
*   **Security:** All notes are private to the authenticated user (Entra ID).

## 7. Out of Scope (Phase 1)
*   **Organization:** No tagging, folders, or categories.
*   **Processing:** No "Move to Todo" or "Convert to Project" features.
*   **Audio Storage:** We are storing the *transcription*, not the audio file itself (to save storage/bandwidth).
*   **Habit Tracking Integration:** The existing habit tracking features will be accessible via a navigation menu but are secondary to this new landing experience.

## 8. Technical Constraints & Assumptions
*   **Browser Support:** Voice recognition relies on `Web Speech API`. Support varies by browser (Safari/iOS has specific quirks). Fallback to keyboard is acceptable if API is unavailable.
*   **Backend:** Leveraging existing Azure Functions and Cosmos DB infrastructure.
