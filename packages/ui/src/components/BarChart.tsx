import * as React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { resolveColor } from "./chartColors";
import { ChartTooltip } from "./ChartTooltip";
import { ChartLegend } from "./ChartLegend";
import { Typography } from "./Typography";
import { Button } from "./Button";

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartDataSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
}

export type TimeRange = "7d" | "30d" | "90d" | "all";

export interface BarChartProps {
  series: ChartDataSeries[];
  height?: number;
  timeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
  emptyMessage?: string;
  className?: string;
}

const TIME_RANGES: TimeRange[] = ["7d", "30d", "90d", "all"];

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  "7d": "7d",
  "30d": "30d",
  "90d": "90d",
  all: "All",
};

export const BarChart: React.FC<BarChartProps> = ({
  series,
  height = 300,
  timeRange,
  onTimeRangeChange,
  emptyMessage = "No data available",
  className,
}) => {
  const isEmpty = series.every((s) => s.data.length === 0);
  const isMultiSeries = series.length > 1;

  // Merge data points by label for grouped bars
  const chartData = React.useMemo(() => {
    if (series.length === 0) return [];

    const labelSet = new Map<string, Record<string, number>>();
    for (const s of series) {
      for (const point of s.data) {
        if (!labelSet.has(point.label)) {
          labelSet.set(point.label, {});
        }
        labelSet.get(point.label)![s.name] = point.value;
      }
    }

    // Preserve order from first series
    const allLabels: string[] = [];
    const seen = new Set<string>();
    for (const s of series) {
      for (const point of s.data) {
        if (!seen.has(point.label)) {
          seen.add(point.label);
          allLabels.push(point.label);
        }
      }
    }

    return allLabels.map((label) => ({
      label,
      ...labelSet.get(label),
    }));
  }, [series]);

  const resolvedColors = React.useMemo(
    () => series.map((s, i) => resolveColor(s.color, i)),
    [series]
  );

  const legendItems = React.useMemo(
    () =>
      isMultiSeries
        ? series.map((s, i) => ({ name: s.name, color: resolvedColors[i] }))
        : [],
    [series, isMultiSeries, resolvedColors]
  );

  if (isEmpty) {
    return (
      <div
        className={`border-2 border-overlay rounded-none bg-void flex items-center justify-center ${className ?? ""}`}
        style={{ height }}
      >
        <Typography.Body variant="muted">{emptyMessage}</Typography.Body>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      {timeRange !== undefined && onTimeRangeChange && (
        <div className="flex gap-2">
          {TIME_RANGES.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={timeRange === r ? "primary" : "ghost"}
              onClick={() => onTimeRangeChange(r)}
            >
              {TIME_RANGE_LABELS[r]}
            </Button>
          ))}
        </div>
      )}

      <div className="border-2 border-overlay rounded-none bg-void shadow-pixel overflow-x-auto">
        <div style={{ minWidth: Math.max(chartData.length * 24, 300) }}>
          <ResponsiveContainer width="100%" height={height}>
            <RechartsBarChart
              data={chartData}
              margin={{ top: 16, right: 16, bottom: 8, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-overlay, #2D1B36)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#AEA2BA", fontSize: 12 }}
                axisLine={{ stroke: "#2D1B36" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#AEA2BA", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "rgba(45, 27, 54, 0.4)" }}
              />
              {series.map((s, i) => (
                <Bar
                  key={s.name}
                  dataKey={s.name}
                  fill={resolvedColors[i]}
                  stroke="#000000"
                  strokeWidth={2}
                  radius={0}
                  style={{
                    filter: "drop-shadow(4px 4px 0px rgba(0,0,0,0.3))",
                  }}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {isMultiSeries && <ChartLegend items={legendItems} />}
    </div>
  );
};
