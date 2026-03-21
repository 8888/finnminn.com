# Data Model: Pip Ritual Detail View

**Branch**: `001-pip-metric-detail` | **Date**: 2026-03-21

## Existing Entities (unchanged)

### Ritual

Stored in Cosmos DB container "Items" (`type: 'ritual'`).

| Field       | Type                | Notes                                     |
| ----------- | ------------------- | ----------------------------------------- |
| `id`        | `string`            | UUID, partition key prefix                |
| `userId`    | `string`            | Partition key `/userId`                   |
| `type`      | `'ritual'`          | Discriminator field                       |
| `name`      | `string`            | Display name of the habit                 |
| `nature`    | `'light' \| 'void'` | Positive (light) or negative (void) habit |
| `timestamp` | `string` (ISO 8601) | Creation time                             |

### HabitLog

Stored in Cosmos DB container "Items" (`type: 'habitLog'`).

| Field       | Type                  | Notes                                         |
| ----------- | --------------------- | --------------------------------------------- |
| `id`        | `string`              | UUID                                          |
| `userId`    | `string`              | Partition key `/userId`                       |
| `type`      | `'habitLog'`          | Discriminator field                           |
| `ritualId`  | `string`              | Foreign key → Ritual.id                       |
| `date`      | `string` (YYYY-MM-DD) | Calendar day in user's local timezone         |
| `completed` | `boolean`             | Whether the ritual was completed on this date |
| `timestamp` | `string` (ISO 8601)   | When the log entry was created/updated        |

**Constraint**: One `HabitLog` per `(userId, ritualId, date)` — enforced by `ToggleHabitLog` upsert logic.

## New Derived Types (client-side only, not persisted)

### TrendDataPoint

Computed from `HabitLog[]` for a given ritual and time range. Used by `RitualTrendGraph`.

| Field   | Type     | Notes                                                                                 |
| ------- | -------- | ------------------------------------------------------------------------------------- |
| `date`  | `string` | `YYYY-MM-DD` — the calendar day                                                       |
| `count` | `number` | Number of completed check-ins on this day (currently 0 or 1; designed to support > 1) |

**Derivation**: For each calendar day in the selected range, count `HabitLog` entries where `ritualId` matches and `completed === true`. Days with no logs → `count: 0` (shown as gap).

### StreakDataPoint

Computed from `HabitLog[]` for a given ritual across all time. Used by `RitualStreakGraph`.

| Field    | Type     | Notes                                                  |
| -------- | -------- | ------------------------------------------------------ |
| `date`   | `string` | `YYYY-MM-DD` — a day on which the ritual was completed |
| `streak` | `number` | Consecutive-day count ending on this date (minimum 1)  |

**Derivation** (see `streakCalculator.ts`):

1. Filter logs to `ritualId` + `completed === true`. Collect unique `date` values sorted ascending.
2. For each date: if `dayDiff(prevDate, currentDate) === 1` then `streak = prevStreak + 1`, else `streak = 1`.
3. Only dates with completions appear in the array. Missing days have no point — shown as a break in the streak graph.

### ActivityLogEntry

A display-oriented projection of `HabitLog` for the activity log tab.

| Field       | Type      | Notes                                                      |
| ----------- | --------- | ---------------------------------------------------------- |
| `id`        | `string`  | HabitLog.id                                                |
| `date`      | `string`  | `YYYY-MM-DD` display date                                  |
| `timestamp` | `string`  | ISO 8601 — used to display time of check-in                |
| `completed` | `boolean` | Filter: only `completed === true` entries shown in the log |

**Ordering**: Most-recent-first (sort descending by `timestamp`).

## Backend Repository Change

### New Method: `findAllHabitLogsByUserIdAndRitualId`

Added to `CosmosRepository.kt`.

- **Query**: `SELECT * FROM c WHERE c.userId = @userId AND c.type = 'habitLog' AND c.ritualId = @ritualId`
- **Parameters**: `userId: String`, `ritualId: String`
- **Returns**: `List<HabitLog>` — all log entries for that ritual across all dates (no date constraint)
- **Ordering**: Returned unsorted from Cosmos; sorted client-side by `timestamp` descending for activity log display.

## Validation Rules

- `RitualDetailPage` must validate that `ritualId` from route params matches a `Ritual` in the user's loaded rituals. If not found, redirect to `/tracker`.
- `calculateStreakHistory` must treat two check-ins on the same `date` as one streak-day (deduplicate by date before walking).
- Time range filter on trend/streak graphs: valid values are `7 | 30 | 'all'`. Default: `30`.
