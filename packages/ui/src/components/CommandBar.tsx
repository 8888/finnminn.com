import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Typography } from "./Typography";

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface UserProfile {
  name: string;
  avatarUrl?: string;
  email?: string;
}

export interface CommandBarProps {
  /** The brand logo or name to display on the left. */
  logo?: React.ReactNode;
  /** Primary navigation links. */
  links?: NavLink[];
  /** The current logged-in user. If null, shows "Login" button. */
  user?: UserProfile | null;
  /** Callback for when a link is clicked. */
  onLinkClick?: (href: string) => void;
  /** Callback for login action. */
  onLogin?: () => void;
  /** Callback for logout action. */
  onLogout?: () => void;
  /** Callback for accessing user profile settings. */
  onProfileClick?: () => void;
  className?: string;
}

export const CommandBar = ({
  logo = "FINNMINN",
  links = [],
  user,
  onLinkClick,
  onLogin,
  onLogout,
  onProfileClick,
  className = "",
}: CommandBarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLink = (href: string) => {
    if (onLinkClick) onLinkClick(href);
    setIsMobileOpen(false);
  };

  return (
    <nav
      className={`
        w-full bg-surface border-b-2 border-overlay z-40 relative
        ${className}
      `}
      role="navigation"
      aria-label="Command Deck"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex-shrink-0 flex items-center gap-4">
          <button className="font-header text-2xl text-witchcraft tracking-widest hover:text-ectoplasm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-witchcraft" onClick={() => handleLink("/")}>
            {logo}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => handleLink(link.href)}
              className={`
                font-header text-lg tracking-wide transition-all
                hover:text-ectoplasm hover:-translate-y-0.5
                ${link.active ? "text-ectoplasm underline decoration-2 decoration-wavy underline-offset-4" : "text-text-body"}
              `}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* User / Actions Section */}
        <div className="hidden md:flex items-center gap-4 relative" ref={profileRef}>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 group focus:outline-none"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <div className="text-right hidden lg:block">
                    <Typography.H3 className="text-sm text-text-body group-hover:text-ectoplasm mb-0">{user.name}</Typography.H3>
                </div>
                <div className={`
                    border-2 border-text-muted p-0.5 transition-all
                    group-hover:border-ectoplasm group-hover:shadow-[2px_2px_0px_0px_#05FFA1]
                    ${isProfileOpen ? "border-ectoplasm shadow-[2px_2px_0px_0px_#05FFA1]" : ""}
                `}>
                    {user.avatarUrl ? (
                         <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 object-cover grayscale group-hover:grayscale-0 transition-all"/>
                    ) : (
                        <div className="w-8 h-8 bg-void flex items-center justify-center text-xs font-header text-ectoplasm">
                            {user.name.charAt(0)}
                        </div>
                    )}
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-4 w-64 z-50">
                   <Card variant="magic" className="p-0">
                      <div className="p-4 border-b-2 border-overlay bg-surface/95">
                          <Typography.H3 className="text-lg text-ectoplasm mb-1">{user.name}</Typography.H3>
                          <Typography.Body className="text-xs text-text-muted font-mono mb-0">{user.email}</Typography.Body>
                      </div>
                      <div className="p-2 bg-void/90 flex flex-col gap-1">
                          <button 
                            onClick={() => { onProfileClick?.(); setIsProfileOpen(false); }}
                            className="w-full text-left px-4 py-2 font-header hover:bg-witchcraft hover:text-void text-text-body transition-colors"
                          >
                            [ PROFILE_DATA ]
                          </button>
                          <button 
                            onClick={() => { onLogout?.(); setIsProfileOpen(false); }}
                            className="w-full text-left px-4 py-2 font-header hover:bg-vampire hover:text-void text-text-body transition-colors"
                          >
                            [ TERMINATE_SESSION ]
                          </button>
                      </div>
                   </Card>
                </div>
              )}
            </div>
          ) : (
            <Button variant="ghost" onClick={onLogin} className="text-sm">
              [ INITIALIZE ]
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
            <button 
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="text-text-body hover:text-ectoplasm p-2 border-2 border-transparent hover:border-overlay active:bg-overlay transition-all"
                aria-label="Toggle navigation menu"
            >
                {isMobileOpen ? (
                    <span className="font-header text-xl">[ X ]</span>
                ) : (
                    <span className="font-header text-xl">[ = ]</span>
                )}
            </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-void border-b-2 border-ectoplasm shadow-xl z-30 animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col p-4 gap-4">
                {user && (
                    <div className="flex items-center gap-4 p-4 border-2 border-dashed border-text-muted/30 mb-2">
                        {user.avatarUrl && <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 grayscale border border-text-muted"/>}
                        <div>
                             <Typography.H3 className="text-ectoplasm mb-0">{user.name}</Typography.H3>
                             <Typography.Body className="text-xs text-text-muted mb-0">Currently Active</Typography.Body>
                        </div>
                    </div>
                )}
                
                <div className="flex flex-col gap-2">
                    {links.map((link) => (
                        <button
                            key={link.href}
                            onClick={() => handleLink(link.href)}
                            className={`
                                text-left px-4 py-3 font-header text-lg border-l-4 transition-all
                                ${link.active 
                                    ? "bg-surface border-ectoplasm text-ectoplasm" 
                                    : "border-transparent text-text-body hover:bg-surface hover:border-witchcraft hover:text-witchcraft"
                                }
                            `}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                <div className="h-px bg-overlay w-full my-2"/>

                {user ? (
                     <div className="flex flex-col gap-2">
                        <Button variant="ghost" onClick={onProfileClick} className="w-full justify-start">
                            PROFILE SETTINGS
                        </Button>
                        <Button variant="destructive" onClick={onLogout} className="w-full justify-start">
                            LOGOUT
                        </Button>
                     </div>
                ) : (
                    <Button variant="primary" onClick={onLogin} className="w-full">
                        LOGIN
                    </Button>
                )}
            </div>
        </div>
      )}
    </nav>
  );
};