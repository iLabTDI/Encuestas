import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Función para verificar si la ruta está activa
  const isActive = (path) => location.pathname === path;

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.clear(); // Limpia el almacenamiento local
    navigate("/"); // Redirige al usuario a la página de inicio de sesión
  };

  return (
    <div className="relative">
      {/* Botón para mostrar/ocultar el sidebar en móviles */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-md shadow-lg"
      >
        {isOpen ? "✖ Cerrar" : "☰ Menú"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-blue-900 text-white shadow-lg p-6 z-40 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:relative md:translate-x-0 md:w-64`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center border-b border-blue-700 pb-4">
          Administrador
        </h2>

        {/* Botón de cerrar sesión */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md mb-6"
        >
          🔒 Cerrar sesión
        </button>

        <nav className="space-y-4">
          <Link
            to="/admin"
            className={`block p-3 rounded-md ${
              isActive("/admin/graficas")
                ? "bg-blue-700 font-bold shadow-md"
                : "hover:bg-blue-800"
            }`}
          >
            📊 Gráficas
          </Link>
          <Link
            to="/admin/agregar-pregunta"
            className={`block p-3 rounded-md ${
              isActive("/admin/agregar-pregunta")
                ? "bg-blue-700 font-bold shadow-md"
                : "hover:bg-blue-800"
            }`}
          >
            ➕ Añadir pregunta
          </Link>
          <Link
            to="/admin/preguntas-activas"
            className={`block p-3 rounded-md ${
              isActive("/admin/preguntas-activas")
                ? "bg-blue-700 font-bold shadow-md"
                : "hover:bg-blue-800"
            }`}
          >
            ✅ Preguntas activas
          </Link>
          <Link
            to="/admin/formulario-preview"
            className={`block p-3 rounded-md ${
              isActive("/admin/formulario-preview")
                ? "bg-blue-700 font-bold shadow-md"
                : "hover:bg-blue-800"
            }`}
          >
            👁️ Vista previa del formulario
          </Link>
        </nav>
      </aside>

      {/* Fondo oscuro para móviles cuando el menú está abierto */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        ></div>
      )}
    </div>
  );
}
