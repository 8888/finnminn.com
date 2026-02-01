# PRD: Necrobloom Dashboard 2.0 - Vessel Insights

## 1. Executive Summary
Necrobloom currently offers individual plant tracking but lacks a high-level overview of the user's "Vessel" (collection). Dashboard 2.0 will introduce aggregate insights, health distribution analytics, and care-based grouping (Watering Cohorts). This transforms the dashboard into a strategic plant-care command center while deepening the "PixelGrim" whimsically gothic aesthetic.

## 2. The "Why" (Strategic Context)
**Target User:** The "Gothic Gardener" managing multiple specimens who needs to prioritize care rituals and assess collection-wide health at a glance.
**Problem Statement:** Currently, users must audit plants individually to determine watering needs or overall health status. There is no aggregate view of "The Void's" status, leading to missed care opportunities for at-risk specimens.
**Strategic Alignment:** Enhances the "PixelGrim" experience by treating the collection as a holistic ecosystem (The Vessel) rather than a disconnected list of items.

## 3. Success Metrics
- **Clarity:** 100% of users can identify "Watering Cohorts" in under 5 seconds from the dashboard.
- **Utility:** Increase in Dashboard "triage" actions (filtering by health) before drilling into plant details.
- **Health:** Improvement in the "Harmony Index" (ratio of healthy to total plants) across the user base.

## 4. User Journeys
1. **The Morning Audit:** User opens the app; the header reveals "12 specimens bound, 80% Harmony, 4 require hydration."
2. **The Sunday Ritual:** User expands the "Weekly Cycle" cohort to see all plants requiring weekly care and performs a batch watering session.
3. **Emergency Triage:** User spots a "Radical Red" segment on the health meter and clicks it to instantly filter for only "In Peril" specimens.

## 5. Functional Requirements
### 5.1 Vessel Metadata Header
- **Total Specimen Count:** Clear display of total bound plants.
- **Harmony Index:** A ratio of healthy plants to the total, displayed as a percentage (e.g., "75% HARMONY").
- **Vessel Status Oracle:** Whimsical status text that changes based on the Harmony Index (e.g., "THE GARDEN THRIVES" vs. "SHADOWS GATHER IN THE VOID").

### 5.2 Health Distribution Meter (Visual)
- A segmented "Vitality Bar" representing the breakdown of the collection:
    - **Thriving (Ectoplasm/#05FFA1):** Plants with positive health diagnoses.
    - **Stable (Witchcraft/#7D5FFF):** Plants with neutral or "Unknown" status.
    - **In Peril (Radical/#FF0055):** Plants identified as "dying," "thirsty," or "troubled."

### 5.3 Watering Cohorts (Grouping)
- **Aggregation Logic:** Group plants by `carePlan.waterFrequency` string values.
- **Dynamic Sections:** Dashboard sections that cluster plants by their schedule (e.g., "Daily Ritual," "Weekly Cycle").
- **Unbound Handling:** Plants without a care plan are grouped under "UNBOUND FREQUENCIES."

### 5.4 Filtering & Sorting
- **Vitality Filter:** Buttons or meter segments that filter the dashboard view by health category.
- **Need-Based Sorting:** Ability to sort the collection by "Last Health Check" date to identify neglected specimens.

## 6. Non-Functional Requirements
- **Performance:** Aggregations must be calculated client-side from the existing plant list to ensure sub-100ms UI updates.
- **Aesthetic:** Adherence to "PixelGrim" tokens—use monospace fonts, glow effects, and CRT-style terminal layouts.
- **Accessibility:** High-contrast color indicators paired with text labels to ensure accessibility for color-blind users.

## 7. Out of Scope
- **Push Notifications:** Automated watering reminders (Reserved for v2.1).
- **Batch Health Checks:** Ability to upload one photo for multiple plants (Reserved for v3.0).
- **External Integration:** Syncing with calendar apps.
