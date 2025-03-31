import { useState, useEffect } from "react";
import axios from "axios";

export default function Formulario() {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    // Obtener preguntas activas con opciones desde el backend
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-yellow-500 to-red-600 flex items-center justify-center p-6">
      <div className="bg-white text-blue-900 shadow-2xl rounded-2xl p-8 w-full max-w-3xl">
        {/* Título */}
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-6">
          Encuesta Uso de Inteligencias Artificiales en la Universidad de
          Guadalajara
        </h1>
        <p className="text-center text-gray-600 font-medium mb-6">
          Este cuestionario esta diseñado para conocer tus opiniones acerca del
          uso de Inteligencias Artificiales en tus clases, tares y otras
          actividades.
        </p>

        <p className="text-left text-gray-600 font-medium mb-6">
          Gracias por tomarte el tiempo de estar en esta encuesta antes de
          empezar es importante aclarar los siguientes puntos:
        </p>
        <p className="text-left text-gray-600 font-medium mb-6">
          -Esta encuesta es un diagnóstico acerca del uso de tu persona de
          Inteligencias Artificiales. Por lo que únicamente se te pedirá
          contestar de la forma más verídica y adecuada a tu uso.
        </p>
        <p className="text-left text-gray-600 font-medium mb-6">
          -Si decides participar debes saber que tu participación es voluntaria
          y puedes abandonar esta encuesta en el momento que así lo decidas, o
          bien no contestarla.
        </p>
        <p className="text-left text-gray-600 font-medium mb-6">
          -No conlleva ningún riesgo ni condicionamiento. Por lo que debes de
          saber que en caso de participar todos tus datos personales serán
          protegidos y que los resultados de esta encuesta serán estrictamente
          confidenciales. Aplicándose únicamente con los fines de investigación
          asociados a este tema.
        </p>
        <p className="text-left text-gray-600 font-medium mb-6">
          Agradezco de antemano, tu interés y tiempos, en caso de querer
          continuar te pido que aceptes este consentimiento y puedas contestar
          de forma personal y lo más verídica en torno a tu experiencia y uso de
          IA.
        </p>
        <hr className="border-t-2 border-yellow-500 mb-6" />
        <p className="text-left text-gray-600 font-medium mb-6">
          En esta sección te pedimos que respondas acorde a tu datos personales
          (Recuerda que serán usados únicamente para fines de la investigación)
        </p>
        <hr className="border-t-2 border-yellow-500 mb-6" />

        {/* Mensaje */}
        {mensaje && (
          <p className="text-center text-green-600 font-medium mb-4">
            {mensaje}
          </p>
        )}

        {/* Formulario */}
        <form onSubmit={manejarEnvio}>
          {preguntas.map((pregunta) => (
            <div
              key={pregunta.id}
              className="mb-8 pb-4 bg-gray-100 p-4 rounded-lg shadow-md"
            >
              <h2 className="text-lg font-semibold text-blue-900 mb-4">
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
                    className="h-5 w-5 text-red-600 focus:ring-yellow-500 border-gray-300"
                  />
                  <label
                    htmlFor={`pregunta-${pregunta.id}-opcion-${opcion.id}`}
                    className="ml-3 text-gray-700"
                  >
                    {opcion.texto}
                  </label>
                </div>
              ))}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-800 transition duration-200"
          >
            Enviar respuestas
          </button>
        </form>
      </div>
    </div>
  );
}
