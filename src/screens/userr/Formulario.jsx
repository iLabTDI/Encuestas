import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Formulario() {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [consentimiento, setConsentimiento] = useState(false);
  const [accesoDenegado, setAccesoDenegado] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para la ventana emergente de validación
  const [showGraciasModal, setShowGraciasModal] = useState(false); // Estado para la ventana emergente de agradecimiento
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

  useEffect(() => {
    const verificarEmail = async () => {
      const emailUsuario = localStorage.getItem("email");
      if (!emailUsuario) {
        console.error(
          "El email del usuario no está disponible en localStorage."
        );
        return;
      }

      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/verificar-email/${emailUsuario}`
        );

        if (data.yaRespondio) {
          setMensaje(
            "Ya has respondido esta encuesta. Gracias por tu participación."
          );
          setAccesoDenegado(true); // Deniega el acceso al formulario
        }
      } catch (error) {
        console.error("Error al verificar el email:", error);
        setMensaje("Hubo un error al verificar tu email.");
      }
    };

    verificarEmail();
  }, []);

  const manejarCambio = (preguntaId, opcionId) => {
    setRespuestas({ ...respuestas, [preguntaId]: opcionId });
  };

  const cerrarSesion = () => {
    // Elimina todas las credenciales del almacenamiento local
    console.log(localStorage);

    localStorage.clear();

    // Opcional: Si usas cookies para la autenticación, puedes limpiarlas aquí
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    console.log(localStorage);

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
      setShowModal(true); // Muestra la ventana emergente de validación
      return;
    }

    try {
      const emailUsuario = localStorage.getItem("email");
      console.log("Email obtenido de localStorage:", emailUsuario);

      if (!emailUsuario) {
        console.error(
          "El email del usuario no está disponible en localStorage."
        );
        setMensaje("No se pudo obtener el email del usuario.");
        return;
      }

      // Verificar si el email ya existe en la base de datos
      const { data } = await axios.get(
        `http://localhost:5000/api/verificar-email/${emailUsuario}`
      );

      if (data.yaRespondio) {
        console.log("El email ya existe en la base de datos:", emailUsuario);
        setMensaje(
          "Ya has respondido esta encuesta. Gracias por tu participación."
        );
        return;
      }

      // Si el email no existe, registrar las respuestas
      const respuestasArray = Object.entries(respuestas).map(
        ([preguntaId, respuesta]) => ({
          pregunta_id: parseInt(preguntaId),
          opcion_id: typeof respuesta === "number" ? respuesta : null, // Si es una opción, envía el ID
          respuesta_abierta: typeof respuesta === "string" ? respuesta : null, // Si es texto, envía la respuesta abierta
        })
      );

      await axios.post("http://localhost:5000/api/respuestas", {
        respuestas: respuestasArray,
      });

      // Registrar el email en la base de datos
      await axios.post("http://localhost:5000/api/registrar-email", {
        email: emailUsuario,
      });
      console.log("Email registrado en la base de datos:", emailUsuario);

      // Mostrar ventana emergente de agradecimiento
      setShowGraciasModal(true);
    } catch (error) {
      console.error(
        "Error al enviar las respuestas o registrar el email:",
        error
      );
      setMensaje("Hubo un error al enviar las respuestas.");
    }
  };

  if (accesoDenegado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-yellow-500 to-red-600 flex items-center justify-center p-6">
        <div className="bg-white text-blue-900 shadow-2xl rounded-2xl p-8 w-full max-w-3xl">
          <h1 className="text-4xl font-bold text-center text-blue-900 mb-6">
            ¡Gracias por tu participación!
          </h1>
          <p className="text-center text-gray-600 font-medium mb-6">
            Ya has respondido esta encuesta. Agradecemos mucho tu tiempo y tus
            respuestas.
          </p>
          <p className="text-center text-gray-600 font-medium mb-6">
            Si tienes alguna duda o comentario, no dudes en contactarnos.
          </p>
          <div className="flex justify-center mt-6">
            <button
              onClick={cerrarSesion}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Ventana emergente */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              ¡Faltan preguntas por responder!
            </h2>
            <p className="text-gray-700 mb-4">
              Por favor, responde todas las preguntas antes de enviar.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      {/* Ventana emergente de agradecimiento */}
      {showGraciasModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              ¡Gracias por tu participación!
            </h2>
            <p className="text-gray-700 mb-4">
              Tus respuestas han sido enviadas con éxito.
            </p>
            <button
              onClick={cerrarSesion}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Terminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
