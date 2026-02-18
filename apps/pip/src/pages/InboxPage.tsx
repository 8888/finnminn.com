import { Terminal, Typography, Card, Button } from "@finnminn/ui";
import { useAuth } from "@finnminn/auth";
import { useCaptureManager } from "../hooks/useCaptureManager";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function InboxPage() {
  const { isAuthenticated } = useAuth();
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

  return (
    <div className="min-h-screen flex flex-col items-center bg-magic-void p-4">
      <div className="w-full max-w-2xl mt-12 z-10 flex flex-col gap-8">
        <div className="flex justify-between items-center">
           <Typography.H2 className="text-witchcraft cursor-pointer" onClick={() => navigate('/')}>&lt; Back</Typography.H2>
           <Typography.H1>The Vault</Typography.H1>
           <div className="w-20">{isSyncing && <Typography.Body className="text-xs text-toxic animate-pulse">SYNCING...</Typography.Body>}</div>
        </div>

        <div className="flex flex-col gap-4">
          {captures.length === 0 ? (
            <Card className="text-center p-12">
              <Typography.Body className="opacity-50">Memory Empty</Typography.Body>
            </Card>
          ) : (
            captures.map((capture) => (
              <Terminal 
                key={capture.id} 
                title={new Date(capture.timestamp).toLocaleString()} 
                className={`w-full transition-all duration-300 ${voidingIds.includes(capture.id) ? 'opacity-0 scale-95 skew-x-12 blur-sm' : 'opacity-100'}`}
              >
                <Typography.Body className="whitespace-pre-wrap">{capture.content}</Typography.Body>
                <div className="mt-4 flex justify-between items-end">
                  <div className="opacity-30 text-[10px] flex flex-col">
                    <span>Source: {capture.source.toUpperCase()}</span>
                    <span>ID: {capture.id.slice(0, 8)}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[10px] text-vampire hover:text-radical p-0 h-auto"
                    onClick={() => handlePurge(capture.id)}
                  >
                    [ VOID ]
                  </Button>
                </div>
              </Terminal>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
