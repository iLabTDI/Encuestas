import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-1/5 bg-white shadow-lg p-4">
      <h2 className="text-lg font-bold mb-4">Administrador</h2>
      <nav className="space-y-2">
        <Link to="/graficas" className="block p-2 hover:bg-blue-100 rounded-md">
          📊 Gráficas
        </Link>
        <Link
          to="/agragar-pregunta"
          className="block p-2 bg-blue-100 rounded-md"
        >
          ➕ Añadir pregunta
        </Link>
        <Link
          to="/preguntas-activas"
          className="block p-2 hover:bg-gray-200 rounded-md"
        >
          ✅ Preguntas activas
        </Link>
      </nav>
    </aside>
  );
}
