import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ isAuthenticated, isAdmin, children }) {
  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Si no es administrador y está intentando acceder a rutas de admin, redirige al formulario
  if (!isAdmin) {
    return <Navigate to="/formulario" />;
  }

  // Si está autenticado y es administrador, renderiza el contenido protegido
  return children;
}
