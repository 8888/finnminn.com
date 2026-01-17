import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@finnminn/auth';
import { Atmosphere, Terminal, Typography, CommandBar } from '@finnminn/ui';
import { Home } from './pages/Home';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Atmosphere />
      <div className="min-h-screen bg-void text-spirit selection:bg-witchcraft selection:text-void flex flex-col p-4 md:p-8">
        <header className="mb-8">
          <Typography variant="h1" color="witchcraft" className="tracking-tighter">
            NECROBLOOM.exe
          </Typography>
          <Typography variant="body" color="spirit" className="opacity-60">
            Bringing life back from the void.
          </Typography>
        </header>

        <main className="flex-1">
          <Terminal title="CONSOLE // COLLECTOR" variant="ghost">
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </Router>
          </Terminal>
        </main>

        <footer className="mt-8 border-t border-gloom/20 pt-4">
          <CommandBar 
            actions={[
              { label: "COLLECTION", onClick: () => window.location.href = "/" },
              { label: "IDENTIFY", onClick: () => {} },
              { label: "LOGOUT", onClick: () => {} }
            ]}
          />
        </footer>
      </div>
    </AuthProvider>
  );
};

export default App;
