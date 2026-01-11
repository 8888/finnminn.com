import { Button } from "@finnminn/ui";
import { useAuth } from "@finnminn/auth";
import { Mascot } from "../components/Mascot";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function Home() {
  const { user, login, logout, isAuthenticated, getToken } = useAuth();
  const navigate = useNavigate();
  const [apiResult, setApiResult] = useState<string>("Waiting for action...");

  const callApi = async () => {
    try {
        const token = await getToken();
        // In local dev, use localhost:7071. In prod, use the real API.
        // We can set this in .env. For now, hardcode localhost for dev pattern? 
        // Or proxy. Let's assume proxy or direct call. 
        // The original code used a hardcoded prod URL. Let's use relative path /api/hello assuming SWA proxy or Vite proxy.
        // Note: We need to configure proxy in vite.config.ts if we want relative paths locally.
        
        // For migration speed, let's keep it simple.
        setApiResult("Calling API...");
        const res = await fetch("/api/hello", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const text = await res.text();
        setApiResult(`API Response: ${text}`);
    } catch (e: any) {
        setApiResult(`Error: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4">
      <Mascot />
      
      <h1 className="font-pixel text-6xl text-radical">Pip</h1>
      
      <div className="p-8 border-2 border-gloom bg-crypt shadow-hard-green w-full max-w-md">
        {isAuthenticated ? (
          <div className="flex flex-col gap-4">
            <p className="text-ash">Welcome, {user?.name}</p>
            <div className="flex gap-4">
                <Button onClick={() => navigate("/character")}>Character</Button>
                <Button onClick={callApi}>Test API</Button>
                <Button onClick={() => logout()}>Logout</Button>
            </div>
            <div className="mt-4 p-4 bg-void border border-gloom font-mono text-sm break-all">
                {apiResult}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-center">
             <p className="text-ash">Authentication Required</p>
             <Button onClick={() => login()}>Login</Button>
          </div>
        )}
      </div>
    </div>
  );
}
