import React from 'react';
import { Ritual } from '../../hooks/useRitualManager';
import { HabitLog } from '../../hooks/useHabitLogManager';
import { getLocalDateString } from '../../utils/date';
import { RitualItem } from './RitualItem';
import { Typography, Card, Button } from "@finnminn/ui";

interface RitualListProps {
  rituals: Ritual[];
  logs: HabitLog[];
  date: string;
  onToggle: (ritualId: string) => void;
  onEdit: (ritual: Ritual) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onPrevDate: () => void;
  onNextDate: () => void;
}

export const RitualList: React.FC<RitualListProps> = ({
  rituals,
  logs,
  date,
  onToggle,
  onEdit,
  onDelete,
  onAdd,
  onPrevDate,
  onNextDate
}) => {
  const dateFormatted = new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const isToday = date === getLocalDateString();

  return (
    <Card className="w-full flex flex-col gap-4 min-h-[400px]" variant="magic">
      <div className="flex justify-between items-center border-b border-overlay pb-4">
        <Typography.H2 className="text-lg">TODAY'S RITUALS</Typography.H2>
        <div className="flex items-center gap-4">
          <button
            onClick={onPrevDate}
            className="w-8 h-8 border border-overlay hover:border-witchcraft hover:text-witchcraft flex items-center justify-center transition-all hover:scale-110 active:scale-90"
          >
            <Typography.Body size="xs" className="mb-0">&lt;</Typography.Body>
          </button>
          <Typography.Body size="sm" className="font-mono min-w-[120px] text-center uppercase text-ectoplasm">
            {isToday ? 'TODAY' : dateFormatted}
          </Typography.Body>
          <button
            onClick={onNextDate}
            className="w-8 h-8 border border-overlay hover:border-witchcraft hover:text-witchcraft flex items-center justify-center transition-all hover:scale-110 active:scale-90"
          >
            <Typography.Body size="xs" className="mb-0">&gt;</Typography.Body>
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col gap-1 mt-4 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-overlay scrollbar-track-transparent">
        {rituals.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center py-12 opacity-30 italic">
            <Typography.Body>No rituals inscribed yet...</Typography.Body>
          </div>
        ) : (
          rituals.map(ritual => {
            const log = logs.find(l => l.ritualId === ritual.id && l.date === date);
            return (
              <RitualItem
                key={ritual.id}
                id={ritual.id!}
                name={ritual.name}
                nature={ritual.nature}
                isCompleted={!!log?.completed}
                onToggle={() => onToggle(ritual.id!)}
                onEdit={() => onEdit(ritual)}
                onDelete={() => onDelete(ritual.id!)}
              />
            );
          })
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-overlay">
        <Button
          variant="secondary"
          className="w-full uppercase font-header text-xs tracking-widest hover:scale-[1.02] transition-transform"
          onClick={onAdd}
        >
          [ + INSCRIBE NEW RITUAL ]
        </Button>
      </div>
    </Card>
  );
};
