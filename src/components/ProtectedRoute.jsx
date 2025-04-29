import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/" replace />;
  }

  return children;
}
