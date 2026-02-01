import React from 'react';
import { Typography } from '@finnminn/ui';

interface CohortSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
}

export const CohortSection: React.FC<CohortSectionProps> = ({ title, count, children }) => {
  if (count === 0) return null;

  return (
    <div className="space-y-4 mb-12">
      <div className="flex items-center gap-4 border-b border-toxic/10 pb-2">
        <Typography.H3 className="text-toxic font-mono tracking-tighter">
          {title.toUpperCase()}
        </Typography.H3>
        <span className="text-[10px] bg-toxic/10 text-toxic px-2 py-0.5 rounded-sm border border-toxic/20">
          {count} specimens
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
};
