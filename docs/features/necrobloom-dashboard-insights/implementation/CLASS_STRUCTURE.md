# Class Structure: Necrobloom Dashboard 2.0

## Types (`apps/necrobloom/src/types/plant.ts`)

### `HealthStatus` (Enum-like string union)
- `'thriving' | 'stable' | 'in-peril'`

### `HealthReport`
- `date`: string (ISO)
- `healthStatus`: string
- `imageUrl`: string

### `CarePlan`
- `waterFrequency`: string
- `lightNeeds`: string
- `toxicity`: string
- `additionalNotes`: string

### `Plant`
- `id`: string
- `alias`: string
- `species`: string
- `boundDate`: string (ISO)
- `historicalReports`: `HealthReport[]`
- `carePlan?`: `CarePlan`

## Components

### `VesselHeader`
- **Props**:
    - `plants`: `Plant[]`
- **Internal Hooks**:
    - `useMemo` for Harmony Index and Oracle text.

### `VitalityMeter`
- **Props**:
    - `plants`: `Plant[]`
    - `activeFilter`: `HealthStatus | null`
    - `onFilterChange`: `(status: HealthStatus | null) => void`

### `CohortGroup`
- **Props**:
    - `title`: string
    - `count`: number
    - `children`: ReactNode

## Logic Utilities (`apps/necrobloom/src/utils/plantLogic.ts`)
- `getPlantHealth(plant: Plant): HealthStatus`
- `mapWateringFrequency(frequency: string): string`
- `sortPlantsByNeglect(a: Plant, b: Plant): number`
