import React, { useMemo, useState } from 'react';
import { LineChart, Card } from '@finnminn/ui';
import type { ChartDataSeries, TimeRange } from '@finnminn/ui';
import { HabitLog } from '../../hooks/useHabitLogManager';
import { calculateStreakHistory } from '../../utils/streakCalculator';

interface RitualStreakGraphProps {
  logs: HabitLog[];
  ritualId: string;
}

export const RitualStreakGraph: React.FC<RitualStreakGraphProps> = ({ logs, ritualId }) => {
  const [range, setRange] = useState<TimeRange>('30d');

  const allPoints = useMemo(() => calculateStreakHistory(logs, ritualId), [logs, ritualId]);

  const series: ChartDataSeries = useMemo(() => {
    let filtered = allPoints;
    if (range !== 'all') {
      const days = parseInt(range);
      const cutoff = new Date(Date.now() - (days - 1) * 86400000).toISOString().slice(0, 10);
      filtered = allPoints.filter(p => p.date >= cutoff);
    }

    return {
      name: 'Streak',
      color: 'witchcraft',
      data: filtered.map(p => ({ label: p.date, value: p.streak })),
    };
  }, [allPoints, range]);

  return (
    <Card className="glow-witchcraft p-4">
      <LineChart
        series={series}
        height={160}
        timeRange={range}
        onTimeRangeChange={setRange}
        emptyMessage="No streak data to display for this range."
      />
    </Card>
  );
};
