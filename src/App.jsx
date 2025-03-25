import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Graficas from "./screens/admin/Graficas";
import Dashboard from "./screens/admin/Dashboard";
import AgregarPregunta from "./screens/admin/AgregarPregunta";

export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-6">
          <Routes>
            <Route path="/graficas" element={<Dashboard />} />
            <Route path="/agragar-pregunta" element={<AgregarPregunta />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
