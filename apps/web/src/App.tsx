import { AuthProvider } from "@finnminn/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Apps } from "./pages/Apps";
import { Console } from "./pages/Console";

import { Profile } from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/console" element={<Console />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
