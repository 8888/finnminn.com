# Tasks: Design System Charts & Graphs

**Input**: Design documents from `/specs/002-design-system-charts/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in spec. Vitest regression run included in Polish phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Install dependencies and register new components in the design system

- [x] T001 Install recharts as a dependency in packages/ui/package.json and run npm install from repo root
- [x] T002 [P] Add BarChart, LineChart, and ProgressBar component entries to packages/ui/styleguide.toml following existing component definition patterns

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared internal utilities and sub-components required by all chart components

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Create chart color palette utility with PixelGrim color cycle (ectoplasm, vampire, witchcraft, gold, pip, toxic) and token-to-hex resolver in packages/ui/src/components/chartColors.ts
- [x] T004 [P] Create shared ChartTooltip component with PixelGrim styling (bg-void, border-2 border-overlay, shadow-pixel, Typography) that receives Recharts tooltip payload and renders formatted label + values in packages/ui/src/components/ChartTooltip.tsx
- [x] T005 [P] Create shared ChartLegend component that renders series name + color swatch pairs horizontally using Typography.Body in packages/ui/src/components/ChartLegend.tsx

**Checkpoint**: Foundation ready — chart component implementation can now begin

---

## Phase 3: User Story 1 — View Habit Trend as a Clear Bar Chart (Priority: P1) MVP

**Goal**: Deliver a reusable BarChart component in @finnminn/ui and migrate pip's RitualTrendGraph to use it, so users can read their habit trend data at a glance with proportional bars and hover tooltips.

**Independent Test**: Navigate to a ritual's detail page in pip → Trend tab → verify bars are proportional, tooltips show date + count on hover, empty state renders when no data, horizontal scroll works on narrow screens.

### Implementation for User Story 1

- [x] T006 [US1] Implement BarChart component in packages/ui/src/components/BarChart.tsx — accepts ChartDataSeries[], supports single-series and multi-series grouped layouts, renders time-range selector when timeRange prop provided, uses ChartTooltip for combined cluster tooltips, renders ChartLegend when multiple series, shows empty state message, enables horizontal scroll for overflow, applies PixelGrim styling (border-2 rounded-none bg-void shadow-pixel, bar fill with 2px stroke, radius 0)
- [x] T007 [US1] Create BarChart Storybook stories in packages/ui/src/stories/BarChart.stories.tsx — stories for: single-series with typical data, single-series empty state, single-series single data point, single-series large dataset (30+ bars), multi-series grouped bars (2 series), multi-series with legend, with time-range selector, narrow container (375px) with scroll. Follow Storybook hierarchy: Primitives/BarChart
- [x] T008 [US1] Export BarChart component and all chart types (ChartDataPoint, ChartDataSeries, TimeRange, BarChartProps) from packages/ui/src/index.tsx
- [x] T009 [US1] Migrate RitualTrendGraph in apps/pip/src/components/habits/RitualTrendGraph.tsx to use the shared BarChart from @finnminn/ui — convert HabitLog[] data to ChartDataSeries format (group by date, count per day), pass timeRange and onTimeRangeChange props, remove custom bar rendering and tooltip code, preserve existing range selector behavior (7d, 30d, all)

**Checkpoint**: User Story 1 complete — pip's trend tab shows a readable bar chart via the shared BarChart component

---

## Phase 4: User Story 2 — View Streak Progression as a Clear Line Chart (Priority: P2)

**Goal**: Deliver a reusable LineChart component in @finnminn/ui and migrate pip's RitualStreakGraph to use it, so users can see streak momentum with connected data points and hover tooltips.

**Independent Test**: Navigate to a ritual's detail page in pip → Streak tab → verify line connects points chronologically, tooltips show date + streak on hover, single data point renders as dot, zero values render on baseline.

### Implementation for User Story 2

- [x] T010 [US2] Implement LineChart component in packages/ui/src/components/LineChart.tsx — accepts single ChartDataSeries, renders connected line via Recharts Line with circle markers at data points, uses ChartTooltip for hover, shows empty state, renders time-range selector when timeRange prop provided, applies PixelGrim styling (line stroke in series color, dot fill in ectoplasm, glow effect, container border-2 rounded-none bg-void)
- [x] T011 [US2] Create LineChart Storybook stories in packages/ui/src/stories/LineChart.stories.tsx — stories for: typical time-series data, empty state, single data point (dot only), data with zero values, large dataset, with time-range selector. Follow Storybook hierarchy: Primitives/LineChart
- [x] T012 [US2] Export LineChart component and LineChartProps type from packages/ui/src/index.tsx
- [x] T013 [US2] Migrate RitualStreakGraph in apps/pip/src/components/habits/RitualStreakGraph.tsx to use the shared LineChart from @finnminn/ui — convert StreakDataPoint[] from calculateStreakHistory() to ChartDataSeries format, pass timeRange and onTimeRangeChange props, remove custom SVG polyline/circle rendering and foreignObject tooltips, preserve existing range selector behavior and Card glow-witchcraft wrapper

**Checkpoint**: User Story 2 complete — pip's streak tab shows a clear line chart via the shared LineChart component

---

## Phase 5: User Story 3 — Developers Reuse Chart Components Across All Apps (Priority: P3)

**Goal**: Migrate OracleTrends to the shared multi-series BarChart and add all chart components to the Kitchen Sink, proving components are reusable across apps with sensible PixelGrim defaults.

**Independent Test**: View Storybook Kitchen Sink → all chart components render. Import BarChart in OracleTrends with two ritual series → grouped bars display with legend and combined tooltips, insight text still rendered by pip outside the chart.

### Implementation for User Story 3

- [x] T014 [US3] Migrate OracleTrends in apps/pip/src/components/habits/OracleTrends.tsx to use the shared BarChart from @finnminn/ui — convert dual-ritual data to two ChartDataSeries (color: ectoplasm for ritual 1, vampire for ritual 2), use multi-series BarChart for the comparison visualization without timeRange/onTimeRangeChange (parent component owns the range and passes pre-filtered data), keep the oracle insight text, ritual selector dropdowns, and range control as pip-specific wrapping logic outside the BarChart
- [x] T015 [US3] Add BarChart, LineChart, and ProgressBar components to the Kitchen Sink in packages/ui/src/stories/DesignSystem.stories.tsx — add a "Data Visualization" section with representative examples of each chart type (single bar, multi-series bar, line chart, progress bar)

**Checkpoint**: User Story 3 complete — all chart components visible in Kitchen Sink, OracleTrends uses shared BarChart

---

## Phase 6: User Story 4 — Progress Bar in Design System (Priority: P4)

**Goal**: Deliver a reusable ProgressBar component in @finnminn/ui and migrate pip's VitalityBar to use it.

**Independent Test**: View ProgressBar in Storybook at 0%, 50%, 75%, 100% → bar fills proportionally. Navigate to pip ritual list → vitality bar renders with witchcraft fill and animated stripe.

### Implementation for User Story 4

- [x] T016 [US4] Implement ProgressBar component in packages/ui/src/components/ProgressBar.tsx — accepts value (0-100, clamped), optional color (default witchcraft), optional label, optional showValue, renders horizontal bar with bg-surface track and color fill, h-4 height, animated diagonal stripe overlay, PixelGrim styling (border border-overlay), uses Typography.Body for label and value text
- [x] T017 [US4] Create ProgressBar Storybook stories in packages/ui/src/stories/ProgressBar.stories.tsx — stories for: 0% empty, 25% partial, 50% half, 75% typical, 100% full, with label, with showValue, custom color (ectoplasm), custom color (vampire). Follow Storybook hierarchy: Primitives/ProgressBar
- [x] T018 [US4] Export ProgressBar component and ProgressBarProps type from packages/ui/src/index.tsx
- [x] T019 [US4] Migrate VitalityBar in apps/pip/src/components/habits/VitalityBar.tsx to use the shared ProgressBar from @finnminn/ui — pass vitality percentage as value, color as witchcraft, preserve the "VITALITY" and "CURRENT STREAK" labels rendered via Typography.Body, remove custom progress bar rendering and stripe animation (now handled by shared component)

**Checkpoint**: User Story 4 complete — pip's vitality bar uses shared ProgressBar, Storybook stories cover all states

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Regression verification and final validation

- [x] T020 Run pip test suite via `npm run test --filter=pip` to verify zero regressions across all 4 component migrations
- [x] T021 Verify Storybook builds successfully via `npm run storybook` and confirm all chart stories render correctly (BarChart, LineChart, ProgressBar, Kitchen Sink section)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on T001 (recharts installed) — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 completion — delivers MVP
- **US2 (Phase 4)**: Depends on Phase 2 completion — can run in parallel with US1
- **US3 (Phase 5)**: Depends on US1 completion (needs BarChart for OracleTrends migration) and US4 (needs ProgressBar for Kitchen Sink)
- **US4 (Phase 6)**: Depends on Phase 2 completion — can run in parallel with US1 and US2
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: After Foundational — no dependencies on other stories
- **US2 (P2)**: After Foundational — no dependencies on other stories
- **US3 (P3)**: After US1 + US4 — needs BarChart for OracleTrends and ProgressBar for Kitchen Sink
- **US4 (P4)**: After Foundational — no dependencies on other stories

### Within Each User Story

- Component implementation before Storybook stories
- Component exported before pip migration
- Migration after component is available in @finnminn/ui

### Parallel Opportunities

- T002 can run in parallel with T001
- T003, T004, T005 can all run in parallel (different files)
- US1 (Phase 3) and US2 (Phase 4) can run in parallel after Foundational
- US4 (Phase 6) can run in parallel with US1 and US2
- Within US1: T007 (stories) can start after T006 (implementation)
- Within US2: T011 (stories) can start after T010 (implementation)

---

## Parallel Example: After Foundational Phase

```bash
# These three user stories can start simultaneously:

