import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InteractionStatus } from "@azure/msal-browser";
import { useAuth } from "@finnminn/auth";
import { CommandBar, Atmosphere, Typography } from "@finnminn/ui";
import { TokenSyphon } from "../components/Console/TokenSyphon";

export const Console = () => {
  const { user, logout, login, isAuthenticated, inProgress, getToken } = useAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  const fetchToken = async () => {
    if (isAuthenticated) {
      try {
        const accessToken = await getToken();
        setToken(accessToken);
      } catch (error) {
        console.error("Failed to fetch token", error);
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated && inProgress === InteractionStatus.None) {
      navigate("/");
    }
  }, [isAuthenticated, inProgress, navigate]);

  useEffect(() => {
    fetchToken();
  }, [isAuthenticated, getToken]);

  if (!isAuthenticated) return null;

  const navigation = {
    user: user ? { name: user.name || user.username, email: user.username } : null,
    links: [
        { label: "Home", href: "/" },
        { label: "Apps", href: "/apps" },
        { label: "Console", href: "/console", active: true },
    ],
    onLinkClick: (href: string) => navigate(href),
    onLogin: login,
    onLogout: logout,
  };

  return (
    <div className="min-h-screen w-full bg-void flex flex-col relative overflow-hidden">
        {/* Background Atmosphere */}
        <Atmosphere />
        <div className="fixed inset-0 pointer-events-none">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(125,95,255,0.05),_transparent_80%)]" />
        </div>

      {/* Navigation Layer */}
      <div className="z-50 relative">
        <CommandBar {...navigation} />
      </div>

      {/* Main Content Area */}
      <main className="flex-grow z-10 px-4 py-8 md:py-16 overflow-y-auto">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            
            {/* Header Section */}
            <div className="text-center space-y-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
                <Typography.H1 className="text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-white to-text-muted drop-shadow-[0_0_10px_rgba(125,95,255,0.5)] mb-0">
                    CRYPTID_CONSOLE
                </Typography.H1>
                <div className="text-ectoplasm font-mono text-xs md:text-sm">
                    ROOT_ACCESS_GRANTED
                </div>
            </div>

            {/* Tools Grid */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <TokenSyphon token={token} onRefresh={fetchToken} />
            </div>

            {/* Footer / Copyright */}
            <div className="mt-16 text-center opacity-40 hover:opacity-100 transition-opacity">
                 <Typography.Code className="text-xs text-text-muted">
                    SYSTEM INTEGRITY: STABLE
                 </Typography.Code>
            </div>
        </div>
      </main>
    </div>
  );
};
