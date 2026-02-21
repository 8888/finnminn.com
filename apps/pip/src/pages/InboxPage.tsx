import { Terminal, Typography, Card, Button, CommandBar } from "@finnminn/ui";
import { useAuth } from "@finnminn/auth";
import { useCaptureManager } from "../hooks/useCaptureManager";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function InboxPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const { captures, isSyncing, purgeCapture } = useCaptureManager();
  const navigate = useNavigate();
  const [voidingIds, setVoidingIds] = useState<string[]>([]);

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const handlePurge = async (id: string) => {
    setVoidingIds(prev => [...prev, id]);
    // Allow animation to play
    setTimeout(() => {
      purgeCapture(id);
      setVoidingIds(prev => prev.filter(vid => vid !== id));
    }, 300);
  };

  const navLinks = [
    { label: "Capture", href: "/" },
    { label: "Home", href: "https://finnminn.com" }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-magic-void relative overflow-hidden">
      <CommandBar
        logo="Pip.exe"
        user={user ? { name: user.name || user.username || "User", email: user.username } : null}
        links={navLinks}
        onLinkClick={(href) => href.startsWith('http') ? window.location.href = href : navigate(href)}
        onLogout={logout}
      />

      <div className="w-full max-w-2xl mt-12 z-10 flex flex-col gap-8 px-4">
        <div className="flex justify-between items-baseline">
          <div className="flex gap-4 items-baseline">
            <Typography.H1 className="text-4xl">The Vault</Typography.H1>
            {isSyncing && <Typography.Body className="text-[10px] text-toxic animate-pulse font-body">SYNCING_STREAM...</Typography.Body>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-xs opacity-50 hover:opacity-100"
          >
            &lt; RETURN_TO_CAPTURE
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          {captures.length === 0 ? (
            <Card className="text-center p-12 border-dashed border-text-muted/20">
              <Typography.Body className="opacity-30 italic">No memories stored in this vessel...</Typography.Body>
            </Card>
          ) : (
            captures.map((capture) => (
              <Terminal
                key={capture.id}
                title={new Date(capture.timestamp).toLocaleString()}
                className={`w-full transition-all duration-500 ease-in-out ${voidingIds.includes(capture.id) ? 'opacity-0 scale-95 skew-x-12 blur-sm translate-x-12' : 'opacity-100'}`}
              >
                <div className="p-2">
                  <Typography.Body className="whitespace-pre-wrap text-lg leading-relaxed">{capture.content}</Typography.Body>
                  <div className="mt-6 flex justify-between items-end pt-4 border-t border-text-muted/10">
                    <div className="opacity-30 text-[9px] flex flex-col font-body gap-1">
                      <span>ORIGIN: {capture.source.toUpperCase()}</span>
                      <span>UID: {capture.id.slice(0, 12)}...</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[10px] text-vampire hover:text-radical hover:bg-vampire/10 px-2 py-1 h-auto"
                      onClick={() => handlePurge(capture.id)}
                    >
                      [ VOID_MEMORY ]
                    </Button>
                  </div>
                </div>
              </Terminal>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
