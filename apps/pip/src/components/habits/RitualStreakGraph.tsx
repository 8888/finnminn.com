import React, { useMemo, useState } from 'react';
import { Typography, Button, Card } from '@finnminn/ui';
import { HabitLog } from '../../hooks/useHabitLogManager';
import { calculateStreakHistory, StreakDataPoint } from '../../utils/streakCalculator';

interface RitualStreakGraphProps {
  logs: HabitLog[];
  ritualId: string;
}

type Range = 7 | 30 | 'all';

export const RitualStreakGraph: React.FC<RitualStreakGraphProps> = ({ logs, ritualId }) => {
  const [range, setRange] = useState<Range>(30);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; point: StreakDataPoint } | null>(null);

  const allPoints = useMemo(() => calculateStreakHistory(logs, ritualId), [logs, ritualId]);

  const points: StreakDataPoint[] = useMemo(() => {
    if (range === 'all') return allPoints;
    const cutoff = new Date(Date.now() - (range - 1) * 86400000).toISOString().slice(0, 10);
    return allPoints.filter(p => p.date >= cutoff);
  }, [allPoints, range]);

  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Typography.Body variant="muted">No streak data to display for this range.</Typography.Body>
      </div>
    );
  }

  const maxStreak = Math.max(...points.map(p => p.streak), 1);
  const svgWidth = 600;
  const svgHeight = 160;
  const padX = 24;
  const padY = 16;
  const innerW = svgWidth - padX * 2;
  const innerH = svgHeight - padY * 2;

  function xOf(i: number): number {
    return points.length === 1
      ? padX + innerW / 2
      : padX + (i / (points.length - 1)) * innerW;
  }

  function yOf(streak: number): number {
    return padY + innerH - (streak / maxStreak) * innerH;
  }

  const polylinePoints = points
    .map((p, i) => `${xOf(i)},${yOf(p.streak)}`)
    .join(' ');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {([7, 30, 'all'] as Range[]).map(r => (
          <Button
            key={String(r)}
            size="sm"
            variant={range === r ? 'primary' : 'ghost'}
            onClick={() => setRange(r)}
          >
            {r === 'all' ? 'All' : `${r}d`}
          </Button>
        ))}
      </div>

      <Card className="glow-witchcraft p-4 relative overflow-visible">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full"
          style={{ height: svgHeight }}
          onMouseLeave={() => setTooltip(null)}
        >
          <polyline
            points={polylinePoints}
            fill="none"
            strokeWidth="2"
            strokeLinejoin="round"
            style={{ stroke: 'var(--color-witchcraft)' }}
          />
          {points.map((p, i) => (
            <circle
              key={p.date}
              cx={xOf(i)}
              cy={yOf(p.streak)}
              r={4}
              style={{ fill: 'var(--color-ectoplasm)' }}
              onMouseEnter={() =>
                setTooltip({ x: xOf(i), y: yOf(p.streak), point: p })
              }
            />
          ))}
          {tooltip && (
            <foreignObject
              x={Math.min(tooltip.x + 8, svgWidth - 120)}
              y={Math.max(tooltip.y - 48, 0)}
              width="120"
              height="48"
            >
              <div className="bg-overlay border-2 border-witchcraft p-1">
                <Typography.Body size="xs">{tooltip.point.date}</Typography.Body>
                <Typography.Body size="xs" className="text-witchcraft">
                  Streak: {tooltip.point.streak}
                </Typography.Body>
              </div>
            </foreignObject>
          )}
        </svg>
      </Card>
    </div>
  );
};
