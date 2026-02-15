import { Button, Terminal, Typography, Card } from "@finnminn/ui";
import { useAuth } from "@finnminn/auth";
import { Mascot } from "../components/Mascot";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const FIREFLIES = Array.from({ length: 12 }, (_, i) => i);

const Atmosphere = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
       {FIREFLIES.map((i) => (
         <div key={i} className="firefly" />
       ))}
    </div>
  );
};

export function TrackerPage() {
  const { user, login, logout, isAuthenticated, getToken } = useAuth();
  const navigate = useNavigate();
  const [apiResult, setApiResult] = useState<string>("Awaiting input");
  const API_BASE = import.meta.env.VITE_API_URL || '';

  const callApi = async () => {
    try {
        const token = await getToken();
        setApiResult("Calling API...");
        const res = await fetch(`${API_BASE}/api/hello`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const text = await res.text();
        setApiResult(`API Response: ${text}`);
    } catch (e: unknown) {
        setApiResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 bg-magic-void relative overflow-hidden">
      <Atmosphere />
      
      <div className="z-10 flex flex-col items-center gap-8 w-full max-w-md">
        <Mascot />
        
        <Typography.H1>Pip</Typography.H1>
        
        <Card className="w-full" variant={isAuthenticated ? "magic" : "default"}>
          {isAuthenticated ? (
            <div className="flex flex-col gap-6">
              <Typography.Body className="text-center">
                Welcome, <span className="text-witchcraft">{user?.name}</span>
              </Typography.Body>
              
              <div className="grid grid-cols-1 gap-3">
                  <Button onClick={() => navigate("/")} variant="secondary" className="w-full">
                    Quick Capture
                  </Button>
                  <Button onClick={() => navigate("/character")} variant="primary" className="w-full">
                    Character Profile
                  </Button>
                  <Button onClick={callApi} variant="secondary" className="w-full">
                    Test Spectral Link
                  </Button>
                  <Button onClick={() => logout()} variant="destructive" className="w-full">
                    Sever Connection
                  </Button>
              </div>

              <Terminal title="API Console" className="mt-4">
                <Typography.Body className="text-xs break-all">
                  &gt; {apiResult}
                </Typography.Body>
                <p className="animate-pulse text-xs">_</p>
              </Terminal>
            </div>
          ) : (
            <div className="flex flex-col gap-6 text-center">
               <Typography.Body>Authentication Required</Typography.Body>
               <Button onClick={() => login()} variant="primary" className="w-full">
                  Initialize Login
               </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
