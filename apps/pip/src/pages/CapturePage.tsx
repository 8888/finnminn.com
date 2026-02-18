import { useState, useEffect, useRef } from 'react';
import { Button, Terminal, Typography, Card } from "@finnminn/ui";
import { useAuth } from "@finnminn/auth";
import { useVoiceCapture } from "../hooks/useVoiceCapture";
import { useCaptureManager } from "../hooks/useCaptureManager";
import { Mascot } from "../components/Mascot";
import { useNavigate } from "react-router-dom";

export function CapturePage() {
  const { isAuthenticated, login } = useAuth();
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-magic-void p-4">
        <Mascot />
        <Typography.H1 className="mt-8">Pip</Typography.H1>
        <Card className="mt-8 w-full max-w-md text-center">
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
              className="text-xs text-witchcraft opacity-50 hover:opacity-100 transition-opacity uppercase"
            >
              [ PURGE_VESSEL_CACHE ]
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-magic-void p-4 relative overflow-hidden">
      {/* Atmosphere component could be extracted if needed, for now focusing on core UI */}
      
      <div className="w-full max-w-2xl mt-12 z-10 flex flex-col items-center gap-8">
        <div className="flex justify-between w-full items-center mb-4">
           <Typography.H2 className="text-witchcraft cursor-pointer" onClick={() => navigate('/tracker')}>Pip.exe</Typography.H2>
           <div className="flex gap-4">
              <Button onClick={() => navigate('/inbox')} variant="secondary">Vault</Button>
           </div>
        </div>

        <Terminal title="QUICK_CAPTURE" className="w-full min-h-[300px] flex flex-col">
          <textarea
            ref={textareaRef}
            className="w-full flex-grow bg-transparent border-none outline-none text-toxic font-mono resize-none text-xl p-4 placeholder:opacity-30"
            placeholder="Type your thought or use the mic..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          {isSuccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-magic-void/80 pointer-events-none">
              <Typography.H2 className="animate-pulse text-radical italic">THOUGHT_SECURED</Typography.H2>
            </div>
          )}

          <div className="flex justify-between items-center p-4 border-t border-magic-void/20">
            <Typography.Body className="text-xs opacity-50">
              [ENTER] TO SAVE | [SHIFT+ENTER] FOR NEW LINE
            </Typography.Body>
            <Button 
              onClick={handleSave} 
              variant="primary" 
              disabled={!text.trim()}
              className={isSuccess ? 'animate-glitch' : ''}
            >
              SECURE
            </Button>
          </div>
        </Terminal>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Button
            onClick={isListening ? stop : start}
            variant={isListening ? "destructive" : "primary"}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isListening ? 'animate-pulse scale-110' : ''}`}
            disabled={!isSupported}
            aria-label={isListening ? "Stop voice recording" : "Start voice recording"}
          >
            {isListening ? (
              <span className="text-2xl">Stop</span>
            ) : (
              <span className="text-2xl">Mic</span>
            )}
          </Button>
          {!isSupported && <Typography.Body className="text-xs opacity-50">Voice not supported in this vessel</Typography.Body>}
        </div>
      </div>
    </div>
  );
}
