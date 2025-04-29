import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./auth/LoginScreen";
import AdminPanel from "./navigation/AdminRutes";
import Formulario from "./screens/userr/Formulario";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  // Simulación de autenticación y rol (puedes reemplazar esto con tu lógica real)
  const isAuthenticated = !!localStorage.getItem("token"); // Verifica si hay un token
  const userRole = localStorage.getItem("role"); // Obtén el rol del usuario (admin o user)

  return (
    <Router>
      <Routes>
        {/* Página de login */}
        <Route path="/" element={<AuthPage />} />

        {/* Rutas protegidas del admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              role={userRole}
              requiredRole="admin"
            >
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Ruta del formulario */}
        <Route
          path="/formulario"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Formulario />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
