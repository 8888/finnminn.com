# Implementation Plan: Pip Ritual Detail View

**Branch**: `001-pip-metric-detail` | **Date**: 2026-03-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-pip-metric-detail/spec.md`

## Summary

Add a per-ritual detail view to the pip habit tracker with three tabs: an activity log (timestamped check-in history), a trend graph (check-ins per day over selectable time ranges), and a streak graph (consecutive-day streak count over time). A `Tabs` component will be built in `@finnminn/ui` for reuse across apps. Charts follow the existing custom CSS pixel-art approach used in `OracleTrends`. The backend `GET /habitlogs` endpoint is extended with an optional `ritualId` filter parameter.

## Technical Context

**Language/Version**: TypeScript (React 18, Vite) — frontend; Kotlin 1.9.22 (Java 17) — backend
**Primary Dependencies**: React Router v6.22, `@finnminn/ui`, `@finnminn/auth`, Azure Functions SDK, Azure Cosmos 4.53.0
**Storage**: Cosmos DB (existing Items container, partition key `/userId`)
**Testing**: Vitest + React Testing Library (frontend); JUnit 5 + Mockito (backend)
**Target Platform**: Azure Static Web Apps (pip.finnminn.com, port 5173 local)
**Project Type**: Web application (SPA frontend + serverless Azure Functions backend)
**Performance Goals**: Detail view hydrated within 2 seconds (SC-001); graph re-renders on time range switch without page reload
**Constraints**: PixelGrim design tokens only; no external charting libraries; no always-on servers; custom CSS charts matching OracleTrends aesthetic
**Scale/Scope**: Single user's ritual history; "all time" queries bounded by the user's account creation date; no multi-tenancy concerns

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design._

| Principle             | Status | Notes                                                                                                                                                                       |
| --------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. PixelGrim          | PASS   | All new components use `@finnminn/ui` + PixelGrim tokens; charts built with CSS (no Recharts/D3); `Tabs` component added to `packages/ui` following New Component Checklist |
| II. Shared Package    | PASS   | `Tabs` component lives in `packages/ui` (reusable across apps); detail page components stay in `apps/pip` (app-specific)                                                    |
| III. App Independence | PASS   | Feature is pip-only; no cross-app imports; shares only through `packages/`                                                                                                  |
| IV. Serverless-First  | PASS   | Backend change extends existing Azure Function; no new servers or persistent processes                                                                                      |
| V. Auth Safety        | PASS   | No auth changes; uses existing `@finnminn/auth` `getIdToken()` pattern; `AUTH_DEBUGGING_AND_IMPLEMENTATION.md` not required (no auth flow changes)                          |

**No violations. Complexity Tracking table not required.**

## Project Structure

### Documentation (this feature)

```text
specs/001-pip-metric-detail/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── habitlogs-api.md ← Phase 1 output
└── tasks.md             ← Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
packages/ui/src/
├── components/
│   └── Tabs.tsx                       ← NEW (Tabs + Tab sub-components)
├── stories/
│   └── Navigation/Tabs.stories.tsx    ← NEW (Storybook story)
└── index.tsx                          ← UPDATED (export Tabs)

apps/pip/src/
├── App.tsx                            ← UPDATED (add /tracker/ritual/:ritualId route)
├── pages/
│   └── RitualDetailPage.tsx           ← NEW (top-level detail page with header + tabs)
├── components/habits/
│   ├── RitualActivityLog.tsx          ← NEW (activity log tab)
│   ├── RitualTrendGraph.tsx           ← NEW (trend graph tab with time range selector)
│   └── RitualStreakGraph.tsx          ← NEW (streak line graph tab with time range selector)
├── hooks/
│   └── useRitualDetail.ts             ← NEW (fetches all HabitLogs for a single ritualId)
└── utils/
    └── streakCalculator.ts            ← NEW (extracts per-ritual streak logic from useVitality)

apps/pip/api/src/main/kotlin/com/finnminn/pip/tracker/
├── HabitLogFunctions.kt               ← UPDATED (add optional ritualId query param to GetHabitLogs)
└── CosmosRepository.kt                ← UPDATED (add findAllHabitLogsByUserIdAndRitualId method)
```

**Structure Decision**: Web application (Option 2). All new frontend code in `apps/pip/src/`. Reusable `Tabs` UI component in `packages/ui/` per Constitution Principle II.

## Complexity Tracking

> No violations — table not required.
