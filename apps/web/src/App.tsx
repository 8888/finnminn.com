import { Button } from "@finnminn/ui";
import { useAuth, AuthProvider } from "@finnminn/auth";

function Content() {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="font-pixel text-6xl text-radical">FINNMINN.COM</h1>
      <p className="text-xl">System Status: ONLINE</p>
      
      <div className="p-8 border-2 border-gloom bg-crypt shadow-hard-green">
        {isAuthenticated ? (
          <div className="flex flex-col gap-4">
            <p>Welcome, Agent {user?.name}</p>
            <Button onClick={() => logout()}>Disconnect</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
             <p>Access Restricted</p>
             <Button onClick={() => login()}>Authenticate</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Content />
    </AuthProvider>
  )
}

export default App
