import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CommandBar } from '@finnminn/ui';
import { useAuth } from '@finnminn/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userProfile = isAuthenticated && user ? {
    name: user.name || user.username || 'User',
    email: user.username
  } : null;

  const links = [
    { label: 'Capture', href: '/', active: location.pathname === '/' },
    { label: 'Vault', href: '/inbox', active: location.pathname === '/inbox' },
    { label: 'Tracker', href: '/tracker', active: location.pathname === '/tracker' },
    { label: 'Character', href: '/character', active: location.pathname === '/character' },
  ];

  return (
    <div className="min-h-screen bg-magic-void font-body relative overflow-hidden flex flex-col">
      <CommandBar
        logo="Pip.exe"
        user={userProfile}
        onLogout={logout}
        onLogin={login}
        links={links}
        onLinkClick={(href) => href.startsWith('http') ? window.location.href = href : navigate(href)}
      />

      {/* Main Content */}
      <main className="flex-grow z-10 w-full relative">
        {children}
      </main>
    </div>
  );
};
