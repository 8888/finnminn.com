import { AppLauncher, AppTile, AsciiMarquee } from "@finnminn/ui";
import { useAuth } from "@finnminn/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { InteractionStatus } from "@azure/msal-browser";

export const Apps = () => {
  const { user, logout, login, isAuthenticated, inProgress } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && inProgress === InteractionStatus.None) {
      navigate("/");
    }
  }, [isAuthenticated, inProgress, navigate]);

  if (!isAuthenticated) return null;

  const navigation = {
    user: user ? { name: user.name || "Operator", email: user.username } : null,
    links: [
        { label: "Home", href: "/" },
        { label: "Apps", href: "/apps", active: true },
        { label: "Console", href: "/console" },
    ],
    onLinkClick: (href: string) => navigate(href),
    onLogin: login,
    onLogout: logout,
  };

  return (
    <AppLauncher 
        title="LAUNCH_PAD" 
        subtitle={<AsciiMarquee />}
        navigation={navigation}
    >
      <AppTile
        title="Pip"
        description="Habit formation and consistency protocols."
        href="https://pip.finnminn.com"
        status="beta"
        variant="featured"
        icon={<span className="text-3xl">🦇</span>}
      />
      <AppTile
        title="N-Dimension"
        description="Spatial visualization and cryptid mapping."
        href="https://n-dim.finnminn.com"
        status="online"
        icon={
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-inherit">
                <path d="M21 16.5V7.5L12 3L3 7.5V16.5L12 21L21 16.5Z" />
                <path d="M12 3V12" />
                <path d="M3 7.5L12 12" />
                <path d="M21 7.5L12 12" />
                <path d="M12 12V21" />
             </svg>
        }
      />
    </AppLauncher>
  );
};
