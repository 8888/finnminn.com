# Necrobloom Dashboard 2.0 - User Stories

Following the **Vessel Insights PRD**, here are the engineering-ready User Stories for the Dashboard 2.0 implementation.

---

### Story 0: Core Refactoring & Type Unification
**User Story Statement:**
As a **NecroBloom Architect**, I want to centralize the plant and health report interfaces into a shared types file, so that the dashboard insights and detail pages use a consistent schema.

**Acceptance Criteria:**
- Create `apps/necrobloom/src/types/plant.ts`.
- Move `Plant`, `HealthReport`, and `CarePlan` interfaces into this file.
- Update `Dashboard.tsx`, `PlantDetail.tsx`, and all hooks to import from this central location.
- Ensure the `Plant` interface includes `boundDate` (ISO string) for creation tracking.

---

### Story 1: Vessel Metadata Header
**User Story Statement:**
As a **Gothic Gardener**, I want to see high-level statistics about my collection at the top of the dashboard, so that I can immediately assess the state of my "Vessel" and the overall health of my bound specimens.

**Acceptance Criteria:**
- Display a "Total Specimen Count" reflecting the number of plants in the `plants` array.
- Calculate and display the "Harmony Index": `(Count(Thriving) + Count(Stable)) / Total`.
- Implement a "Vessel Status Oracle" (whimsical text) that changes based on the Harmony Index:
    - 90-100%: "THE GARDEN THRIVES IN RADIANT DARKNESS"
    - 50-89%: "A STEADY CALM PERMEATES THE VOID"
    - 1-49%: "SHADOWS GATHER; THE SPIRITS ARE RESTLESS"
    - 0%: "THE VOID IS SILENT AND BARREN"
- Use PixelGrim design tokens (Witchcraft/Toxic colors) for typography and glow effects.

**Technical Notes:**
- Status calculation should be performed client-side using a `useMemo` hook derived from the `plants` state.
- Handle the "Empty Void" state (0 plants) gracefully by showing 0% Harmony and the appropriate Oracle text.

---

### Story 2: Health Vitality Meter (Visual Component)
**User Story Statement:**
As a **Gothic Gardener**, I want a visual health distribution bar, so that I can see the ratio of healthy to troubled plants without reading individual reports.

**Acceptance Criteria:**
- Implement a horizontal segmented "Vitality Bar" component.
- The bar must be divided into three segments based on plant health:
    - **Thriving (Ectoplasm/#05FFA1):** Positive health diagnosis.
    - **Stable (Witchcraft/#7D5FFF):** Neutral or "Unknown" status.
    - **In Peril (Radical/#FF0055):** Thirsty, troubled, or dying status.
- Each segment's width must be proportional to the percentage of plants in that category.
- Segments must include a tooltip or text overlay indicating the count (e.g., "5 THRIVING").
- Adhere to accessibility standards by ensuring color contrasts are high and text labels are present.

**Technical Notes:**
- Logic for categorization:
    - `Thriving`: Last report contains keywords like "thriving", "healthy", "excellent".
    - `In Peril`: Last report contains "thirsty", "dying", "troubled", "unhealthy".
    - `Stable`: Default for everything else (including no reports).

---

### Story 3: Dashboard Filtering and Triage
**User Story Statement:**
As a **Gothic Gardener**, I want to filter my dashboard by vitality status, so that I can quickly "triage" the collection and focus only on specimens that are "In Peril."

**Acceptance Criteria:**
- Make the segments of the **Health Vitality Meter** (from Story 2) act as **single-selection toggles**.
- Clicking an active filter segment deactivates it (returning to the full list).
- Add a "CLEAR FILTERS" button that appears only when a filter is active.
- When a segment is clicked (e.g., "In Peril"), the dashboard list must update instantly to show only plants in that category.
- Display a "No specimens found in this state" message if a filter returns an empty set.

**Technical Notes:**
- Use a `filteredPlants` state or memoized variable to manage the list display.
- Ensure filtering happens client-side for sub-100ms response times.

---

### Story 4: Watering Cohorts Dashboard Sections
**User Story Statement:**
As a **Gothic Gardener**, I want my plants to be grouped by their watering frequency, so that I can perform my care rituals in batches.

**Acceptance Criteria:**
- Reorganize the dashboard from a single grid to multiple sections based on `carePlan.waterFrequency`.
- Grouping categories should include:
    - **Daily Rituals**
    - **Weekly Cycles**
    - **Bi-Weekly Rhythms**
    - **Monthly Communions**
    - **Strange Rhythms** (Fallback for unmapped or irregular AI frequencies).
    - **Unbound Frequencies** (For plants without a care plan).
- Implement fuzzy matching for the AI frequency strings (e.g., "every few days" -> Weekly).
- Each section must have a header with a count of specimens in that cohort.
- Cohorts with 0 plants should be hidden by default.

---

### Story 5: Need-Based Sorting
**User Story Statement:**
As a **Gothic Gardener**, I want to sort my collection by the last health check date, so that I can identify specimens that have been neglected for too long.

**Acceptance Criteria:**
- Add a "Sort By" dropdown or toggle to the dashboard.
- Default view should be "Alphabetical (Alias)."
- New sort option: "Neglect Level":
    - **Primary Sort:** Oldest `historicalReport` date first.
    - **Secondary Sort:** For plants with NO reports, sort by `boundDate` (oldest first).
- Plants with no reports and the oldest `boundDate` should appear at the absolute top.

**Technical Notes:**
- Sorting logic should handle `null` or `undefined` `historicalReports` by defaulting to the secondary sort.
- Use `Date.parse()` for comparing report timestamps.

