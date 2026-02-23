import React from 'react';
import { Typography } from "@finnminn/ui";

interface VitalityBarProps {
  vitality: number;
  streak: number;
}

export const VitalityBar: React.FC<VitalityBarProps> = ({ vitality, streak }) => {
  const barWidth = `${vitality}%`;
  
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <Typography.Body variant="muted" size="xs" className="uppercase tracking-widest">
          VITALITY: {vitality} / 100
        </Typography.Body>
        <Typography.Body variant="primary" size="xs" className="uppercase tracking-widest font-bold">
          CURRENT STREAK: {streak} DAYS
        </Typography.Body>
      </div>
      
      <div className="h-4 w-full bg-surface border border-overlay relative overflow-hidden">
        <div 
          className="h-full bg-witchcraft transition-all duration-1000 ease-out"
          style={{ width: barWidth }}
        />
        {/* Animated pattern overlay */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_50%,#000_50%,#000_75%,transparent_75%,transparent)] bg-[length:10px_10px]" />
      </div>
    </div>
  );
};
