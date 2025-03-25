import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
// import Graficas from "./screens/admin/Graficas";
// import Dashboard from "./screens/admin/Dashboard";
// import AgregarPregunta from "./screens/admin/AgregarPregunta";
import { AuthPage } from "./auth/LoginScreen";
import { Navigation } from "./Routes";

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <AuthPage />
      {/* <Navigation /> */}
    </div>
  );
}
