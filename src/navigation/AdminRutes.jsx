import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Dashboard from "../screens/admin/Dashboard";
import AgregarPregunta from "../screens/admin/AgregarPregunta";
import PreguntasActivas from "../screens/admin/PreguntasActivas";
import EditarPregunta from "../screens/admin/EditarPregunta";

export default function AdminPanel() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-6">
        <Routes>
          {/* Dashboard como vista por defecto */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/graficas" element={<Dashboard />} />
          <Route path="/agregar-pregunta" element={<AgregarPregunta />} />
          <Route path="/preguntas-activas" element={<PreguntasActivas />} />
          <Route path="/editar-pregunta/:id" element={<EditarPregunta />} />
        </Routes>
      </div>
    </div>
  );
}
