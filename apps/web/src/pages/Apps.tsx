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
        title="Pip Tracker"
        description="Habit formation and consistency protocols."
        href="https://pip.finnminn.com"
        status="beta"
        variant="featured"
        icon={
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-inherit">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
            </svg>
        }
      />
      <AppTile
        title="N-Dimension"
        description="Spatial visualization and cryptid mapping."
        href="https://n-dim.finnminn.com"
        status="online"
        icon={
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-inherit">
                <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
             </svg>
        }
      />
    </AppLauncher>
  );
};
