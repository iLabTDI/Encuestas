import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Dashboard from "../screens/admin/Dashboard";
import AgregarPregunta from "../screens/admin/AgregarPregunta";
import PreguntasActivas from "../screens/admin/PreguntasActivas";
import EditarPregunta from "../screens/admin/EditarPregunta";
import FormularioPreview from "../screens/admin/FormularioPreview";

export default function AdminPanel() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Routes>
          {/* Rutas internas del panel de administración */}
          <Route path="/" element={<Dashboard />} />
          <Route path="graficas" element={<Dashboard />} />
          <Route path="agregar-pregunta" element={<AgregarPregunta />} />
          <Route path="preguntas-activas" element={<PreguntasActivas />} />
          <Route path="editar-pregunta/:id" element={<EditarPregunta />} />
          <Route path="formulario-preview" element={<FormularioPreview />} />
        </Routes>
      </main>
    </div>
  );
}
