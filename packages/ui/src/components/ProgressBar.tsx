import * as React from "react";
import { resolveColor } from "./chartColors";
import { Typography } from "./Typography";

export interface ProgressBarProps {
  value: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = "witchcraft",
  label,
  showValue = false,
  className,
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const fillColor = resolveColor(color, 2);

  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-end">
          {label && (
            <Typography.Body variant="muted" size="xs" className="uppercase tracking-widest">
              {label}
            </Typography.Body>
          )}
          {showValue && (
            <Typography.Body size="xs">
              {Math.round(clampedValue)}%
            </Typography.Body>
          )}
        </div>
      )}

      <div className="h-4 w-full bg-surface border border-overlay relative overflow-hidden">
        {clampedValue > 0 && (
          <div
            className="h-full transition-all duration-1000 ease-out"
            style={{ width: `${clampedValue}%`, backgroundColor: fillColor }}
          />
        )}
        {/* Animated diagonal stripe overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)",
            backgroundSize: "10px 10px",
          }}
        />
      </div>
    </div>
  );
};
