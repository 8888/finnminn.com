import { AuthProvider } from "@finnminn/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CapturePage } from "./pages/CapturePage";
import { InboxPage } from "./pages/InboxPage";
import { TrackerPage } from "./pages/TrackerPage";
import { Character } from "./pages/Character";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<CapturePage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/tracker" element={<TrackerPage />} />
            <Route path="/character" element={<Character />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
