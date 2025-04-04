import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  isAuthenticated,
  role,
  requiredRole,
  children,
}) {
  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene, redirige al formulario
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/formulario" replace />;
  }

  // Si pasa las verificaciones, renderiza el contenido
  return children;
}
