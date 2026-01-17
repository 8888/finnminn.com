import { AppLauncher, AppTile } from "@finnminn/ui";
import { useAuth } from "@finnminn/auth";
import { useNavigate } from "react-router-dom";

export const Apps = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();

  const navigation = {
    user: user ? { name: user.name || "Operator", email: user.username } : null,
    links: [
        { label: "Home", href: "/" },
        { label: "Apps", href: "/apps", active: true },
    ],
    onLinkClick: (href: string) => navigate(href),
    onLogin: login,
    onLogout: logout,
  };

  const subtitle = (
    <pre className="text-xs leading-none text-ectoplasm font-mono whitespace-pre text-left inline-block">
{`      /\\"""/\\
     (= ^.^ =)
     / >   < \\
    (___)_(___)`}
    </pre>
  );

  return (
    <AppLauncher 
        title="LAUNCH_PAD" 
        subtitle={subtitle}
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
