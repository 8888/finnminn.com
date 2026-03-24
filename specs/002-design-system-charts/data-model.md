# Data Model: Design System Charts & Graphs

**Feature**: 002-design-system-charts
**Date**: 2026-03-24

## Core Types

### ChartDataPoint

A single data point in a chart series.

| Field   | Type     | Required | Description                                                                    |
| ------- | -------- | -------- | ------------------------------------------------------------------------------ |
| `label` | `string` | Yes      | Human-readable label for the x-axis (typically a date string or category name) |
| `value` | `number` | Yes      | Numeric value for the y-axis; must be >= 0 (negative values out of scope)      |

### ChartDataSeries

A named, ordered collection of data points representing one data series.

| Field   | Type               | Required | Description                                                                                                           |
| ------- | ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `name`  | `string`           | Yes      | Display name for the series (used in legend and tooltips)                                                             |
| `data`  | `ChartDataPoint[]` | Yes      | Ordered array of data points                                                                                          |
| `color` | `string`           | No       | PixelGrim color token name (e.g., `'ectoplasm'`, `'vampire'`). If omitted, auto-assigned from the default color cycle |

### TimeRange

A filter value representing the visible time window for time-series charts.

| Value   | Description        |
| ------- | ------------------ |
| `'7d'`  | Last 7 days        |
| `'30d'` | Last 30 days       |
| `'90d'` | Last 90 days       |
| `'all'` | All available data |

## Component Props

### BarChartProps

| Prop                | Type                         | Required | Default               | Description                                                        |
| ------------------- | ---------------------------- | -------- | --------------------- | ------------------------------------------------------------------ |
| `series`            | `ChartDataSeries[]`          | Yes      | —                     | One or more data series to render as vertical bars                 |
| `height`            | `number`                     | No       | `300`                 | Chart height in pixels                                             |
| `timeRange`         | `TimeRange`                  | No       | —                     | Currently selected time range (shows range selector when provided) |
| `onTimeRangeChange` | `(range: TimeRange) => void` | No       | —                     | Callback when user selects a different time range                  |
| `emptyMessage`      | `string`                     | No       | `'No data available'` | Message shown when all series have empty data arrays               |
| `className`         | `string`                     | No       | —                     | Additional CSS classes on the chart container                      |

**Behavior notes**:

- When `series` has one entry, renders a single-series bar chart (no legend)
- When `series` has multiple entries, renders grouped bars and a legend identifying each series by name and color
- Multi-series tooltips show all series values for the hovered cluster

### LineChartProps

| Prop                | Type                         | Required | Default               | Description                                                        |
| ------------------- | ---------------------------- | -------- | --------------------- | ------------------------------------------------------------------ |
| `series`            | `ChartDataSeries`            | Yes      | —                     | A single data series to render as a connected line                 |
| `height`            | `number`                     | No       | `300`                 | Chart height in pixels                                             |
| `timeRange`         | `TimeRange`                  | No       | —                     | Currently selected time range (shows range selector when provided) |
| `onTimeRangeChange` | `(range: TimeRange) => void` | No       | —                     | Callback when user selects a different time range                  |
| `emptyMessage`      | `string`                     | No       | `'No data available'` | Message shown when the data array is empty                         |
| `className`         | `string`                     | No       | —                     | Additional CSS classes on the chart container                      |

**Behavior notes**:

- Renders circles at each data point for hover targeting
- Single data point renders as a dot without a line
- Zero values are rendered on the baseline, not skipped

### ProgressBarProps

| Prop        | Type      | Required | Default        | Description                                  |
| ----------- | --------- | -------- | -------------- | -------------------------------------------- |
| `value`     | `number`  | Yes      | —              | Fill percentage (0-100)                      |
| `color`     | `string`  | No       | `'witchcraft'` | PixelGrim color token for the filled portion |
| `label`     | `string`  | No       | —              | Optional label rendered above the bar        |
| `showValue` | `boolean` | No       | `false`        | Whether to display the numeric percentage    |
| `className` | `string`  | No       | —              | Additional CSS classes on the container      |

**Behavior notes**:

- Value is clamped to 0-100 range
- At 0%, the bar track is visible but the fill is not rendered
- At 100%, the fill covers the full width with no overflow

## Mapping from Existing Pip Data Types

### RitualTrendGraph → BarChart

```
HabitLog[] → group by date → TrendDataPoint[] → ChartDataSeries
  - series.name = ritual name
  - point.label = date (YYYY-MM-DD)
  - point.value = count of logs for that date
```

### RitualStreakGraph → LineChart

```
HabitLog[] → calculateStreakHistory() → StreakDataPoint[] → ChartDataSeries
  - series.name = ritual name
  - point.label = date (YYYY-MM-DD)
  - point.value = streak count
```

### OracleTrends → BarChart (multi-series)

```
Ritual 1 logs + Ritual 2 logs → group by date → ChartDataSeries[]
  - series[0].name = ritual 1 name, color = 'ectoplasm'
  - series[1].name = ritual 2 name, color = 'vampire'
  - point.label = date (YYYY-MM-DD)
  - point.value = completion status (0 or 1)
```

### VitalityBar → ProgressBar

```
vitality score (0-100) → ProgressBar
  - value = vitality score
  - color = 'witchcraft'
  - label = "VITALITY"
  - showValue = true
```
