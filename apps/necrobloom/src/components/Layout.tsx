import React from 'react';
import { Atmosphere, Typography } from '@finnminn/ui';
import { useAuth } from '@finnminn/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-void text-toxic font-mono relative overflow-hidden">
      <Atmosphere />
      
      {/* Header */}
      <header className="relative z-10 border-b border-toxic/20 p-4 flex justify-between items-center bg-void/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Typography.H2 className="text-toxic tracking-tighter">
            NECROBLOOM
          </Typography.H2>
          <div className="h-4 w-[1px] bg-toxic/20 hidden md:block" />
          <Typography.Body className="text-toxic/40 text-xs hidden md:block">
            VITALITY MONITORING SYSTEM
          </Typography.Body>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <Typography.Body className="text-witchcraft text-xs">
              AGENT: {user?.username?.split('@')[0].toUpperCase() || 'UNKNOWN'}
            </Typography.Body>
            <button 
              onClick={logout}
              className="text-toxic/40 hover:text-radical text-xs uppercase tracking-widest transition-colors"
            >
              [ Terminate Session ]
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Footer / CRT Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
};
