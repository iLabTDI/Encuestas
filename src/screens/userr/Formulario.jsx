import { useState, useEffect } from "react";
import axios from "axios";

export default function Formulario() {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    // Obtener preguntas con opciones desde el backend
    axios
      .get("http://localhost:5000/api/formulario")
      .then((respuesta) => setPreguntas(respuesta.data))
      .catch((error) => console.error("Error al cargar el formulario:", error));
  }, []);

  const manejarCambio = (preguntaId, opcionId) => {
    setRespuestas({ ...respuestas, [preguntaId]: opcionId });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      const respuestasArray = Object.entries(respuestas).map(
        ([preguntaId, opcionId]) => ({
          pregunta_id: parseInt(preguntaId),
          opcion_id: opcionId,
        })
      );

      await axios.post("http://localhost:5000/api/respuestas", {
        respuestas: respuestasArray,
      });

      setMensaje("Respuestas guardadas con éxito.");
      setRespuestas({}); // Resetea las respuestas
    } catch (error) {
      console.error("Error al guardar las respuestas:", error);
      setMensaje("Hubo un error al guardar las respuestas.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-red-600 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center text-blue-900 mb-6">
          Encuesta de la Universidad de Guadalajara
        </h1>
        <hr className="border-t-2 border-gray-300 mb-6" />
        {mensaje && (
          <p className="text-center text-green-600 font-medium mb-4">
            {mensaje}
          </p>
        )}
        <form onSubmit={manejarEnvio}>
          {preguntas.map((pregunta) => (
            <div key={pregunta.id} className="mb-8 pb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                {pregunta.texto}
              </h2>
              {pregunta.opciones.map((opcion) => (
                <div key={opcion.id} className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={`pregunta-${pregunta.id}-opcion-${opcion.id}`}
                    name={`pregunta-${pregunta.id}`}
                    value={opcion.id}
                    checked={respuestas[pregunta.id] === opcion.id || false}
                    onChange={() => manejarCambio(pregunta.id, opcion.id)}
                    className="h-5 w-5 text-blue-900 focus:ring-blue-700 border-gray-300"
                  />
                  <label
                    htmlFor={`pregunta-${pregunta.id}-opcion-${opcion.id}`}
                    className="ml-3 text-gray-600"
                  >
                    {opcion.texto}
                  </label>
                </div>
              ))}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition duration-200"
          >
            Enviar respuestas
          </button>
        </form>
      </div>
    </div>
  );
}
