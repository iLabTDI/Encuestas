import { useState } from "react";
import { PieChart } from "recharts";

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
      {/* Panel lateral */}
      <aside className="w-1/5 bg-white shadow-lg p-4">
        <h2 className="text-lg font-bold mb-4">Administrador</h2>
        <nav className="space-y-2">
          <button className="w-full text-left flex items-center space-x-2 p-2 bg-blue-100 rounded-md">
            ➕ Gráficas
          </button>
          <button className="w-full text-left flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md">
            ➕ Añadir pregunta
          </button>
          <button className="w-full text-left flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md">
            ✅ Preguntas activas
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Análisis de encuestas</h1>

        {/* Grid de encuestas */}
        <div className="grid grid-cols-3 gap-6">
          {encuestas.map((encuesta) => (
            <div
              key={encuesta.id}
              className="bg-white shadow-md p-4 rounded-xl flex flex-col items-center border border-blue-300"
            >
              <PieChart width={100} height={100}>
                {/* Aquí irían los datos reales de cada encuesta */}
              </PieChart>
              <div className="mt-3 bg-blue-100 w-full p-2 rounded-md text-center">
                {encuesta.nombre}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
