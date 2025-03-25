import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Dashboard from "../screens/admin/Dashboard";
import AgregarPregunta from "../screens/admin/AgregarPregunta";

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
        </Routes>
      </div>
    </div>
  );
}
