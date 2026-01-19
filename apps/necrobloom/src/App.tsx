import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@finnminn/auth';
import { Layout } from './components/Layout';
import { Button, Typography, Card } from '@finnminn/ui';
import { Dashboard } from './pages/Dashboard';
import { PlantDetail } from './pages/PlantDetail';

const Main = () => {
  const { isAuthenticated, login, inProgress, instance } = useAuth();
  const [hasAttemptedSso, setHasAttemptedSso] = React.useState(false);
  
  React.useEffect(() => {
    if (!isAuthenticated && inProgress === 'none' && !hasAttemptedSso) {
      setHasAttemptedSso(true);
      // Attempt to establish session from existing browser session (SSO)
      instance.ssoSilent({
        scopes: ["User.Read"]
      }).catch((error) => {
        console.log("Silent SSO failed, user must manually connect:", error);
        // Interaction required, let the UI render the login button
      });
    }
  }, [isAuthenticated, inProgress, instance, hasAttemptedSso]);

  if (inProgress !== 'none') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Typography.Body className="animate-pulse">
          INITIALIZING CONNECTION TO THE VOID...
        </Typography.Body>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full p-8 border-radical/50 text-center space-y-6">
          <Typography.H1 className="text-radical">
            ACCESS DENIED
          </Typography.H1>
          <Typography.Body className="text-toxic/70">
            This sector is restricted to authenticated Finnminn agents.
            Please establish your identity to manage the flora.
          </Typography.Body>
          <Button 
            onClick={login}
            variant="primary"
            className="w-full py-4 text-lg"
          >
            ESTABLISH CONNECTION
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/plant/:id" element={<PlantDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Main />
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;