# Stream A — User Story 1 (Bar Chart + Trend Migration):
Task: T006 "Implement BarChart component in packages/ui/src/components/BarChart.tsx"
Task: T007 "Create BarChart Storybook stories in packages/ui/src/stories/BarChart.stories.tsx"
Task: T008 "Export BarChart from packages/ui/src/index.tsx"
Task: T009 "Migrate RitualTrendGraph in apps/pip/src/components/habits/RitualTrendGraph.tsx"

# Stream B — User Story 2 (Line Chart + Streak Migration):
Task: T010 "Implement LineChart component in packages/ui/src/components/LineChart.tsx"
Task: T011 "Create LineChart Storybook stories in packages/ui/src/stories/LineChart.stories.tsx"
Task: T012 "Export LineChart from packages/ui/src/index.tsx"
Task: T013 "Migrate RitualStreakGraph in apps/pip/src/components/habits/RitualStreakGraph.tsx"

# Stream C — User Story 4 (Progress Bar + VitalityBar Migration):
Task: T016 "Implement ProgressBar component in packages/ui/src/components/ProgressBar.tsx"
Task: T017 "Create ProgressBar Storybook stories in packages/ui/src/stories/ProgressBar.stories.tsx"
Task: T018 "Export ProgressBar from packages/ui/src/index.tsx"
Task: T019 "Migrate VitalityBar in apps/pip/src/components/habits/VitalityBar.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install recharts, register components)
2. Complete Phase 2: Foundational (chartColors, ChartTooltip, ChartLegend)
3. Complete Phase 3: User Story 1 (BarChart + RitualTrendGraph migration)
4. **STOP and VALIDATE**: Test User Story 1 independently — trend tab in pip shows readable bar chart
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (BarChart) → Test in pip trend tab → MVP
3. Add User Story 2 (LineChart) → Test in pip streak tab → Increment
4. Add User Story 4 (ProgressBar) → Test in pip vitality bar → Increment
5. Add User Story 3 (OracleTrends + Kitchen Sink) → Full feature complete
6. Polish → Regression verification

### Sequential Solo Strategy

With a single developer, execute in priority order:
Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2) → Phase 6 (US4) → Phase 5 (US3) → Phase 7

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- US3 is intentionally last because it depends on BarChart (from US1) and ProgressBar (from US4) being available
- ProgressBar (US4) does not use Recharts — it's a simple HTML/CSS component. It can be implemented without any Recharts knowledge.
