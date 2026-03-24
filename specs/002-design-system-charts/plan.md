# Implementation Plan: Design System Charts & Graphs

**Branch**: `002-design-system-charts` | **Date**: 2026-03-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-design-system-charts/spec.md`

## Summary

Add reusable BarChart, LineChart, and ProgressBar components to the `@finnminn/ui` shared package using Recharts as the rendering engine, styled to the PixelGrim design system. Migrate pip's existing custom chart implementations (RitualTrendGraph, RitualStreakGraph, OracleTrends, VitalityBar) to use these shared components with zero data regression.

## Technical Context

**Language/Version**: TypeScript 5.x (React 18, Vite)
**Primary Dependencies**: Recharts v3.x (new), React 18.2, Tailwind CSS, @finnminn/ui, @finnminn/config
**Storage**: N/A (frontend display components; data provided by consumers)
**Testing**: Vitest (pip app tests), Storybook (visual verification)
**Target Platform**: Web browsers (modern evergreen), responsive down to 375px
**Project Type**: Shared component library (`packages/ui`) + app migration (`apps/pip`)
**Performance Goals**: Charts render in <100ms for datasets up to 500 points; no jank on scroll
**Constraints**: Must preserve PixelGrim aesthetic (sharp corners, pixel shadows, color tokens); Recharts adds ~170-200 KB gzipped to the UI package bundle
**Scale/Scope**: 3 new components, 3 internal helpers, 3 Storybook story files, 4 pip component migrations

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                         | Status | Notes                                                                                                                                                                                         |
| --------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **I. PixelGrim Design System**    | PASS   | All chart components use Tailwind tokens, Typography for text, border-2 rounded-none, shadow-pixel. Custom Recharts tooltip/legend components enforce PixelGrim styling. No hardcoded colors. |
| **II. Shared Package Discipline** | PASS   | Components built in `packages/ui`, following New Component Checklist (styleguide.toml → component → story → Kitchen Sink → export). No app-specific logic in shared components.               |
| **III. App Independence**         | PASS   | Chart components are generic; pip-specific data transformation stays in pip. No cross-app imports. OracleTrends "magic insight" text remains in pip.                                          |
| **IV. Serverless-First Backend**  | N/A    | Frontend-only feature. No backend changes.                                                                                                                                                    |
| **V. Authentication Safety**      | N/A    | No auth changes. Charts render data already fetched by existing auth-gated API calls.                                                                                                         |

**Post-Phase 1 re-check**: All principles remain satisfied. Recharts is installed as a workspace dependency of `@finnminn/ui` (not globally), satisfying monorepo tooling constraints. No new CSS-in-JS libraries introduced (Recharts is SVG-based, styled via props and Tailwind classes).

## Project Structure

### Documentation (this feature)

```text
specs/002-design-system-charts/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: library evaluation, styling strategy
├── data-model.md        # Phase 1: types, props, data mappings
├── quickstart.md        # Phase 1: usage examples and key files
├── contracts/
│   └── component-api.md # Phase 1: public component API contract
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
packages/ui/
├── package.json                          # Add recharts dependency
├── styleguide.toml                       # Add BarChart, LineChart, ProgressBar entries
├── src/
│   ├── index.tsx                         # Export new components + types
│   ├── components/
│   │   ├── BarChart.tsx                  # NEW: Bar chart (single + multi-series)
│   │   ├── LineChart.tsx                 # NEW: Line chart
│   │   ├── ProgressBar.tsx              # NEW: Progress bar
│   │   ├── ChartTooltip.tsx             # NEW: Internal shared tooltip
│   │   ├── ChartLegend.tsx              # NEW: Internal shared legend
│   │   └── chartColors.ts              # NEW: Internal color palette utility
│   └── stories/
│       ├── BarChart.stories.tsx          # NEW: BarChart stories
│       ├── LineChart.stories.tsx         # NEW: LineChart stories
│       ├── ProgressBar.stories.tsx       # NEW: ProgressBar stories
│       └── DesignSystem.stories.tsx      # UPDATE: Add charts to Kitchen Sink

apps/pip/src/
├── components/habits/
│   ├── RitualTrendGraph.tsx              # MIGRATE: Replace custom bars with BarChart
│   ├── RitualStreakGraph.tsx             # MIGRATE: Replace custom SVG with LineChart
│   ├── VitalityBar.tsx                  # MIGRATE: Replace custom bar with ProgressBar
│   └── OracleTrends.tsx                 # MIGRATE: Replace custom dual-bars with BarChart (multi-series)
```

**Structure Decision**: This feature spans two existing workspaces — `packages/ui` (new components) and `apps/pip` (migration of existing custom charts). No new workspaces or directories are created. The structure follows the existing monorepo conventions exactly.

## Complexity Tracking

No constitution violations. No complexity justifications needed.
