import * as React from "react";
import { Typography } from "./Typography";

interface LegendItem {
  name: string;
  color: string;
}

interface ChartLegendProps {
  items: LegendItem[];
}

export const ChartLegend: React.FC<ChartLegendProps> = ({ items }) => {
  return (
    <div className="flex flex-wrap gap-4 pt-2">
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div
            className="w-3 h-3 border border-black shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <Typography.Body size="xs">{item.name}</Typography.Body>
        </div>
      ))}
    </div>
  );
};
