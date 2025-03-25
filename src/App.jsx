import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./auth/LoginScreen";
import AdminPanel from "./navigation/AdminRutes";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Página de login */}
        <Route path="/" element={<AuthPage />} />

        {/* Rutas del admin, usando `/*` para manejar subrutas */}
        <Route path="/*" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
