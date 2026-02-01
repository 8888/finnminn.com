import React, { useMemo } from 'react';
import { Typography } from '@finnminn/ui';
import { Plant } from '../types/plant';
import { calculateHarmonyIndex, getOracleText } from '../utils/plantLogic';

interface VesselHeaderProps {
  plants: Plant[];
}

export const VesselHeader: React.FC<VesselHeaderProps> = ({ plants }) => {
  const harmonyIndex = useMemo(() => calculateHarmonyIndex(plants), [plants]);
  const oracleText = useMemo(() => getOracleText(harmonyIndex), [harmonyIndex]);

  return (
    <div className="border-b border-toxic/20 pb-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-baseline gap-2 mb-4">
        <Typography.H1 className="text-toxic glow-ectoplasm leading-none">
          THE VESSEL
        </Typography.H1>
        <div className="flex gap-6 items-baseline font-mono">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-toxic/40 uppercase">Bound Specimens</span>
            <span className="text-xl text-toxic">{plants.length}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-toxic/40 uppercase">Harmony Index</span>
            <span className={`text-xl ${harmonyIndex >= 50 ? 'text-ectoplasm' : 'text-radical'}`}>
              {harmonyIndex}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-void border border-toxic/10 p-3 relative overflow-hidden group">
        <div className="absolute inset-0 bg-toxic/5 animate-pulse opacity-50" />
        <Typography.Body className="text-toxic/80 text-xs tracking-widest relative z-10 flex items-center gap-2">
          <span className="text-toxic animate-pulse">●</span>
          ORACLE: <span className="italic">{oracleText}</span>
        </Typography.Body>
      </div>
    </div>
  );
};
