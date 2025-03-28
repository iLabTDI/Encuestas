import { useState, useEffect } from "react";
import axios from "axios";
import SurveyCard from "../../components/SurveyCard";

export default function Dashboard() {
  const [preguntas, setPreguntas] = useState([]);

  useEffect(() => {
    // Obtener preguntas desde el backend
    const fetchPreguntas = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/preguntas");
        setPreguntas(response.data);
      } catch (error) {
        console.error("Error al obtener las preguntas:", error);
      }
    };

    fetchPreguntas();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Análisis de encuestas</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {preguntas.map((pregunta) => (
            <SurveyCard
              key={pregunta.id}
              nombre={pregunta.texto}
              datos={pregunta.datos}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
