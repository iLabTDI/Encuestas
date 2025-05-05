import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({ requiredRole, children }) {
  const { isAuthenticated, userRole } = useAuth();

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene, redirige a su ruta correspondiente
  if (requiredRole && userRole !== requiredRole) {
    const redirectPath = userRole === "admin" ? "/admin" : "/formulario";
    return <Navigate to={redirectPath} replace />;
  }

  // Si pasa todas las verificaciones, renderiza los hijos
  return children;
}
