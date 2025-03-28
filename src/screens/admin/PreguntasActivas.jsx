import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PreguntasActivas() {
  const [preguntas, setPreguntas] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/preguntas")
      .then((response) => {
        setPreguntas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las preguntas:", error);
      });
  }, []);

  const eliminarPregunta = (id) => {
    axios
      .delete(`http://localhost:5000/api/preguntas/${id}`)
      .then(() => {
        setPreguntas(preguntas.filter((pregunta) => pregunta.id !== id));
      })
      .catch((error) => {
        console.error("Error al eliminar la pregunta:", error);
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Lista de preguntas activas
      </h1>
      <div className="space-y-4">
        {preguntas.map((pregunta) => (
          <div
            key={pregunta.id}
            className="flex justify-between items-center p-3 bg-blue-100 rounded-md shadow-md"
          >
            <span>{pregunta.texto}</span>
            <div className="space-x-2">
              <Link to={`/editar-pregunta/${pregunta.id}`}>
                <button className="bg-blue-500 text-white p-2 rounded-md mr-2">
                  ✏️
                </button>
              </Link>
              <button
                onClick={() => eliminarPregunta(pregunta.id)}
                className="bg-red-500 text-white p-2 rounded-md"
              >
                🗙
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
