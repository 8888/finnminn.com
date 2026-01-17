import { AuthProvider } from "@finnminn/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Apps } from "./pages/Apps";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apps" element={<Apps />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App