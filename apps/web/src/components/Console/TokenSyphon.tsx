import { useState } from "react";
import { Terminal, Button, Typography, Input } from "@finnminn/ui";

interface TokenSyphonProps {
  token: string | null;
  onRefresh?: () => void;
}

export const TokenSyphon = ({ token, onRefresh }: TokenSyphonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (token) {
      try {
        await navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy token:", err);
      }
    }
  };

  return (
    <Terminal title="TOKEN_SYPHON.EXE" className="w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        <Typography.Body className="text-ectoplasm">
          {token ? ">> ACTIVE_SESSION_TOKEN_EXTRACTED" : ">> EXTRACTING_ACTIVE_SESSION_TOKEN..."}
        </Typography.Body>
        
        <div className="relative">
          <Input 
            value={token || ""} 
            readOnly 
            className="font-mono text-xs md:text-sm bg-void/50 border-overlay text-text-muted w-full pr-24"
          />
        </div>

        <div className="flex justify-end gap-2">
          {onRefresh && (
            <Button
                variant="ghost"
                onClick={onRefresh}
                className="w-full md:w-auto"
            >
                [ REFRESH_SIGNAL ]
            </Button>
          )}
          <Button 
            variant={copied ? "secondary" : "destructive"} 
            onClick={handleCopy}
            disabled={!token}
            className="w-full md:w-auto"
          >
            {copied ? "[ TOKEN_COPIED ]" : "[ COPY_TO_CLIPBOARD ]"}
          </Button>
        </div>
      </div>
    </Terminal>
  );
};
