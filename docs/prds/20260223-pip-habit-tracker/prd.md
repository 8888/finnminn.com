# Product Requirements Document (PRD): Pip Habit Tracker

## Document Overview
This document outlines the product requirements, design specifications, and functional implementation for the new Habit Tracking feature in the Pip application (part of the Finnminn suite). 

## 1. Goal Description
The objective is to expand Pip's functionality from a simple thought-capture tool into a holistic, actionable habit tracker. The feature allows users to track binary daily habits (did they do it or not), visualizing the impact of these habits on their overall "Vitality" and discovering correlations between different behaviors over time.

## 2. Target Audience & Aesthetic
- **Audience:** Users of the Pip Serverless Habit Tracker.
- **Aesthetic:** "Whimsical Gothic Tech" / "PixelGrim". Dark mode (Void #120B18 background), retro 8-bit visual elements, CLI/terminal-like layout, and slightly dark but encouraging gamification.

## 3. Core Features & Requirements

### 3.1. Ritual Management (Habit Creation & Editing)
*   **Definition:** Habits are referred to contextually as "Rituals."
*   **Properties:**
    *   **Name:** String (e.g., "Read 10 Pages", "Junk Food").
    *   **Nature:** Boolean/Enum. Either "Light" (Positive/Increase goal) or "Void" (Negative/Decrease goal).
    *   **Impact Weight:** Fixed at standard `1` (positive adds to score, negative subtracts). (Iterative expansion planned for future).
*   **Actions:** Users can create, edit, or delete a Ritual.

### 3.2. Daily Tracking Interface
*   **Display:** A checklist representation for a specific day.
*   **Interaction:** Tapping/Clicking a Ritual toggles its state for that day (Completed / Not Completed).
*   **History Backfill:** The UI must include navigation (e.g., `<` and `>`) next to the current date, allowing users to move backwards and forwards in time to fill in missed data or review past days.

### 3.3. The "Vitality" System & Mascot Integration
*   **Vitality Score:** A dynamic meter (0-100 or unbounded, depending on implementation preference) indicating overall health. 
    *   *Calculation:* `Vitality = Base Score + (Count of Light Rituals Completed) - (Count of Void Rituals Completed)`. The score should reflect a moving average or recent snapshot (e.g., last 30 days) to prevent infinite accumulation.
*   **Mascot Reactivity:** The ASCII mascot's state and dialogue must react to the user's current Vitality or recent streak health (e.g., glowing/animated when doing well, tired/glitchy when missing habits).
*   **Streaks:** The system calculates and displays the longest active streak of *any* Light Ritual (or an aggregate streak metric).

### 3.4. Analytics: "Oracle of Trends"
*   **Purpose:** To identify correlations between multiple habits.
*   **Time Ranges:** Selectable views for the Past 7, 30, and 90 days.
*   **Functionality:** 
    *   A user selects up to two Rituals to compare.
    *   The UI displays a terminal-style graphical overlay (scatter plot or overlapping curves) showing occurrences of both habits over the selected timeframe.
    *   *Insight Generation:* A summary text block (e.g., "When [Walk] is missed, [Junk Food] rises").

## 4. User Journeys

### User Journey 1: Daily Check-in
1. User opens Pip (PWA or Web App).
2. User lands on the main Dashboard.
3. User sees today's date and the list of active Rituals.
4. User checks off "Drank Water" (Light) and "Ate Fast Food" (Void).
5. The Vitality bar updates dynamically based on the actions.
6. The Mascot dialog updates to reflect the new state.

### User Journey 2: Retrospective Data Entry
1. User realizes they forgot to log their habits for yesterday.
2. User clicks the `<` arrow next to "Today's Rituals".
3. The dashboard re-renders to show yesterday's date and unchecked habits.
4. User logs the habits.
5. User clicks `>` to return to Today.

### User Journey 3: Discovering Correlations
1. User navigates to the "Oracle" (Analytics) tab.
2. User selects "Meditation" (Light) and "Poor Sleep" (Void) from two dropdowns.
3. User selects the "30 Days" range.
4. The terminal graph renders, showing the frequency of both habits.
5. User visually observes that high meditation days correlate with low poor-sleep days.

## 5. Technical Considerations
- **Frontend Container:** The implementation must utilize the shared `CommandBar` and `Layout` from `@finnminn/ui` to maintain navigation consistency with the App Launcher.
- **Components:** `<Typography />` must be used for all text to conform to WCAG AA contrast ratios.
- **Responsiveness:** Ensure CSS Grid/Flex alignments stack cleanly for the mobile PWA view while utilizing the horizontal space on the desktop web app.
- **Storage/Offline:** Adhere to Pip's existing "Capture First" ethos. Habit updates should be queued in `localStorage` if the network is unavailable and synchronized in the background.

## 6. Review Needs
No further review needed. This PRD synthesizes the accepted wireframes and answers from the Discovery phase. It is ready for engineering implementation.
