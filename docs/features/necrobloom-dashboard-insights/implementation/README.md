# Implementation: Necrobloom Dashboard 2.0 - Vessel Insights

## Introduction
This feature implements Story 0 through Story 5 of the Necrobloom Dashboard 2.0 roadmap. It focuses on providing aggregate data visualization and improved management of plant specimens.

## Development Steps

### Phase 1: Foundation (Story 0)
- Unify types and refactor components to use the new `Plant` interface.
- Add `boundDate` to mock data or ensuring it's handled if missing.

### Phase 2: Analytics Components (Stories 1 & 2)
- Implement `VesselHeader` with the Harmony Index calculation.
- Implement `VitalityMeter` for visual health breakdown.

### Phase 3: Interaction & Triage (Stories 3, 4 & 5)
- Implement filtering logic via `VitalityMeter`.
- Implement sorting logic (Neglect Level).
- Group plants into Watering Cohorts with fuzzy matching.

## Verification Plan
- **Unit Tests**: Test `getPlantHealth` with various report strings. Test `mapWateringFrequency` with common AI outputs.
- **UI Tests**: Verify filters update the grid instantly. Verify "Strange Rhythms" captures unmapped frequencies.
- **Visual Audit**: Ensure "PixelGrim" aesthetics (glows, fonts) are consistent.
