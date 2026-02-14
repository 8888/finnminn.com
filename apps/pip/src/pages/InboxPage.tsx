import { Terminal, Typography, Card } from "@finnminn/ui";
import { useAuth } from "@finnminn/auth";
import { useCaptureManager } from "../hooks/useCaptureManager";
import { useNavigate } from "react-router-dom";

export function InboxPage() {
  const { isAuthenticated } = useAuth();
  const { captures, isSyncing } = useCaptureManager();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

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
              <Terminal key={capture.id} title={new Date(capture.timestamp).toLocaleString()} className="w-full">
                <Typography.Body className="whitespace-pre-wrap">{capture.content}</Typography.Body>
                <div className="mt-4 flex justify-between items-center opacity-30 text-[10px]">
                  <span>Source: {capture.source.toUpperCase()}</span>
                  <span>ID: {capture.id.slice(0, 8)}</span>
                </div>
              </Terminal>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
