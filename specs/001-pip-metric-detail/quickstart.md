# Quickstart: Pip Ritual Detail View

**Branch**: `001-pip-metric-detail` | **Date**: 2026-03-21

## Prerequisites

```bash
# From repo root — ensure emulators and backend are running
npm run emulators:start
cd apps/pip/api && ./gradlew azureFunctionsRun   # port 7071

# In a separate terminal — start the pip frontend
npm run dev -- --filter=pip                      # port 5173
```

If `local.settings.json` is missing in `apps/pip/api/`, run `npm run bootstrap` from repo root first.

## Development Flow

### 1. Backend change first (`apps/pip/api`)

1. Open `apps/pip/api/src/main/kotlin/com/finnminn/pip/tracker/CosmosRepository.kt`
2. Add `findAllHabitLogsByUserIdAndRitualId(userId: String, ritualId: String): List<HabitLog>` method
3. Open `HabitLogFunctions.kt` → extend `GetHabitLogs` to read optional `ritualId` query param
4. Run backend tests: `cd apps/pip/api && ./gradlew test`
5. Restart `azureFunctionsRun` to pick up changes

### 2. Tabs component (`packages/ui`)

1. Add `Tabs` entry to `packages/ui/styleguide.toml`
2. Implement `packages/ui/src/components/Tabs.tsx` (`<Tabs>` + `<Tab>`)
3. Create `packages/ui/src/stories/Navigation/Tabs.stories.tsx`
4. Update `packages/ui/src/stories/DesignSystem.stories.tsx` (Kitchen Sink)
5. Export from `packages/ui/src/index.tsx`
6. Test in Storybook: `npm run storybook` (port 6006)

### 3. Frontend feature (`apps/pip`)

Build in this order (each step is independently testable):

1. `apps/pip/src/utils/streakCalculator.ts` + unit tests (`__tests__/utils/streakCalculator.test.ts`)
2. `apps/pip/src/hooks/useRitualDetail.ts` + hook tests (`__tests__/hooks/useRitualDetail.test.ts`)
3. `apps/pip/src/components/habits/RitualActivityLog.tsx`
4. `apps/pip/src/components/habits/RitualTrendGraph.tsx`
5. `apps/pip/src/components/habits/RitualStreakGraph.tsx`
6. `apps/pip/src/pages/RitualDetailPage.tsx` (assembles tabs + components)
7. `apps/pip/src/App.tsx` — add route `/tracker/ritual/:ritualId`
8. `apps/pip/src/components/habits/RitualItem.tsx` — add navigation trigger to detail view

### 4. Run all frontend tests

```bash
npm run test -- --filter=pip
```

## Key File Locations

| File                                                   | Purpose                     |
| ------------------------------------------------------ | --------------------------- |
| `apps/pip/src/App.tsx`                                 | Add new route               |
| `apps/pip/src/pages/RitualDetailPage.tsx`              | NEW — top-level detail page |
| `apps/pip/src/components/habits/RitualActivityLog.tsx` | NEW — log tab               |
| `apps/pip/src/components/habits/RitualTrendGraph.tsx`  | NEW — trend graph tab       |
| `apps/pip/src/components/habits/RitualStreakGraph.tsx` | NEW — streak graph tab      |
| `apps/pip/src/hooks/useRitualDetail.ts`                | NEW — data fetching         |
| `apps/pip/src/utils/streakCalculator.ts`               | NEW — streak logic          |
| `packages/ui/src/components/Tabs.tsx`                  | NEW — shared tab component  |
| `apps/pip/api/.../HabitLogFunctions.kt`                | UPDATED — ritualId filter   |
| `apps/pip/api/.../CosmosRepository.kt`                 | UPDATED — new query method  |

## Navigating to the Detail View (Dev)

1. Go to `http://localhost:5173/tracker`
2. Click a ritual row (after `RitualItem` navigation is wired in step 3.8)
3. You should land on `http://localhost:5173/tracker/ritual/{ritualId}`

## PixelGrim Reminders

- All text → `<Typography />` sub-components only
- Colors → `text-witchcraft`, `text-ectoplasm`, `text-vampire`, `text-toxic`, `bg-void`, `bg-surface`
- Borders → `border-2`; radius → `rounded-none`; shadows → `shadow-pixel` or `glow-[color]`
- No `glow={true}` on `size="xs"` or `"sm"` text
- Charts: match `OracleTrends` pixel-art bar style (CSS flexbox, PixelGrim colour tokens)
