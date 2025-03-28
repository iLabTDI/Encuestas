import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import SurveyCard from "../../components/SurveyCard";

export default function Dashboard() {
  const [preguntas, setPreguntas] = useState([]);
  const [filtro, setFiltro] = useState("1"); // "1" para activas por defecto

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/preguntas?estado=${filtro}`
        );
        setPreguntas(response.data);
      } catch (error) {
        console.error("Error al obtener las preguntas:", error);
      }
    };

    fetchPreguntas();
  }, [filtro]); // Volver a cargar preguntas cuando cambie el filtro

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Análisis de encuestas</h1>
        {/* Botones de filtro */}
        <div className="mb-6 flex gap-4">
          <button
            className={`px-4 py-2 rounded ${
              filtro === "1" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFiltro("1")}
          >
            Activas
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filtro === "0" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFiltro("0")}
          >
            Inactivas
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filtro === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFiltro("all")}
          >
            Todas
          </button>
        </div>

        {/* Lista de preguntas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {preguntas.map((pregunta) => (
            <SurveyCard
              key={pregunta.id}
              id={pregunta.id}
              estado={pregunta.estado} // Pasar el estado para distinguir entre activas e inactivas
            />
          ))}
        </div>
      </main>
    </div>
  );
}
