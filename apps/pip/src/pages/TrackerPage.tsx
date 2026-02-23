import { useState, useMemo } from 'react';
import { Typography, Atmosphere, Button } from "@finnminn/ui";
import { useAuth } from "@finnminn/auth";
import { Mascot } from "../components/Mascot";
import { useRitualManager, Ritual } from "../hooks/useRitualManager";
import { useHabitLogManager } from "../hooks/useHabitLogManager";
import { useVitality } from "../hooks/useVitality";
import { VitalityBar } from "../components/habits/VitalityBar";
import { RitualList } from "../components/habits/RitualList";
import { RitualModal } from "../components/habits/RitualModal";
import { OracleTrends } from "../components/habits/OracleTrends";

export function TrackerPage() {
  const { isAuthenticated, login } = useAuth();
  
  // Date state for tracking
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Rituals and logs management
  const { rituals, saveRitual, deleteRitual } = useRitualManager();
  
  // Fetch logs for the last 90 days to support all trend views
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 90);
    return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
    };
  }, []);

  const { logs, toggleLog } = useHabitLogManager(dateRange.start, dateRange.end);
  const { vitality, streak } = useVitality(rituals, logs);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRitual, setEditingRitual] = useState<Ritual | undefined>();

  // Analytics state
  const [trendRange, setTrendRange] = useState<7 | 30 | 90>(7);

  const handlePrevDate = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDate = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    const today = new Date().toISOString().split('T')[0];
    if (d.toISOString().split('T')[0] <= today) {
        setSelectedDate(d.toISOString().split('T')[0]);
    }
  };

  const mascotDialog = useMemo(() => {
    if (vitality > 80) return "Your spirit burns bright. The vessel is stable.";
    if (vitality > 50) return "Your essence is flickering, but holding strong.";
    if (vitality > 20) return "The void is encroaching. You must fuel your spirit.";
    return "Your spirit is fading... Return to the light rituals.";
  }, [vitality]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-magic-void p-4">
        <Mascot />
        <Typography.H1 className="mt-8">Pip</Typography.H1>
        <div className="mt-8 w-full max-w-md text-center p-8 border-2 border-overlay bg-surface shadow-pixel">
          <Typography.Body className="mb-6">Initialize Connection to Track Rituals</Typography.Body>
          <Button onClick={() => login()} variant="primary" className="w-full">
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 flex flex-col gap-12 animate-fade-in relative z-10">
      <Atmosphere />
      
      {/* Header & Vitality Section */}
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex flex-col items-center gap-4 min-w-[200px]">
           <Mascot />
           <div className="bg-surface/30 border border-overlay p-4 text-center max-w-[200px] relative">
              <Typography.Body size="xs" className="italic text-witchcraft italic-glow">
                "{mascotDialog}"
              </Typography.Body>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface border-t border-l border-overlay rotate-45" />
           </div>
        </div>
        
        <div className="flex-grow flex flex-col gap-6 w-full">
           <Typography.H1 variant="vampire" className="text-4xl tracking-widest text-witchcraft mb-2">
             VESSEL STATUS
           </Typography.H1>
           <VitalityBar vitality={vitality} streak={streak} />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         {/* Ritual List (8 cols) */}
         <div className="lg:col-span-7 flex flex-col gap-8">
            <RitualList 
              rituals={rituals}
              logs={logs}
              date={selectedDate}
              onToggle={(id) => toggleLog(id, selectedDate)}
              onAdd={() => {
                setEditingRitual(undefined);
                setIsModalOpen(true);
              }}
              onEdit={(ritual) => {
                setEditingRitual(ritual);
                setIsModalOpen(true);
              }}
              onDelete={deleteRitual}
              onPrevDate={handlePrevDate}
              onNextDate={handleNextDate}
            />
         </div>

         {/* Analytics Section (5 cols) */}
         <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex gap-2">
               <button 
                 onClick={() => setTrendRange(7)}
                 className={`px-3 py-1 text-[10px] font-header border-2 transition-all ${trendRange === 7 ? 'border-witchcraft text-witchcraft shadow-pixel-witchcraft scale-105' : 'border-overlay opacity-50'}`}
               >
                 7 DAYS
               </button>
               <button 
                 onClick={() => setTrendRange(30)}
                 className={`px-3 py-1 text-[10px] font-header border-2 transition-all ${trendRange === 30 ? 'border-witchcraft text-witchcraft shadow-pixel-witchcraft scale-105' : 'border-overlay opacity-50'}`}
               >
                 30 DAYS
               </button>
               <button 
                 onClick={() => setTrendRange(90)}
                 className={`px-3 py-1 text-[10px] font-header border-2 transition-all ${trendRange === 90 ? 'border-witchcraft text-witchcraft shadow-pixel-witchcraft scale-105' : 'border-overlay opacity-50'}`}
               >
                 90 DAYS
               </button>
            </div>
            
            <OracleTrends 
               rituals={rituals}
               logs={logs}
               range={trendRange}
            />
         </div>
      </div>

      {/* Ritual Modal */}
      <RitualModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ritual={editingRitual}
        onSave={async (name, nature, id) => {
           await saveRitual(name, nature, id);
           setIsModalOpen(false);
        }}
      />
    </div>
  );
}
