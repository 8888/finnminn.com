# Research: Pip Ritual Detail View

**Branch**: `001-pip-metric-detail` | **Date**: 2026-03-21

## Resolved Decisions

---

### 1. Charting Approach

**Decision**: Custom CSS pixel-art charts — no external charting library.

**Rationale**: `OracleTrends` (`apps/pip/src/components/habits/OracleTrends.tsx`) already implements bar charts using pure CSS flexbox with PixelGrim tokens (`bg-ectoplasm`, `bg-vampire`, `shadow-pixel-*`). Following the same approach preserves the aesthetic, avoids a new dependency, and keeps bundle size minimal. The trend graph (count-per-day bar) and streak graph (count-per-day line approximation using connected dots or column heights) can both be expressed with the same CSS patterns.

- Trend graph: vertical bars per day, height proportional to check-in count (0 or 1 currently). Pixel-art style matching OracleTrends bar rendering.
- Streak graph: line chart approximation using positioned elements or SVG path drawn with PixelGrim colours. A simple SVG polyline is acceptable given the low complexity and absence of any existing SVG constraint in the constitution.

**Alternatives considered**:

- Recharts: Rejected — no existing dependency, would add ~150KB to bundle, styling conflicts with PixelGrim tokens.
- D3.js: Rejected — unnecessary complexity for bar/line charts at this scale.
- Victory: Rejected — same reasons as Recharts.

---

### 2. Tab Component

**Decision**: Build `Tabs` + `Tab` components in `packages/ui` following the New Component Checklist.

**Rationale**: No tab component exists in `@finnminn/ui` (components: AppLauncher, AppTile, AsciiMarquee, Atmosphere, Badge, Button, Card, CommandBar, Image, Input, Skeleton, Terminal, Typography). A tab component is generically useful across all apps (necrobloom, web, eventhorizon could all benefit). Constitution Principle II requires shared reusable components to live in `packages/ui`.

Component design:

- `<Tabs>` — container, manages active tab state, renders tab bar
- `<Tab>` — individual tab item (label + content slot)
- Styling: `border-2`, `rounded-none`, `bg-void` / `bg-surface` for active/inactive, PixelGrim text tokens. Active tab uses `glow-witchcraft` or `shadow-pixel` border highlight. No `rounded-*` classes.
- Must be added to `styleguide.toml`, implemented, Storybook story added (Navigation/ hierarchy), Kitchen Sink updated, and exported from `src/index.tsx`.

**Alternatives considered**:

- Headless UI / Radix Tabs: Rejected — external dependencies; styling integration with PixelGrim is complex.
- Inline tab state per page: Rejected — would require duplication across any future tab usage; violates Principle II.

---

### 3. Backend: Fetching All Logs for a Single Ritual

**Decision**: Extend existing `GET /habitlogs` endpoint with an optional `ritualId` query parameter.

**Rationale**: The current `GET /habitlogs?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` returns all rituals' logs for a user in a date range. For the "all time" detail view, we need logs for a single ritual without a date constraint. Two options were evaluated:

- **Option A — Wide date range + client filter**: Pass `startDate=2020-01-01&endDate=today` and filter by `ritualId` client-side. Rejected: transfers unnecessary data; brittle against accounts predating 2020.
- **Option B — New `ritualId` query param on existing endpoint**: Add `ritualId` as an optional filter to `GetHabitLogs`. When provided (and `startDate`/`endDate` omitted), returns all logs for that ritual. This is additive and non-breaking.

Implementation:

- `HabitLogFunctions.kt`: `GetHabitLogs` reads optional `ritualId` from query params; dispatches to new repository method if present.
- `CosmosRepository.kt`: New method `findAllHabitLogsByUserIdAndRitualId(userId, ritualId)` — SQL query `SELECT * FROM c WHERE c.userId = @userId AND c.type = 'habitLog' AND c.ritualId = @ritualId`.
- Backend test: `HabitLogFunctionsTest` — add test case for `ritualId` filter path.

**Alternatives considered**:

- Separate endpoint `GET /habitlogs/ritual/{ritualId}`: Evaluated but rejected — the existing endpoint pattern is query-param based, adding a path param variant is inconsistent with the existing API style.

---

### 4. Routing

**Decision**: Add `/tracker/ritual/:ritualId` as a sibling route to `/tracker` in `App.tsx`.

**Rationale**: React Router v6.22 is already in use. `RitualDetailPage` is a peer to `TrackerPage` (not nested inside it), because the detail view replaces the full tracker content area rather than overlaying it. Navigation: `RitualItem` gets a clickable area or detail icon that pushes `navigate('/tracker/ritual/${ritual.id}')`. Back navigation returns to `/tracker`.

**Alternatives considered**:

- Modal overlay: Rejected — insufficient space for three tabs with graphs; modal UX is appropriate for edit/create (existing `RitualModal`), not for a full analytics view.
- Nested route inside `/tracker`: Rejected — would require `TrackerPage` to render an `<Outlet>`, complicating the existing page structure.

---

### 5. Streak Calculation

**Decision**: Extract streak logic into a standalone utility `apps/pip/src/utils/streakCalculator.ts`.

**Rationale**: `useVitality` computes an overall streak across all light rituals, not a per-ritual streak. The detail view needs per-ritual streak data for all historical dates (not just today's value). Extracting a pure function `calculateStreakHistory(logs: HabitLog[], ritualId: string): StreakDataPoint[]` keeps business logic testable and decoupled from component state.

Algorithm:

1. Filter logs by `ritualId` and `completed === true`.
2. Collect unique dates (`YYYY-MM-DD`) sorted ascending.
3. Walk dates: if current date is exactly one calendar day after previous, streak++; else streak = 1.
4. Return array of `{ date: string, streak: number }` for all recorded days.

**Alternatives considered**:

- Inline in component: Rejected — not unit-testable as a standalone function.
- Backend streak calculation: Rejected — adds unnecessary backend complexity; streak is derived from existing data, no new storage needed.

---

### 6. Activity Log Pagination

**Decision**: Paginate client-side — render all fetched logs but virtualise display using a scroll container with a fixed height (no infinite scroll or server-side pagination for MVP).

**Rationale**: The current `useHabitLogManager` fetches all logs for a date range at once. For the detail view, we fetch all logs for a ritual. A typical user with a daily ritual over 2 years has ~730 entries — manageable in memory. The log is presented in a scrollable container. True virtual scrolling (react-window) is deferred; CSS overflow scroll is sufficient for MVP within SC-001 (2-second load).

**Alternatives considered**:

- Server-side pagination: Rejected for MVP — adds API complexity, and user base is single-user personal app.
- Virtual scrolling library: Deferred — not needed for expected data volumes; can be added later without spec changes.
