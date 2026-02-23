import React, { useMemo } from 'react';
import { Ritual } from '../../hooks/useRitualManager';
import { HabitLog } from '../../hooks/useHabitLogManager';
import { Typography, Card } from "@finnminn/ui";

interface OracleTrendsProps {
  rituals: Ritual[];
  logs: HabitLog[];
  range: 7 | 30 | 90;
}

export const OracleTrends: React.FC<OracleTrendsProps> = ({ rituals, logs, range }) => {
  const [selectedRitual1, setSelectedRitual1] = React.useState<string>(rituals[0]?.id || '');
  const [selectedRitual2, setSelectedRitual2] = React.useState<string>(rituals[1]?.id || '');

  const data = useMemo(() => {
    const dates = [];
    for (let i = range - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        dates.push(d.toISOString().split('T')[0]);
    }

    return dates.map(date => {
        const log1 = logs.find(l => l.ritualId === selectedRitual1 && l.date === date);
        const log2 = logs.find(l => l.ritualId === selectedRitual2 && l.date === date);
        return {
            date,
            val1: log1?.completed ? 1 : 0,
            val2: log2?.completed ? 1 : 0
        };
    });
  }, [logs, range, selectedRitual1, selectedRitual2]);

  const insight = useMemo(() => {
    if (!selectedRitual1 || !selectedRitual2) return "Awaiting deeper insight...";
    
    const r1 = rituals.find(r => r.id === selectedRitual1);
    const r2 = rituals.find(r => r.id === selectedRitual2);
    
    // Simple insight logic
    const bothCount = data.filter(d => d.val1 && d.val2).length;
    const neitherCount = data.filter(d => !d.val1 && !d.val2).length;
    const r1OnlyCount = data.filter(d => d.val1 && !d.val2).length;
    
    if (bothCount > (range / 2)) {
      return `[${r1?.name}] and [${r2?.name}] are often practiced together. A strong synergy exists in your ritual path.`;
    }
    
    if (r1OnlyCount > (range / 2)) {
       return `When [${r1?.name}] is practiced, [${r2?.name}] is often neglected. A clash of energies?`;
    }

    if (neitherCount > (range / 2)) {
        return `Both rituals [${r1?.name}] and [${r2?.name}] are rarely observed. The void beckons...`;
    }

    return `The oracle observes sporadic flickers between [${r1?.name}] and [${r2?.name}]. No clear pattern emerged yet.`;
  }, [data, range, rituals, selectedRitual1, selectedRitual2]);

  return (
    <Card variant="magic" className="w-full flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center border-b border-overlay pb-4">
        <Typography.H2 className="text-xl font-header tracking-widest text-witchcraft">ORACLE OF TRENDS</Typography.H2>
        <Typography.Body variant="muted" size="xs" className="uppercase opacity-40">[ Terminal Interface v2.5 ]</Typography.Body>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="flex flex-col gap-2">
            <Typography.Body variant="muted" size="xs" className="uppercase tracking-widest">Compare Ritual 1</Typography.Body>
            <select 
              value={selectedRitual1} 
              onChange={(e) => setSelectedRitual1(e.target.value)}
              className="bg-surface border border-overlay text-ectoplasm font-mono p-2 outline-none focus:border-witchcraft"
            >
              <option value="">Select Ritual...</option>
              {rituals.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
         </div>
         <div className="flex flex-col gap-2">
            <Typography.Body variant="muted" size="xs" className="uppercase tracking-widest">Compare Ritual 2</Typography.Body>
            <select 
              value={selectedRitual2} 
              onChange={(e) => setSelectedRitual2(e.target.value)}
              className="bg-surface border border-overlay text-vampire font-mono p-2 outline-none focus:border-witchcraft"
            >
               <option value="">Select Ritual...</option>
               {rituals.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
         </div>
      </div>

      <div className="h-48 w-full border border-overlay bg-magic-void p-4 flex items-end gap-1 overflow-x-auto scrollbar-hide">
         {data.map((d, i) => (
           <div key={i} className="flex-grow flex flex-col items-center justify-end h-full gap-1 group relative">
             {/* Tooltip on hover */}
             <div className="absolute bottom-full mb-2 bg-overlay p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap">
                <Typography.Body size="xs" className="text-[12px]">{d.date}</Typography.Body>
             </div>
             
             <div className={`w-full max-w-[12px] transition-all duration-500 ${d.val1 ? 'h-1/2 bg-ectoplasm shadow-pixel-ectoplasm' : 'h-[2px] bg-overlay'}`} />
             <div className={`w-full max-w-[12px] transition-all duration-500 ${d.val2 ? 'h-1/2 bg-vampire shadow-pixel-vampire' : 'h-[2px] bg-overlay'}`} />
           </div>
         ))}
      </div>

      <div className="bg-surface/50 p-6 border-l-4 border-witchcraft flex gap-4">
         <Typography.Body className="text-2xl animate-pulse">👁️</Typography.Body>
         <div className="flex flex-col gap-1">
            <Typography.Body variant="muted" size="xs" className="uppercase tracking-widest text-witchcraft opacity-60">ORACLE INSIGHT</Typography.Body>
            <Typography.Body size="sm" className="italic italic-glow">{insight}</Typography.Body>
         </div>
      </div>
    </Card>
  );
};
