import { AuthProvider } from "@finnminn/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Apps } from "./pages/Apps";
import { Console } from "./pages/Console";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/console" element={<Console />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App