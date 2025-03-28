import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PreguntasActivas() {
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
  }, [filtro]); // Recargar preguntas cuando cambie el filtro

  const cambiarEstadoPregunta = async (id, nuevoEstado) => {
    try {
      await axios.put(`http://localhost:5000/api/preguntas/${id}/estado`, {
        estado: nuevoEstado,
      });
      setPreguntas(
        preguntas.map((pregunta) =>
          pregunta.id === id ? { ...pregunta, estado: nuevoEstado } : pregunta
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado de la pregunta:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Lista de preguntas
      </h1>

      {/* Botones de filtro */}
      <div className="mb-6 flex gap-4 justify-center">
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
      <div className="space-y-4">
        {preguntas.map((pregunta) => (
          <div
            key={pregunta.id}
            className={`flex justify-between items-center p-3 rounded-md shadow-md ${
              pregunta.estado === 1 ? "bg-blue-100" : "bg-red-100"
            }`}
          >
            <span>
              {pregunta.texto}{" "}
              {pregunta.estado === 0 && (
                <span className="text-red-500 text-sm">(Inactiva)</span>
              )}
            </span>
            <div className="space-x-2">
              <Link to={`/editar-pregunta/${pregunta.id}`}>
                <button className="bg-blue-500 text-white p-2 rounded-md mr-2">
                  ✏️
                </button>
              </Link>
              {pregunta.estado === 1 ? (
                <button
                  onClick={() => cambiarEstadoPregunta(pregunta.id, 0)} // Desactivar pregunta
                  className="bg-red-500 text-white p-2 rounded-md"
                >
                  Desactivar
                </button>
              ) : (
                <button
                  onClick={() => cambiarEstadoPregunta(pregunta.id, 1)} // Activar pregunta
                  className="bg-green-500 text-white p-2 rounded-md"
                >
                  Activar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
