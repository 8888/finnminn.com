import React, { useState, useEffect } from 'react';
import { Ritual } from '../../hooks/useRitualManager';
import { Typography, Card, Button, Input } from "@finnminn/ui";

interface RitualModalProps {
  ritual?: Ritual;
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, nature: 'light' | 'void', id?: string) => void;
}

export const RitualModal: React.FC<RitualModalProps> = ({ 
  ritual, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [name, setName] = useState(ritual?.name || '');
  const [nature, setNature] = useState<'light' | 'void'>(ritual?.nature || 'light');

  useEffect(() => {
    if (ritual) {
      setName(ritual.name);
      setNature(ritual.nature);
    } else {
      setName('');
      setNature('light');
    }
  }, [ritual, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-magic-void/80 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      
      <Card className="z-10 w-full max-w-md animate-slide-up" variant="magic">
        <div className="flex justify-between items-center border-b border-overlay pb-4">
          <Typography.H2 className="text-xl uppercase font-header tracking-widest text-witchcraft">
            {ritual ? 'EDIT RITUAL' : 'INSCRIBE NEW RITUAL'}
          </Typography.H2>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-radical transition-colors text-2xl"
          >
            [X]
          </button>
        </div>

        <div className="py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Typography.Body variant="muted" size="xs" className="uppercase tracking-widest">Ritual Name</Typography.Body>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Read 10 Pages..."
              className="w-full text-lg"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Typography.Body variant="muted" size="xs" className="uppercase tracking-widest">Nature of Ritual</Typography.Body>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setNature('light')}
                className={`p-4 border-2 transition-all flex flex-col items-center gap-2 group
                  ${nature === 'light' 
                    ? 'border-ectoplasm bg-ectoplasm/10 shadow-pixel-ectoplasm scale-105' 
                    : 'border-overlay hover:border-text-muted opacity-50'}`}
              >
                <span className="text-2xl group-hover:animate-bounce">✨</span>
                <Typography.Body className="font-header text-[10px] tracking-tighter uppercase text-ectoplasm">Light (Positive)</Typography.Body>
              </button>
              
              <button
                onClick={() => setNature('void')}
                className={`p-4 border-2 transition-all flex flex-col items-center gap-2 group
                  ${nature === 'void' 
                    ? 'border-radical bg-radical/10 shadow-pixel-radical scale-105' 
                    : 'border-overlay hover:border-text-muted opacity-50'}`}
              >
                <span className="text-2xl group-hover:animate-pulse">💀</span>
                <Typography.Body className="font-header text-[10px] tracking-tighter uppercase text-radical">Void (Negative)</Typography.Body>
              </button>
            </div>
          </div>

          <div className="bg-surface/50 p-4 border border-overlay rounded">
            <Typography.Body variant="muted" size="xs" className="italic opacity-60">
              {nature === 'light' 
                ? "This ritual infuses your vessel with vitality. Each completion fuels your spirit."
                : "This ritual drains your vitality. Avoid its pull to keep your essence bright."}
            </Typography.Body>
          </div>
        </div>

        <div className="flex gap-4 border-t border-overlay pt-6 mt-2">
          <Button 
            variant="secondary" 
            className="flex-grow uppercase font-header tracking-widest text-xs" 
            onClick={onClose}
          >
            CANCEL
          </Button>
          <Button 
            variant="primary" 
            className="flex-grow uppercase font-header tracking-widest text-xs" 
            disabled={!name.trim()}
            onClick={() => onSave(name, nature, ritual?.id)}
          >
            [ {ritual ? 'UPDATE' : 'INSCRIBE'} ]
          </Button>
        </div>
      </Card>
    </div>
  );
};
