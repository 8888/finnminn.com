# Design: Necrobloom Dashboard 2.0 - Vessel Insights

## Overview
The Necrobloom Dashboard 2.0 transforms the existing plant list into a comprehensive "Vessel Insights" command center. It introduces aggregate metrics, visual health distribution, and care-based groupings while maintaining the "PixelGrim" aesthetic.

## Component Architecture

### 1. `VesselHeader`
- **Purpose**: Displays collection-wide stats and the "Status Oracle".
- **State**: Derived from the `plants` array via props.
- **Logic**: 
    - `totalCount`: `plants.length`
    - `harmonyIndex`: `(Thriving + Stable) / Total`
    - `oracleText`: Switch statement based on `harmonyIndex`.

### 2. `VitalityMeter`
- **Purpose**: A segmented horizontal bar showing health distribution and acting as a filter.
- **Visuals**:
    - **Thriving**: Ectoplasm (#05FFA1)
    - **Stable**: Witchcraft (#7D5FFF)
    - **In Peril**: Radical (#FF0055)
- **Interactions**:
    - Clicking a segment toggles the filter for that health state.
    - Active filter is highlighted with a stronger glow.

### 3. `WateringCohortSection`
- **Purpose**: A collapsible (implied by sections) group of plants sharing a watering frequency.
- **Grouping Logic**:
    - Fuzzy matches `carePlan.waterFrequency` string.
    - Categories: Daily, Weekly, Bi-Weekly, Monthly, Strange Rhythms, Unbound.

## Data Flow
1. `Dashboard.tsx` fetches the full plant list.
2. `Dashboard.tsx` manages the `activeFilter` (Health) and `sortBy` (Neglect/Alpha) state.
3. A `useMemo` hook calculates `filteredAndSortedPlants`.
4. The `VesselHeader` and `VitalityMeter` receive the original `plants` array for aggregate stats.
5. The `filteredAndSortedPlants` array is then grouped into cohorts for display.

## Aesthetic Standards (PixelGrim)
- **Typography**: `VT323` for all headers, `Space Mono` for data.
- **Glows**: `glow-ectoplasm`, `glow-radical`, `glow-witchcraft` utility classes.
- **Borders**: Sharp corners, 2px borders with low-opacity toxic/witchcraft colors.
