import React from 'react';
import { Typography } from '@finnminn/ui';
import { HabitLog } from '../../hooks/useHabitLogManager';

interface RitualActivityLogProps {
  logs: HabitLog[];
}

function formatDate(timestamp: string): string {
  return timestamp.slice(0, 10);
}

function formatTime(timestamp: string): string {
  const d = new Date(timestamp);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export const RitualActivityLog: React.FC<RitualActivityLogProps> = ({ logs }) => {
  const completed = logs
    .filter(l => l.completed)
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  if (completed.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Typography.Body variant="muted">No check-ins recorded yet.</Typography.Body>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[60vh] flex flex-col">
      {completed.map(log => (
        <div
          key={log.id}
          className="flex items-center justify-between px-4 py-3 bg-surface border-b-2 border-overlay hover:shadow-pixel transition-shadow"
        >
          <Typography.Body size="sm" className="font-mono text-witchcraft">
            {formatDate(log.timestamp)}
          </Typography.Body>
          <Typography.Body size="sm" className="font-mono text-ectoplasm">
            {formatTime(log.timestamp)}
          </Typography.Body>
        </div>
      ))}
    </div>
  );
};
