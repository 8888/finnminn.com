import { useState, useEffect, useRef } from 'react';
import { Button, Terminal, Typography, CommandBar } from "@finnminn/ui";
import { useAuth } from "@finnminn/auth";
import { useVoiceCapture } from "../hooks/useVoiceCapture";
import { useCaptureManager } from "../hooks/useCaptureManager";
import { Mascot } from "../components/Mascot";
import { useNavigate } from "react-router-dom";

export function CapturePage() {
  const { isAuthenticated, login, logout, user } = useAuth();
  const { isListening, transcript, start, stop, isSupported } = useVoiceCapture();
  const { saveCapture } = useCaptureManager();
  const [text, setText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (isAuthenticated && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAuthenticated]);

  const handleSave = async () => {
    if (!text.trim()) return;

    await saveCapture(text, isListening ? 'voice' : 'text');
    setText('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);

    if (isListening) stop();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const navLinks = [
    { label: "Vault", href: "/inbox" },
    { label: "Home", href: "https://finnminn.com" }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-magic-void p-4">
        <Mascot />
        <Typography.H1 className="mt-8">Pip</Typography.H1>
        <div className="mt-8 w-full max-w-md text-center p-8 border-2 border-overlay bg-surface shadow-pixel">
          <Typography.Body className="mb-6">Initialize Connection to Access Memory</Typography.Body>
          <div className="flex flex-col gap-4">
            <Button onClick={() => login()} variant="primary" className="w-full">
              Login
            </Button>
            <button
              onClick={async () => {
                localStorage.clear();
                sessionStorage.clear();

                // Unregister all service workers
                if ('serviceWorker' in navigator) {
                  const registrations = await navigator.serviceWorker.getRegistrations();
                  for (const registration of registrations) {
                    await registration.unregister();
                  }
                }

                window.location.reload();
              }}
              className="text-xs text-witchcraft opacity-50 hover:opacity-100 transition-opacity uppercase font-header"
            >
              [ PURGE_VESSEL_CACHE ]
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-magic-void relative overflow-hidden">
      <CommandBar
        logo="Pip.exe"
        user={user ? { name: user.name || user.username || "User", email: user.username } : null}
        links={navLinks}
        onLinkClick={(href) => href.startsWith('http') ? window.location.href = href : navigate(href)}
        onLogout={logout}
      />

      <div className="w-full max-w-2xl mt-12 z-10 flex flex-col items-center gap-6 px-4">
        <Terminal title="QUICK_CAPTURE" className="w-full min-h-[250px] flex flex-col">
          <textarea
            ref={textareaRef}
            className="w-full flex-grow bg-transparent border-none outline-none text-ectoplasm font-body resize-none text-xl p-4 placeholder:opacity-30"
            placeholder="Type your thought or use the mic..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {isSuccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-magic-void/80 pointer-events-none z-20">
              <Typography.H2 variant="vampire" className="animate-pulse italic">THOUGHT_SECURED</Typography.H2>
            </div>
          )}

          <div className="flex justify-between items-center p-4 border-t border-text-muted/10 bg-surface/30">
            <Typography.Body variant="muted" size="xs" className="uppercase tracking-tighter">
              [ENTER] TO SAVE | [SHIFT+ENTER] FOR NEW LINE
            </Typography.Body>
            <Button
              onClick={handleSave}
              variant="secondary"
              size="md"
              disabled={text.trim().length === 0}
              className={`${isSuccess ? 'animate-glitch' : ''} min-w-[120px] relative z-20`}
            >
              SUBMIT
            </Button>
          </div>
        </Terminal>

        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={isListening ? stop : start}
            variant={isListening ? "destructive" : "secondary"}
            size="lg"
            isCircle={true}
            className={`transition-all shadow-pixel-witchcraft ${isListening ? 'animate-pulse scale-105' : 'hover:scale-105'}`}
            disabled={!isSupported}
            aria-label={isListening ? "Stop voice recording" : "Start voice recording"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </Button>
          {!isSupported && <Typography.Body className="text-xs opacity-30 italic">Voice input restricted in this vessel</Typography.Body>}
        </div>
      </div>
    </div>
  );
}
