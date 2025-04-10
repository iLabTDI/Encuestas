import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Formulario() {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [consentimiento, setConsentimiento] = useState(false); // Estado para el consentimiento
  const navigate = useNavigate();

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirige al login si no hay token
    }
  }, [navigate]);

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

  const cerrarSesion = () => {
    // Elimina todas las credenciales del almacenamiento local
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Opcional: Si usas cookies para la autenticación, puedes limpiarlas aquí
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirige al usuario al login
    navigate("/");
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Validar que todas las preguntas tengan respuesta
    const preguntasSinResponder = preguntas.filter(
      (pregunta) =>
        !respuestas[pregunta.id] ||
        respuestas[pregunta.id].toString().trim() === ""
    );

    if (preguntasSinResponder.length > 0) {
      setMensaje("Por favor, responde todas las preguntas antes de enviar.");
      return;
    }

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

      setMensaje("Respuestas enviadas con éxito.");
      setRespuestas({}); // Resetea las respuestas

      // Obtener el email del usuario desde localStorage
      const emailUsuario = localStorage.getItem("email");
      if (emailUsuario) {
        console.log(
          `Respuestas enviadas por el usuario con email: ${emailUsuario}`
        );
      } else {
        console.log("No se encontró el email del usuario en localStorage.");
      }

      // Cierra la sesión después de enviar las respuestas
      cerrarSesion();
    } catch (error) {
      console.error("Error al enviar las respuestas:", error);
      setMensaje("Hubo un error al enviar las respuestas.");
    }
  };

  // Mostrar consentimiento si no ha sido aceptado
  if (!consentimiento) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-yellow-500 to-red-600 flex items-center justify-center p-6">
        <div className="bg-white text-blue-900 shadow-2xl rounded-2xl p-8 w-full max-w-3xl">
          <h1 className="text-4xl font-bold text-center text-blue-900 mb-6">
            Consentimiento para el uso de datos
          </h1>
          <p className="text-center text-gray-600 font-medium mb-6">
            Por favor, lee cuidadosamente el siguiente consentimiento:
          </p>
          <p className="text-left text-gray-600 font-medium mb-6">
            - Este cuestionario está diseñado para conocer tus opiniones acerca
            del uso de Inteligencias Artificiales en tus clases, tareas y otras
            actividades. Tu participación es voluntaria y puedes abandonarla en
            cualquier momento.
          </p>
          <p className="text-left text-gray-600 font-medium mb-6">
            - No conlleva ningún riesgo ni condicionamiento. Por lo que debes de
            saber que en caso de participar todos tus datos personales serán
            protegidos y que los resultados de esta encuesta serán estrictamente
            confidenciales. Aplicándose únicamente con los fines de
            investigación asociados a este tema.
          </p>
          <p className="text-left text-gray-600 font-medium mb-6">
            - Agradecemos de antemano, tu interés y tiempos, en caso de querer
            continuar te pido que aceptes este consentimiento y puedas contestar
            de forma personal y lo más verídica en torno a tu experiencia y uso
            de IA.
          </p>
          <p className="text-left text-gray-600 font-medium mb-6">
            - Si decides no aceptar este consentimiento, no podrás continuar con
            la encuesta.
          </p>
          <div className="flex justify-between mt-6">
            <button
              onClick={cerrarSesion}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Rechazar
            </button>
            <button
              onClick={() => setConsentimiento(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-yellow-500 to-red-600 flex items-center justify-center p-6">
      <div className="bg-white text-blue-900 shadow-2xl rounded-2xl p-8 w-full max-w-3xl">
        {/* Título */}
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-6">
          Uso de Inteligencias Artificiales en la Universidad de Guadalajara.
        </h1>
        <p className="text-center text-gray-600 font-medium mb-6">
          Este cuestionario está diseñado para conocer tus opiniones acerca del
          uso de Inteligencias Artificiales en tus clases, tareas y otras
          actividades.
        </p>
        <hr className="border-t-2 border-yellow-500 mb-6" />
        <p className="text-left text-gray-600 font-medium mb-6">
          Gracias por tomarte el tiempo de estar en esta encuesta antes de
          empezar te pedimos que respondas acorde a tu datos personales
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
          {/* Preguntas cerradas */}
          {preguntas
            .filter((pregunta) => pregunta.tipo !== "abierta")
            .map((pregunta) => (
              <div
                key={pregunta.id}
                className="mb-8 pb-4 bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <h2 className="text-lg font-semibold text-blue-900 mb-4">
                  {pregunta.texto}
                </h2>

                {pregunta.opciones.length > 10 ? (
                  // Mostrar Dropdown si hay más de 10 opciones
                  <select
                    value={respuestas[pregunta.id] || ""}
                    onChange={(e) =>
                      manejarCambio(pregunta.id, parseInt(e.target.value))
                    }
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
                  ))
                )}
              </div>
            ))}

          {/* Texto antes de las preguntas abiertas */}
          <div className="mb-8">
            <hr className="border-t-2 border-yellow-500 mb-6" />
            <p className="text-left text-gray-600 font-medium mb-6">
              Te pedimos por último que puedas responder de la formas más
              abierta y honesta posible las siguientes preguntas
            </p>
            <hr className="border-t-2 border-yellow-500 mb-6" />
          </div>

          {/* Preguntas abiertas */}
          {preguntas
            .filter((pregunta) => pregunta.tipo === "abierta")
            .map((pregunta) => (
              <div
                key={pregunta.id}
                className="mb-8 pb-4 bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <h2 className="text-lg font-semibold text-blue-900 mb-4">
                  {pregunta.texto}
                </h2>
                <textarea
                  value={respuestas[pregunta.id] || ""}
                  onChange={(e) => manejarCambio(pregunta.id, e.target.value)}
                  placeholder="Escribe tu respuesta aquí"
                  className="w-full p-3 border border-gray-300 rounded-md text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

          {/* Botón de envío */}
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
