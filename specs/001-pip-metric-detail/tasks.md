# Tasks: Pip Ritual Detail View

**Input**: Design documents from `/specs/001-pip-metric-detail/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.
**Tests**: Test tasks are included for pure business logic (streak calculation) and backend changes where correctness is critical.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- All paths are relative to repo root

---

## Phase 1: Setup

**Purpose**: Register the new `Tabs` component in the shared UI package's catalogue before any implementation begins (required first step per New Component Checklist).

- [ ] T001 Add `Tabs` component entry to `packages/ui/styleguide.toml` defining label, description, and category (Navigation)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Backend data access, client data hook, streak utility, shared Tabs component, and routing scaffold. All user story work is blocked until this phase is complete.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Backend (run in parallel with frontend tasks below)

- [ ] T002 [P] Add `findAllHabitLogsByUserIdAndRitualId(userId: String, ritualId: String): List<HabitLog>` method to `apps/pip/api/src/main/kotlin/com/finnminn/pip/tracker/CosmosRepository.kt` using SQL query `SELECT * FROM c WHERE c.userId = @userId AND c.type = 'habitLog' AND c.ritualId = @ritualId`
- [ ] T003 Extend `GetHabitLogs` function in `apps/pip/api/src/main/kotlin/com/finnminn/pip/tracker/HabitLogFunctions.kt` to read optional `ritualId` query param; when present, call `findAllHabitLogsByUserIdAndRitualId` instead of the date-range method; return `400` when neither `ritualId` nor `startDate`+`endDate` are provided (depends on T002)
- [ ] T004 [P] Add `ritualId` filter test case to `apps/pip/api/src/test/kotlin/com/finnminn/pip/tracker/HabitLogFunctionsTest.kt` — test that `GET /habitlogs?ritualId={id}` returns all logs for that ritual and `200 OK`

### Frontend — Streak Utility (run in parallel with backend)

- [ ] T005 [P] Implement `calculateStreakHistory(logs: HabitLog[], ritualId: string): StreakDataPoint[]` in `apps/pip/src/utils/streakCalculator.ts` — filter logs by ritualId + completed, collect unique dates sorted ascending, walk dates incrementing streak on consecutive days and resetting to 1 on gaps, return `{ date: string, streak: number }[]`
- [ ] T006 [P] Add unit tests for `streakCalculator.ts` in `apps/pip/src/__tests__/utils/streakCalculator.test.ts` covering: single day (streak=1), two consecutive days (streak=1,2), gap resets to 1, same-day deduplication, empty input

### Frontend — Data Hook (run in parallel with backend; can mock backend for local dev)

- [ ] T007 [P] Implement `useRitualDetail(ritualId: string): { logs: HabitLog[], isLoading: boolean, error: string | null }` hook in `apps/pip/src/hooks/useRitualDetail.ts` — fetch `GET /habitlogs?ritualId={ritualId}` with Bearer token on mount and when ritualId changes; do not re-fetch on time range changes
- [ ] T008 [P] Add hook tests for `useRitualDetail.ts` in `apps/pip/src/__tests__/hooks/useRitualDetail.test.ts` — test successful fetch populates `logs`, loading state during fetch, error state on failure, re-fetch when `ritualId` changes

### Frontend — Shared Tabs Component (run in parallel with backend)

- [ ] T009 [P] Implement `Tabs` and `Tab` sub-components in `packages/ui/src/components/Tabs.tsx` — `<Tabs>` manages active tab state and renders tab bar; `<Tab label="...">` is a named panel; active tab styled with `border-2 border-witchcraft shadow-pixel bg-surface`; inactive tabs use `bg-void border-overlay`; `rounded-none` on all elements; text via `<Typography.Body>`
- [ ] T010 [P] Create Storybook story in `packages/ui/src/stories/Navigation/Tabs.stories.tsx` — show default (first tab active), second tab active, and three-tab examples
- [ ] T011 Update Kitchen Sink in `packages/ui/src/stories/DesignSystem.stories.tsx` to include the `Tabs` component under the Navigation section (depends on T009)
- [ ] T012 Export `Tabs` and `Tab` from `packages/ui/src/index.tsx` (depends on T009)

### Frontend — Routing + Page Shell (depends on T009, T012)

- [ ] T013 Add `/tracker/ritual/:ritualId` route to `apps/pip/src/App.tsx` pointing to `<RitualDetailPage />` (depends on T012)
- [ ] T014 Create `RitualDetailPage.tsx` in `apps/pip/src/pages/RitualDetailPage.tsx` — read `ritualId` from route params; call `useRitualManager` (existing hook) to get the full rituals list and find the matching `Ritual` by id (redirect to `/tracker` if not found); call `useRitualDetail(ritualId)` for log data; render ritual name as heading using `<Typography.H1>`; render `<Tabs>` with three placeholder tabs ("Activity Log", "Trend", "Streak"); show `<Skeleton>` from `@finnminn/ui` while `isLoading`; show an error state `<Card>` with retry prompt when `error !== null` (depends on T007, T013)

**Checkpoint**: Foundation complete. Backend serves ritual-scoped logs. `Tabs` component is in Storybook. Route `/tracker/ritual/:ritualId` exists. All user story phases can now begin.

---

## Phase 3: User Story 1 — View Metric Activity Log (Priority: P1) 🎯 MVP

**Goal**: Users can navigate from the tracker to a ritual's detail view and see a full, timestamped, scrollable history of every check-in for that ritual.

**Independent Test**: Navigate to `/tracker/ritual/{id}`, confirm Activity Log tab is active by default, confirm all completed entries appear most-recent-first with date and time, confirm empty state when no entries exist, confirm scrolling works for large lists.

- [ ] T015 [US1] Add a clickable detail navigation trigger to `apps/pip/src/components/habits/RitualItem.tsx` — a small icon or secondary tap area that calls `navigate('/tracker/ritual/${ritual.id}')` using React Router `useNavigate`; must not interfere with the existing completion checkbox
- [ ] T016 [US1] Implement `RitualActivityLog.tsx` in `apps/pip/src/components/habits/RitualActivityLog.tsx` — accept `logs: HabitLog[]` prop, filter to `completed === true`, sort descending by `timestamp`, render each entry in a scrollable container (`overflow-y-auto max-h-[60vh]`) showing formatted date (`YYYY-MM-DD`) and time (`HH:MM`) using `<Typography.Body>`; show empty state message via `<Typography.Body variant="muted">` when no entries; use `bg-surface border-2 border-overlay` row styling with `shadow-pixel` on hover
- [ ] T017 [US1] Wire `RitualActivityLog` into the Activity Log tab of `RitualDetailPage.tsx` in `apps/pip/src/pages/RitualDetailPage.tsx` — pass `logs` from `useRitualDetail`; Activity Log tab is active by default (first tab)

**Checkpoint**: User Story 1 fully functional. Users can navigate to the detail view and read their full check-in history.

---

## Phase 4: User Story 2 — View Metric Trend Graph (Priority: P2)

**Goal**: Users can view a pixel-art bar chart showing check-in count per day over a selectable time range, with gaps for untracked days and a hover tooltip.

**Independent Test**: Navigate to `/tracker/ritual/{id}`, click the Trend tab, confirm bars appear for each day in the selected range with correct heights, confirm gaps show as absent/minimal bars for untracked days, confirm time range selector updates the graph without a page reload, confirm hovering a bar shows the date and count.

- [ ] T018 [US2] Implement `RitualTrendGraph.tsx` in `apps/pip/src/components/habits/RitualTrendGraph.tsx` — accept `logs: HabitLog[]` prop; maintain local `range: 7 | 30 | 'all'` state (default `30`); compute `TrendDataPoint[]` (count of completed entries per calendar day in range, 0 for untracked days); determine `maxCount = Math.max(1, ...data.map(d => d.count))` for proportional scaling; render time range selector buttons using `<Button>` from `@finnminn/ui`; render pixel-art CSS bar chart matching `OracleTrends` style — vertical bars in a `flex items-end` container, bar height set via inline `style={{ height: count === 0 ? '2px' : \`${(count / maxCount) \* 100}%\` }}`so bars scale proportionally with count (supports future counts > 1 per FR-004); colour`bg-ectoplasm shadow-pixel-ectoplasm`for count > 0,`bg-overlay`for 0; hover tooltip shows date + count via absolute-positioned div; when exactly 1 data point exists in range, show the bar plus a hint message "Track more days to see a trend" using`<Typography.Body variant="muted">`; empty state when no data in range
- [ ] T019 [US2] Wire `RitualTrendGraph` into the Trend tab of `RitualDetailPage.tsx` in `apps/pip/src/pages/RitualDetailPage.tsx` — pass `logs` from `useRitualDetail`

**Checkpoint**: User Story 2 functional. Trend tab shows interactive bar chart with time range filtering.

---

## Phase 5: User Story 3 — View Metric Streak Graph (Priority: P3)

**Goal**: Users can view a line graph of their consecutive-day streak count over time, with an independent time range selector and a hover tooltip.

**Independent Test**: Navigate to `/tracker/ritual/{id}`, click the Streak tab, confirm streak values increment correctly for consecutive days, confirm streak resets to 1 after a missed day, confirm the independent time range selector works, confirm hovering a data point shows date + streak value, confirm empty state when no entries exist.

- [ ] T020 [US3] Implement `RitualStreakGraph.tsx` in `apps/pip/src/components/habits/RitualStreakGraph.tsx` — accept `{ logs: HabitLog[], ritualId: string }` props; maintain local `range: 7 | 30 | 'all'` state (default `30`); call `calculateStreakHistory(logs, ritualId)` from `streakCalculator.ts` to get `StreakDataPoint[]`; filter to selected range; render time range selector buttons using `<Button>` from `@finnminn/ui`; render SVG polyline line graph — X-axis is date, Y-axis is streak count, polyline rendered with `stroke` set via `style={{ stroke: 'var(--color-witchcraft)' }}` (CSS custom property, not Tailwind class — Tailwind classes are invalid as SVG attributes); render data point `<circle>` elements with `style={{ fill: 'var(--color-ectoplasm)' }}` and hover tooltip showing date + streak value; empty state when no data; wrap SVG in a `<Card>` with `className="glow-witchcraft"`
- [ ] T021 [US3] Wire `RitualStreakGraph` into the Streak tab of `RitualDetailPage.tsx` in `apps/pip/src/pages/RitualDetailPage.tsx` — pass `logs` from `useRitualDetail` and `ritualId` (from route params, already available in `RitualDetailPage`) as explicit props

**Checkpoint**: All three user stories functional. Activity log, trend graph, and streak graph each independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Loading states, empty state consistency, PixelGrim compliance audit, and smoke-test validation.

- [ ] T022 [P] Audit PixelGrim compliance across all new files — verify no hardcoded hex/rgb colours, all text uses `<Typography />` sub-components, all borders are `border-2`, no `rounded-*` except `rounded-none`, no `glow={true}` on `size="xs"` or `"sm"` text in `apps/pip/src/components/habits/RitualActivityLog.tsx`, `RitualTrendGraph.tsx`, `RitualStreakGraph.tsx`, `apps/pip/src/pages/RitualDetailPage.tsx`, `packages/ui/src/components/Tabs.tsx`
- [ ] T023 Verify loading skeleton in `apps/pip/src/pages/RitualDetailPage.tsx` renders correctly while `useRitualDetail` is fetching — confirm `<Skeleton>` from `@finnminn/ui` is shown in the tab content area, not a blank flash
- [ ] T024 Verify all three tab empty states display correctly in `RitualDetailPage.tsx` when navigating to a ritual with no HabitLogs — each tab must show a distinct, meaningful empty state message using `<Typography.Body variant="muted">`
- [ ] T025 End-to-end smoke test per `quickstart.md` — start emulators + backend + frontend, navigate to `/tracker`, click a ritual's detail trigger, verify all three tabs load with data, switch time ranges on Trend and Streak tabs, confirm no page reload occurs

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user story phases
- **User Stories (Phases 3–5)**: All depend on Phase 2 completion; can then proceed in priority order or in parallel with separate work streams
- **Polish (Phase 6)**: Depends on all desired user story phases being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — no dependency on US2 or US3
- **US2 (P2)**: Can start after Phase 2 — no dependency on US1 or US3 (Trend tab content is independent)
- **US3 (P3)**: Can start after Phase 2 — depends on `streakCalculator.ts` (T005, done in Phase 2)

### Within Each Phase

- T002, T004, T005, T006, T007, T008, T009, T010 are all parallelisable in Phase 2
- T003 depends on T002; T011 depends on T009; T012 depends on T009; T013 depends on T012; T014 depends on T007 and T013

---

## Parallel Opportunities

### Phase 2 — Maximum Parallelism

```text
Parallel group A (backend):
  T002 — CosmosRepository new method
  T004 — HabitLogFunctionsTest ritualId test

Parallel group B (frontend utilities):
  T005 — streakCalculator.ts
  T006 — streakCalculator.test.ts
  T007 — useRitualDetail.ts
  T008 — useRitualDetail.test.ts

Parallel group C (shared UI):
  T009 — Tabs.tsx component
  T010 — Tabs.stories.tsx

Sequential within Phase 2:
  T002 → T003 (backend endpoint depends on repository method)
  T009 → T011 → T012 → T013 → T014 (UI chain)
```

### Phase 3 — Sequential (US1 is small)

```text
T015 → T016 → T017
```

### Phase 4 + 5 — Can run in parallel after Phase 2

```text
Parallel:
  Phase 4: T018 → T019
  Phase 5: T020 → T021
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002–T014)
3. Complete Phase 3: User Story 1 (T015–T017)
4. **STOP and VALIDATE**: Navigate to `/tracker/ritual/{id}`, confirm activity log displays all entries with timestamps
5. Ship if ready

### Incremental Delivery

1. Phase 1 + 2 → Foundation ready
2. Phase 3 → Activity log works → MVP
3. Phase 4 → Trend graph added → Demo improvement
4. Phase 5 → Streak graph added → Full feature
5. Phase 6 → Polish complete → Production ready

---

## Notes

- `[P]` tasks touch different files and have no unfinished task dependencies — safe to run concurrently
- Each user story phase is independently completable and testable before moving to the next
- Backend changes in T002–T004 are additive and non-breaking — existing `GET /habitlogs?startDate&endDate` behaviour is preserved
- Charts use custom CSS (no external library) — follow the `OracleTrends` pattern in `apps/pip/src/components/habits/OracleTrends.tsx` as a reference
- Streak graph uses inline SVG polyline — this is acceptable per research.md (no SVG constraint in constitution)
- Commit after each phase checkpoint at minimum
