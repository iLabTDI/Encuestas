import { useState, useEffect } from "react";
import axios from "axios";

export default function FormularioPreview() {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtener preguntas activas con opciones desde el backend
    axios
      .get("http://localhost:5000/api/formulario")
      .then((respuesta) => {
        setPreguntas(respuesta.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar el formulario:", error);
        setError("No se pudieron cargar las preguntas.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-yellow-500 to-red-600 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white text-blue-900 shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-3xl">
        {/* Título */}
        <h1 className="text-2xl sm:text-4xl font-bold text-center text-blue-900 mb-6">
          Vista previa del formulario
        </h1>
        <p className="text-center text-gray-600 font-medium mb-6">
          Este es un ejemplo de cómo se verá el formulario para los usuarios.
        </p>

        {/* Mensajes de carga o error */}
        {loading && <p className="text-blue-500">Cargando preguntas...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Preguntas */}
        {!loading && !error && (
          <form>
            {preguntas.map((pregunta) => (
              <div
                key={pregunta.id}
                className="mb-8 pb-4 bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <h2 className="text-lg font-semibold text-blue-900 mb-4">
                  {pregunta.texto}
                </h2>

                {/* Mostrar Dropdown si hay más de 10 opciones */}
                {pregunta.opciones.length > 10 ? (
                  <select
                    disabled // Deshabilitar para que sea solo vista previa
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    {pregunta.opciones.map((opcion) => (
                      <option key={opcion.id} value={opcion.id}>
                        {opcion.texto}
                      </option>
                    ))}
                  </select>
                ) : (
                  // Mostrar botones de radio si hay 10 o menos opciones
                  pregunta.opciones.map((opcion) => (
                    <div key={opcion.id} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={`pregunta-${pregunta.id}-opcion-${opcion.id}`}
                        name={`pregunta-${pregunta.id}`}
                        value={opcion.id}
                        disabled // Deshabilitar para que no sea interactivo
                        className="h-5 w-5 text-red-600 focus:ring-yellow-500 border-gray-300"
                      />
                      <label
                        htmlFor={`pregunta-${pregunta.id}-opcion-${opcion.id}`}
                        className="ml-3 text-gray-700"
                      >
                        {opcion.texto}
                      </label>
                    </div>
                  ))
                )}
              </div>
            ))}
          </form>
        )}
      </div>
    </div>
  );
}
