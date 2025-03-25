import Sidebar from "../../components/Sidebar";
import SurveyCard from "../../components/SurveyCard";

export default function Dashboard() {
  const encuestas = [
    { id: 1, nombre: "Encuesta 1" },
    { id: 2, nombre: "Encuesta 2" },
    { id: 3, nombre: "Encuesta 3" },
    { id: 4, nombre: "Encuesta 4" },
    { id: 5, nombre: "Encuesta 5" },
    { id: 6, nombre: "Encuesta 6" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Análisis de encuestas</h1>
        <div className="grid grid-cols-3 gap-6">
          {encuestas.map((encuesta) => (
            <SurveyCard key={encuesta.id} nombre={encuesta.nombre} />
          ))}
        </div>
      </main>
    </div>
  );
}
