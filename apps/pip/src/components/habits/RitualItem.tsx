import React from 'react';
import { Typography, Button } from "@finnminn/ui";

interface RitualItemProps {
  name: string;
  nature: 'light' | 'void';
  isCompleted: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const RitualItem: React.FC<RitualItemProps> = ({ 
  name, 
  nature, 
  isCompleted, 
  onToggle,
  onEdit,
  onDelete 
}) => {
  const isLight = nature === 'light';
  const prefix = isLight ? '[+]' : '[-]';
  const impact = isLight ? '+1' : '-1';
  
  return (
    <div className="flex items-center justify-between p-3 border-b border-overlay last:border-0 group hover:bg-surface/50 transition-colors">
      <div className="flex items-center gap-4 flex-grow cursor-pointer" onClick={onToggle}>
        <Typography.Body className={`font-mono text-sm uppercase ${isLight ? 'text-ectoplasm' : 'text-vampire'}`}>
          {prefix}
        </Typography.Body>
        <Typography.Body 
          className={`flex-grow ${isCompleted ? 'line-through opacity-40' : ''}`}
          size="sm"
        >
          {name}
        </Typography.Body>
        <Typography.Body variant="muted" size="xs" className="opacity-40 group-hover:opacity-100 transition-opacity">
           {impact}
        </Typography.Body>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <div 
          onClick={onToggle}
          className={`w-6 h-6 border-2 flex items-center justify-center cursor-pointer transition-all
            ${isCompleted 
              ? 'bg-witchcraft border-witchcraft shadow-pixel-witchcraft scale-110' 
              : 'border-overlay group-hover:border-text-muted hover:scale-110'}`}
        >
          {isCompleted && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button onClick={onEdit} className="hover:scale-110 transition-transform">
             <Typography.Body size="xs" className="text-witchcraft uppercase font-header hover:underline">Edit</Typography.Body>
           </button>
           <button onClick={onDelete} className="hover:scale-110 transition-transform">
             <Typography.Body size="xs" className="text-vampire uppercase font-header hover:underline">Void</Typography.Body>
           </button>
        </div>
      </div>
    </div>
  );
};
