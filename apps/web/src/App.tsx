import { Button, Terminal, Typography, Image } from "@finnminn/ui";
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

      {/* Disconnect Control - moved elsewhere */}
      {isAuthenticated && (
        <div className="fixed top-4 right-4 z-50">
          <Button onClick={() => logout()} variant="destructive" className="text-xs px-3 py-1">Disconnect</Button>
        </div>
      )}

      <div className="z-10 flex flex-col items-center gap-6 w-full max-w-2xl">
        <Typography.H1 className="text-center text-5xl md:text-7xl">FINNMINN</Typography.H1>

        <div className="w-full max-w-lg">
          <Image 
            src="/finn.jpg" 
            alt="Specimen Finn" 
            variant="artifact" 
            size="full" 
            caption="FIG 1. SPECIMEN 'FINN' // SLEEP STATE" 
          />
        </div>

        <div className="w-full max-w-lg flex flex-col gap-4">
          <Terminal title="SYSTEM_LOG" className="w-full">
            <Typography.Body className="text-sm">&gt; SYSTEM_INIT... SUCCESS</Typography.Body>
            <Typography.Body className="text-sm">&gt; CONNECTING TO VOID...</Typography.Body>
            <Typography.Body className="text-sm">&gt; STATUS: {isAuthenticated ? 'LINK_ESTABLISHED' : 'AWAITING_INPUT'}</Typography.Body>
            <Typography.Body className="text-sm">
              &gt; USER: <span className={isAuthenticated ? "text-witchcraft" : "text-vampire"}>
                {isAuthenticated ? user?.name?.toUpperCase() : 'UNKNOWN_ENTITY'}
              </span>
            </Typography.Body>
            {isAuthenticated && (
              <Typography.Body className="text-sm text-text-muted">&gt; CLEARANCE: LEVEL_5 (MAXIMUM)</Typography.Body>
            )}
            <p className="animate-pulse mt-2">_</p>
          </Terminal>

          {!isAuthenticated && (
            <Button onClick={() => login()} variant="primary" className="w-full">
              Authenticate Sequence
            </Button>
          )}
        </div>
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
