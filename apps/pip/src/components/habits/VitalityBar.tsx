import React from 'react';
import { ProgressBar, Typography } from "@finnminn/ui";

interface VitalityBarProps {
  vitality: number;
  streak: number;
}

export const VitalityBar: React.FC<VitalityBarProps> = ({ vitality, streak }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <Typography.Body variant="muted" size="xs" className="uppercase tracking-widest">
          VITALITY: {vitality} / 100
        </Typography.Body>
        <Typography.Body variant="witchcraft" size="xs" className="uppercase tracking-widest font-bold">
          CURRENT STREAK: {streak} DAYS
        </Typography.Body>
      </div>

      <ProgressBar value={vitality} color="witchcraft" />
    </div>
  );
};
