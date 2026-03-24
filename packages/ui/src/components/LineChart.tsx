import * as React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { resolveColor } from "./chartColors";
import { ChartTooltip } from "./ChartTooltip";
import { Typography } from "./Typography";
import { Button } from "./Button";
import type { ChartDataSeries, TimeRange } from "./BarChart";

export interface LineChartProps {
  series: ChartDataSeries;
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

export const LineChart: React.FC<LineChartProps> = ({
  series,
  height = 300,
  timeRange,
  onTimeRangeChange,
  emptyMessage = "No data available",
  className,
}) => {
  const lineColor = resolveColor(series.color, 2); // default witchcraft
  const dotColor = resolveColor("ectoplasm", 0);
  const isEmpty = series.data.length === 0;

  const chartData = React.useMemo(
    () => series.data.map((d) => ({ label: d.label, [series.name]: d.value })),
    [series]
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

      <div className="border-2 border-overlay rounded-none bg-void shadow-pixel">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart
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
              cursor={{ stroke: "#2D1B36", strokeDasharray: "3 3" }}
            />
            <Line
              type="monotone"
              dataKey={series.name}
              stroke={lineColor}
              strokeWidth={2}
              dot={{
                fill: dotColor,
                stroke: lineColor,
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                fill: dotColor,
                stroke: lineColor,
                strokeWidth: 2,
                r: 6,
              }}
              style={{
                filter: `drop-shadow(0 0 4px ${lineColor})`,
              }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
