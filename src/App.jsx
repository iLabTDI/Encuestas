import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import AuthPage from "./auth/LoginScreen";
import AdminPanel from "./navigation/AdminRutes";
import Formulario from "./screens/userr/Formulario";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Página de login */}
          <Route path="/" element={<AuthPage />} />

          {/* Rutas protegidas del admin */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* Ruta del formulario */}
          <Route
            path="/formulario"
            element={
              <ProtectedRoute>
                <Formulario />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
