import { AuthProvider, useAuth } from '@finnminn/auth';
import { Layout } from './components/Layout';
import { Button, Typography, Card } from '@finnminn/ui';
import { Dashboard } from './pages/Dashboard';

const Main = () => {
  const { isAuthenticated, login, inProgress } = useAuth();

  if (inProgress !== 'none') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Typography variant="body" className="animate-pulse">
          INITIALIZING CONNECTION TO THE VOID...
        </Typography>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full p-8 border-radical/50 text-center space-y-6">
          <Typography variant="h1" className="text-radical">
            ACCESS DENIED
          </Typography>
          <Typography variant="body" className="text-toxic/70">
            This sector is restricted to authenticated Finnminn agents.
            Please establish your identity to manage the flora.
          </Typography>
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

  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Main />
      </Layout>
    </AuthProvider>
  );
}

export default App;