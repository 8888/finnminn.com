# Quickstart: Design System Charts & Graphs

**Feature**: 002-design-system-charts
**Date**: 2026-03-24

## Prerequisites

- Node.js and npm installed
- Repository cloned and `npm install` run at root
- Storybook available via `npm run storybook`

## Development Setup

```bash
# Switch to feature branch
git checkout 002-design-system-charts

# Install dependencies (includes recharts in @finnminn/ui)
npm install

# Start Storybook to develop/preview chart components
npm run storybook

# Start pip app to test migration
npm run dev -- --filter=pip
```

## Quick Usage

### BarChart (single series)

```tsx
import { BarChart } from "@finnminn/ui";

const trendData = {
  name: "Check-ins",
  data: [
    { label: "2026-03-18", value: 3 },
    { label: "2026-03-19", value: 1 },
    { label: "2026-03-20", value: 5 },
  ],
};

<BarChart series={[trendData]} timeRange="7d" onTimeRangeChange={setRange} />;
```

### BarChart (multi-series — OracleTrends style)

```tsx
import { BarChart } from "@finnminn/ui";

const series = [
  {
    name: "Morning Ritual",
    color: "ectoplasm",
    data: [
      { label: "2026-03-18", value: 1 },
      { label: "2026-03-19", value: 0 },
    ],
  },
  {
    name: "Evening Ritual",
    color: "vampire",
    data: [
      { label: "2026-03-18", value: 1 },
      { label: "2026-03-19", value: 1 },
    ],
  },
];

<BarChart series={series} timeRange="30d" onTimeRangeChange={setRange} />;
```

### LineChart

```tsx
import { LineChart } from "@finnminn/ui";

const streakData = {
  name: "Streak",
  data: [
    { label: "2026-03-18", value: 3 },
    { label: "2026-03-19", value: 4 },
    { label: "2026-03-20", value: 0 },
    { label: "2026-03-21", value: 1 },
  ],
};

<LineChart series={streakData} timeRange="30d" onTimeRangeChange={setRange} />;
```

### ProgressBar

```tsx
import { ProgressBar } from "@finnminn/ui";

<ProgressBar value={75} color="witchcraft" label="VITALITY" showValue />;
```

## Key Files

| File                                                   | Purpose                                      |
| ------------------------------------------------------ | -------------------------------------------- |
| `packages/ui/src/components/BarChart.tsx`              | Bar chart component                          |
| `packages/ui/src/components/LineChart.tsx`             | Line chart component                         |
| `packages/ui/src/components/ProgressBar.tsx`           | Progress bar component                       |
| `packages/ui/src/components/ChartTooltip.tsx`          | Shared tooltip (internal)                    |
| `packages/ui/src/components/ChartLegend.tsx`           | Shared legend (internal)                     |
| `packages/ui/src/components/chartColors.ts`            | Color palette utility (internal)             |
| `packages/ui/src/stories/BarChart.stories.tsx`         | BarChart Storybook stories                   |
| `packages/ui/src/stories/LineChart.stories.tsx`        | LineChart Storybook stories                  |
| `packages/ui/src/stories/ProgressBar.stories.tsx`      | ProgressBar Storybook stories                |
| `packages/ui/styleguide.toml`                          | Component registry (add entries)             |
| `apps/pip/src/components/habits/RitualTrendGraph.tsx`  | Migration target (use BarChart)              |
| `apps/pip/src/components/habits/RitualStreakGraph.tsx` | Migration target (use LineChart)             |
| `apps/pip/src/components/habits/VitalityBar.tsx`       | Migration target (use ProgressBar)           |
| `apps/pip/src/components/habits/OracleTrends.tsx`      | Migration target (use BarChart multi-series) |

## Testing

```bash
# Run pip tests to verify no regressions after migration
npm run test --filter=pip

# Visual verification in Storybook
npm run storybook
# Navigate to: Primitives/BarChart, Primitives/LineChart, Primitives/ProgressBar
```
