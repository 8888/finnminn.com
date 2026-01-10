import { Button, Card, Terminal, Typography } from "@finnminn/ui";
import { useAuth, AuthProvider } from "@finnminn/auth";

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

function Content() {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8 bg-magic-void relative">
      <Atmosphere />

      <div className="z-10 flex flex-col items-center gap-8 w-full max-w-2xl">
        <Typography.H1 className="text-center">FINNMINN.COM</Typography.H1>

        <Terminal title="SYSTEM_LOG" className="w-full">
           <Typography.Body>Status: ONLINE</Typography.Body>
           <Typography.Body>System: Secure</Typography.Body>
           <Typography.Body>Users: {isAuthenticated ? '1' : '0'}</Typography.Body>
        </Terminal>

        <Card variant={isAuthenticated ? "magic" : "default"} className="w-full text-center">
          {isAuthenticated ? (
            <div className="flex flex-col gap-6 items-center">
              <Typography.H2>Welcome, {user?.name}</Typography.H2>
              <Typography.Body>Clearance Level: MAXIMUM</Typography.Body>
              <Button onClick={() => logout()} variant="destructive">Disconnect</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6 items-center">
               <Typography.H2>Access Restricted</Typography.H2>
               <Typography.Body>Please authenticate to access the console.</Typography.Body>
               <Button onClick={() => login()} variant="primary">Authenticate</Button>
            </div>
          )}
        </Card>
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
