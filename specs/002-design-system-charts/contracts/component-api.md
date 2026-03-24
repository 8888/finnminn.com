# Component API Contract: Design System Charts

**Feature**: 002-design-system-charts
**Date**: 2026-03-24
**Package**: `@finnminn/ui`

## Public Exports

All chart components are exported from `@finnminn/ui` via `packages/ui/src/index.tsx`.

```typescript
// Consumer usage
import { BarChart, LineChart, ProgressBar } from "@finnminn/ui";
import type {
  ChartDataPoint,
  ChartDataSeries,
  TimeRange,
  BarChartProps,
  LineChartProps,
  ProgressBarProps,
} from "@finnminn/ui";
```

## Type Definitions

```typescript
interface ChartDataPoint {
  label: string;
  value: number;
}

interface ChartDataSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string; // PixelGrim token: 'ectoplasm' | 'vampire' | 'witchcraft' | 'gold' | 'pip' | 'toxic'
}

type TimeRange = "7d" | "30d" | "all";
```

## BarChart

```typescript
interface BarChartProps {
  series: ChartDataSeries[];
  height?: number; // default: 300
  timeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
  emptyMessage?: string; // default: 'No data available'
  className?: string;
}

declare const BarChart: React.FC<BarChartProps>;
```

### Rendering Rules

- **Single series** (`series.length === 1`): Renders one bar per data point. No legend.
- **Multiple series** (`series.length > 1`): Renders grouped bars per label. Legend rendered below the chart showing each series name + color swatch.
- **Tooltip**: Hovering a bar cluster shows a combined tooltip with the label and all series values for that label.
- **Time range selector**: Rendered above the chart when `timeRange` is provided. Three buttons: "7d", "30d", "all".
- **Empty state**: When all series have empty `data` arrays, renders `emptyMessage` text centered in the chart area.
- **Scrolling**: When bars exceed the container width, horizontal scrolling is enabled.

### PixelGrim Styling

- Bar fill: series color with 2px black stroke
- Bar corners: sharp (radius 0)
- Drop shadow: `4px 4px 0px #000000` on bar group
- Container: `border-2 border-overlay rounded-none`
- Background: `bg-void`
- Tooltip: `bg-void border-2 border-overlay shadow-pixel` with Typography components

## LineChart

```typescript
interface LineChartProps {
  series: ChartDataSeries;
  height?: number; // default: 300
  timeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
  emptyMessage?: string; // default: 'No data available'
  className?: string;
}

declare const LineChart: React.FC<LineChartProps>;
```

### Rendering Rules

- **Line**: Connected polyline through all data points in order.
- **Data points**: Circle markers at each data point for hover targeting.
- **Tooltip**: Hovering a data point shows the label and value.
- **Single point**: Renders as a dot; no line drawn.
- **Zero values**: Rendered on the baseline, not skipped.
- **Time range selector**: Same behavior as BarChart.
- **Empty state**: Same behavior as BarChart.

### PixelGrim Styling

- Line stroke: series color (default `witchcraft`)
- Data point circles: series color with `ectoplasm` fill
- Container: same as BarChart
- Glow: subtle glow effect on line using series color

## ProgressBar

```typescript
interface ProgressBarProps {
  value: number; // 0-100, clamped
  color?: string; // default: 'witchcraft'
  label?: string;
  showValue?: boolean; // default: false
  className?: string;
}

declare const ProgressBar: React.FC<ProgressBarProps>;
```

### Rendering Rules

- **Fill width**: `value%` of the container width.
- **Clamping**: Values below 0 render as 0%; values above 100 render as 100%.
- **Label**: Rendered above the bar using Typography.Body when provided.
- **Value display**: When `showValue` is true, renders the numeric value as text.
- **Empty (0%)**: Track is visible, fill is not rendered.
- **Full (100%)**: Fill covers full width, no overflow.

### PixelGrim Styling

- Track: `bg-surface border border-overlay`
- Fill: series color background
- Height: `h-4` (16px)
- Animated stripe pattern overlay (optional, matching existing VitalityBar)

## Internal Components (Not Exported)

### ChartTooltip

Shared tooltip renderer for BarChart and LineChart. Styled with PixelGrim tokens. Receives data from Recharts tooltip callback and renders formatted label + values using Typography components.

### ChartLegend

Shared legend renderer for multi-series BarChart. Renders series name + color swatch pairs horizontally below the chart. Uses Typography.Body for labels, small colored squares for swatches.

### chartColors

Utility providing the default PixelGrim color cycle and a function to resolve color token names to hex values.
