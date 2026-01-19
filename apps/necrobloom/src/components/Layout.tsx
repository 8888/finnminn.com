import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Atmosphere, CommandBar } from '@finnminn/ui';
import { useAuth } from '@finnminn/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userProfile = isAuthenticated && user ? {
    name: user.username?.split('@')[0].toUpperCase() || 'AGENT',
    email: user.username
  } : null;

  const links = [
    { label: 'DASHBOARD', href: '/', active: location.pathname === '/' },
  ];

  return (
    <div className="min-h-screen bg-void text-toxic font-mono relative overflow-hidden">
      <Atmosphere />
      
      <CommandBar 
        logo="NECROBLOOM"
        user={userProfile}
        onLogout={logout}
        onLogin={login}
        links={links}
        onLinkClick={(href) => navigate(href)}
      />

      {/* Main Content */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Footer / CRT Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
};
