import React, { useMemo, useState } from 'react';
import { BarChart, Typography } from '@finnminn/ui';
import type { ChartDataSeries, TimeRange } from '@finnminn/ui';
import { HabitLog } from '../../hooks/useHabitLogManager';

interface RitualTrendGraphProps {
  logs: HabitLog[];
}

function buildDateRange(days: number): string[] {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

const RANGE_DAYS: Record<TimeRange, number | null> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  'all': null,
};

export const RitualTrendGraph: React.FC<RitualTrendGraphProps> = ({ logs }) => {
  const [range, setRange] = useState<TimeRange>('30d');

  const series: ChartDataSeries[] = useMemo(() => {
    const completed = logs.filter(l => l.completed);
    const days = RANGE_DAYS[range];

    if (days === null) {
      // All time
      const countsByDate = new Map<string, number>();
      for (const log of completed) {
        countsByDate.set(log.date, (countsByDate.get(log.date) ?? 0) + 1);
      }
      const data = [...countsByDate.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ label: date, value: count }));
      return [{ name: 'Check-ins', data }];
    }

    const dates = buildDateRange(days);
    const data = dates.map(date => ({
      label: date,
      value: completed.filter(l => l.date === date).length,
    }));
    return [{ name: 'Check-ins', data }];
  }, [logs, range]);

  const hasData = series[0].data.some(d => d.value > 0);
  const singleEntry = series[0].data.filter(d => d.value > 0).length === 1;

  return (
    <div className="flex flex-col gap-4">
      <BarChart
        series={series}
        height={192}
        timeRange={range}
        onTimeRangeChange={setRange}
        emptyMessage="No check-ins in this range to display."
      />

      {hasData && singleEntry && (
        <Typography.Body variant="muted" size="sm">
          Track more days to see a trend.
        </Typography.Body>
      )}
    </div>
  );
};
