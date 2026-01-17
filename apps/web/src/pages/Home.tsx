import { Button, Terminal, Typography, Image, Atmosphere } from "@finnminn/ui";
import { useAuth } from "@finnminn/auth";

export const Home = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8 bg-magic-void relative">
      <Atmosphere />

      <div className="z-10 flex flex-col items-center gap-6 w-full max-w-2xl">
        <div className="w-full max-w-lg">
          <Image 
            src="/finn.jpg" 
            alt="Specimen Finn" 
            variant="artifact" 
            size="full" 
            caption="FIG 1. SPECIMEN 'FINN'" 
          />
        </div>

        <div className="w-full max-w-lg flex flex-col gap-4">
          <Terminal title="SYSTEM_LOG" className="w-full">
            <Typography.Body className="text-sm">&gt; IDENTITY: FINNMINN</Typography.Body>
            <Typography.Body className="text-sm">&gt; SYSTEM_INIT... SUCCESS</Typography.Body>
            <Typography.Body className="text-sm">&gt; CONNECTING TO VOID...</Typography.Body>
            <Typography.Body className="text-sm">&gt; STATUS: {isAuthenticated ? 'LINK_ESTABLISHED' : 'AWAITING_INPUT'}</Typography.Body>
            <Typography.Body className="text-sm">
              &gt; USER: <span className={isAuthenticated ? "text-witchcraft" : "text-vampire"}>
                {isAuthenticated ? user?.name?.toUpperCase() : 'UNKNOWN_ENTITY'}
              </span>
            </Typography.Body>
            <p className="animate-pulse mt-2">_</p>
          </Terminal>

          {isAuthenticated ? (
            <Button onClick={() => logout()} variant="destructive" className="w-full">
              Disconnect
            </Button>
          ) : (
            <Button onClick={() => login()} variant="primary" className="w-full">
              Authenticate Sequence
            </Button>
          )}

          {/* Temporary Link to Apps for easy navigation */}
          <div className="text-center mt-4">
              <a href="/apps" className="text-ectoplasm hover:underline font-header">[ ENTER_APPS ]</a>
          </div>
        </div>
      </div>
    </div>
  );
}
