import { AuthProvider } from "@finnminn/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CapturePage } from "./pages/CapturePage";
import { InboxPage } from "./pages/InboxPage";
import { TrackerPage } from "./pages/TrackerPage";
import { Character } from "./pages/Character";
import { Layout } from "./components/Layout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<CapturePage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/tracker" element={<TrackerPage />} />
            <Route path="/character" element={<Character />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
