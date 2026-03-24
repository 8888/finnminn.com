import * as React from "react";
import { Typography } from "./Typography";

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-void border-2 border-overlay shadow-pixel px-3 py-2 pointer-events-none">
      <Typography.Body size="xs" variant="muted">
        {label}
      </Typography.Body>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-2 h-2 shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <Typography.Body size="xs">
            {entry.name}: {entry.value}
          </Typography.Body>
        </div>
      ))}
    </div>
  );
};
