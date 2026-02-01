import React, { useMemo } from 'react';
import { Plant, HealthStatus } from '../types/plant';
import { getPlantHealth } from '../utils/plantLogic';

interface VitalityMeterProps {
  plants: Plant[];
  activeFilter: HealthStatus | null;
  onFilterChange: (status: HealthStatus | null) => void;
}

export const VitalityMeter: React.FC<VitalityMeterProps> = ({ 
  plants, 
  activeFilter, 
  onFilterChange 
}) => {
  const stats = useMemo(() => {
    const total = plants.length;
    if (total === 0) return { thriving: 0, stable: 0, 'in-peril': 0 };

    return plants.reduce((acc, plant) => {
      const health = getPlantHealth(plant);
      acc[health]++;
      return acc;
    }, { thriving: 0, stable: 0, 'in-peril': 0 });
  }, [plants]);

  const total = plants.length;
  const getWidth = (count: number) => total === 0 ? 0 : (count / total) * 100;

  const segments: { status: HealthStatus; label: string; color: string; count: number }[] = [
    { status: 'thriving', label: 'THRIVING', color: 'bg-ectoplasm', count: stats.thriving },
    { status: 'stable', label: 'STABLE', color: 'bg-witchcraft', count: stats.stable },
    { status: 'in-peril', label: 'IN PERIL', color: 'bg-radical', count: stats['in-peril'] },
  ];

  return (
    <div className="space-y-2 mb-8">
      <div className="flex justify-between items-end text-[10px] font-mono text-toxic/40 mb-1">
        <span>VITALITY DISTRIBUTION</span>
        {activeFilter && (
          <button 
            onClick={() => onFilterChange(null)}
            className="text-radical hover:underline cursor-pointer"
          >
            [ DISMISS FILTER ]
          </button>
        )}
      </div>
      
      <div className="h-6 flex border border-toxic/20 bg-void p-0.5 overflow-hidden">
        {total === 0 ? (
          <div className="w-full h-full bg-toxic/5 animate-pulse" />
        ) : (
          segments.map((segment) => (
            <div
              key={segment.status}
              onClick={() => onFilterChange(activeFilter === segment.status ? null : segment.status)}
              className={`
                h-full transition-all duration-500 cursor-pointer relative group
                ${segment.color}
                ${activeFilter && activeFilter !== segment.status ? 'opacity-20 grayscale' : 'opacity-100'}
                ${activeFilter === segment.status ? 'ring-1 ring-inset ring-white/50 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : ''}
              `}
              style={{ width: `${getWidth(segment.count)}%` }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity" />
              {segment.count > 0 && getWidth(segment.count) > 10 && (
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-void pointer-events-none truncate px-1">
                  {segment.count} {segment.label}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
