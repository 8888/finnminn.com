import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InteractionStatus } from "@azure/msal-browser";
import { useAuth } from "@finnminn/auth";
import {
  CommandBar,
  Atmosphere,
  Typography,
  Card,
  Image,
  Terminal
} from "@finnminn/ui";

export const Profile = () => {
  const { user, logout, login, isAuthenticated, inProgress } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && inProgress === InteractionStatus.None) {
      navigate("/");
    }
  }, [isAuthenticated, inProgress, navigate]);

  if (!isAuthenticated || !user) return null;

  const navigation = {
    user: {
      name: user.name || user.username,
      email: user.username,
      avatarUrl: (user as any).avatarUrl // Casting to any to avoid lint error if it's potentially there but not in type
    },
    links: [
      { label: "Home", href: "/" },
      { label: "Apps", href: "/apps" },
      { label: "Console", href: "/console" },
    ],
    onLinkClick: (href: string) => navigate(href),
    onLogin: login,
    onLogout: logout,
    onProfileClick: () => navigate("/profile"),
  };

  return (
    <div className="min-h-screen w-full bg-void flex flex-col relative overflow-hidden">
      <Atmosphere />

      {/* Navigation Layer */}
      <div className="z-50 relative">
        <CommandBar {...navigation} />
      </div>

      {/* Main Content Area */}
      <main className="flex-grow z-10 px-4 py-8 md:py-16 overflow-y-auto">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">

          {/* Header Section */}
          <div className="text-center space-y-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
            <Typography.H1 className="text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-white to-text-muted drop-shadow-[0_0_10px_rgba(125,95,255,0.5)] mb-0">
              IDENTITY_MANIFEST
            </Typography.H1>
            <Typography.Body variant="ectoplasm" size="sm" className="font-mono">
              VERIFIED_SUBJECT: {user.name?.toUpperCase().replace(/\s+/g, '_')}
            </Typography.Body>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">

            {/* Left Column: Avatar & Quick Info */}
            <div className="md:col-span-1 flex flex-col gap-6">
              <Card variant="magic" className="p-4 flex flex-col items-center gap-4">
                <Image
                  src={(user as any).avatarUrl || "/finn.jpg"}
                  alt={user.name}
                  variant="artifact"
                  size="full"
                  className="aspect-square object-cover"
                />
                <div className="text-center">
                  <Typography.H3 className="text-ectoplasm mb-1">{user.name}</Typography.H3>
                  <Typography.Code className="text-[10px] opacity-60">ID: {user.username}</Typography.Code>
                </div>
              </Card>

              <Terminal title="BIOMETRICS" className="w-full">
                <div className="space-y-1">
                  <Typography.Body className="text-xs">&gt; STATUS: {isAuthenticated ? 'ACTIVE' : 'OFFLINE'}</Typography.Body>
                  <Typography.Body className="text-xs">&gt; ROLE: ARCHITECT</Typography.Body>
                  <Typography.Body className="text-xs">&gt; LOCATION: VOID_GATEWAY</Typography.Body>
                </div>
              </Terminal>
            </div>

            {/* Right Column: Detailed Stats/Info */}
            <div className="md:col-span-2 flex flex-col gap-6">
              <Card variant="magic" className="p-6">
                <Typography.H2 className="text-witchcraft mb-6 border-b border-witchcraft/30 pb-2">SUBJECT_DATA</Typography.H2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <Typography.Code className="text-xs text-text-muted block mb-1">DESIGNATION</Typography.Code>
                      <Typography.Body className="text-lg">{user.name}</Typography.Body>
                    </div>
                    <div>
                      <Typography.Code className="text-xs text-text-muted block mb-1">COMMS_CHANNEL</Typography.Code>
                      <Typography.Body className="text-sm font-mono">{user.username}</Typography.Body>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Typography.Code className="text-xs text-text-muted block mb-1">AUTH_PROVIDER</Typography.Code>
                      <Typography.Body className="text-lg">ENTRA_ID</Typography.Body>
                    </div>
                    <div>
                      <Typography.Code className="text-xs text-text-muted block mb-1">CLEARANCE</Typography.Code>
                      <Typography.Body className="text-sm text-ectoplasm">LEVEL_OMEGA</Typography.Body>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-overlay">
                  <Typography.Code className="text-xs text-text-muted block mb-4">SESSION_DECRYPT</Typography.Code>
                  <div className="bg-void/50 p-4 font-mono text-[10px] text-witchcraft/80 rounded border border-overlay/50 overflow-x-auto">
                    <pre>{JSON.stringify({
                      sid: "RED-ACTED",
                      iss: "FINNMINN_GATEWAY",
                      iat: Math.floor(Date.now() / 1000),
                      exp: "PERSISTENT",
                      scope: ["identity", "void_access"]
                    }, null, 2)}</pre>
                  </div>
                </div>
              </Card>

              <Card variant="magic" className="p-6 bg-vampire/5 border-vampire/30">
                <Typography.H3 className="text-vampire mb-4 font-header">SYSTEM_CONTROLS</Typography.H3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => logout()}
                    className="px-4 py-2 bg-vampire/20 border border-vampire text-vampire font-header hover:bg-vampire hover:text-void transition-all"
                  >
                    [ SEVER_LOGICAL_LINK ]
                  </button>
                  <button
                    onClick={() => navigate("/apps")}
                    className="px-4 py-2 bg-ectoplasm/10 border border-ectoplasm text-ectoplasm font-header hover:bg-ectoplasm hover:text-void transition-all"
                  >
                    [ RETURN_TO_DECK ]
                  </button>
                </div>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center opacity-30">
            <Typography.Code className="text-[10px]">
              DATA_ORIGIN: APPS/WEB // PROTOCOL: PIXEL_GRIM
            </Typography.Code>
          </div>
        </div>
      </main>
    </div>
  );
};
