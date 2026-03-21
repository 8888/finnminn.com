import React, { useMemo, useState } from 'react';
import { Typography, Button, Card } from '@finnminn/ui';
import { HabitLog } from '../../hooks/useHabitLogManager';

interface TrendDataPoint {
  date: string;
  count: number;
}

interface RitualTrendGraphProps {
  logs: HabitLog[];
}

type Range = 7 | 30 | 'all';

function buildDateRange(range: Range): string[] {
  if (range === 'all') return [];
  const dates: string[] = [];
  for (let i = range - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export const RitualTrendGraph: React.FC<RitualTrendGraphProps> = ({ logs }) => {
  const [range, setRange] = useState<Range>(30);

  const data: TrendDataPoint[] = useMemo(() => {
    const completed = logs.filter(l => l.completed);

    if (range === 'all') {
      const countsByDate = new Map<string, number>();
      for (const log of completed) {
        countsByDate.set(log.date, (countsByDate.get(log.date) ?? 0) + 1);
      }
      return [...countsByDate.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count }));
    }

    const dates = buildDateRange(range);
    return dates.map(date => ({
      date,
      count: completed.filter(l => l.date === date).length,
    }));
  }, [logs, range]);

  const maxCount = Math.max(1, ...data.map(d => d.count));

  const hasData = data.some(d => d.count > 0);
  const singleEntry = data.filter(d => d.count > 0).length === 1;

  if (!hasData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Typography.Body variant="muted">No check-ins in this range to display.</Typography.Body>
      </div>
    );
  }

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

      <div className="h-48 w-full border-2 border-overlay bg-void p-4 flex items-end gap-[2px] overflow-x-auto">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex-grow flex flex-col items-center justify-end h-full group relative min-w-[4px]"
          >
            <div
              className="absolute bottom-full mb-2 bg-overlay border-2 border-overlay p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap"
            >
              <Typography.Body size="xs">{d.date}</Typography.Body>
              <Typography.Body size="xs" className="text-ectoplasm">{d.count} check-in{d.count !== 1 ? 's' : ''}</Typography.Body>
            </div>
            <div
              className={`w-full transition-all duration-300 ${d.count > 0 ? 'bg-ectoplasm shadow-pixel-ectoplasm' : 'bg-overlay'}`}
              style={{ height: d.count === 0 ? '2px' : `${(d.count / maxCount) * 100}%` }}
            />
          </div>
        ))}
      </div>

      {singleEntry && (
        <Typography.Body variant="muted" size="sm">
          Track more days to see a trend.
        </Typography.Body>
      )}
    </div>
  );
};
