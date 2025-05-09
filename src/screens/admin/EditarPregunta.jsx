import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Opcion from "../../components/Opcion";

export default function EditarPregunta() {
  const { id } = useParams(); // Obtiene el ID de la pregunta desde la URL
  const navigate = useNavigate();

  const [pregunta, setPregunta] = useState("");
  const [opciones, setOpciones] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [showModal, setShowModal] = useState(false); // Estado para la ventana emergente

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/preguntas/${id}`)
      .then((respuesta) => {
        setPregunta(respuesta.data.texto);
        setOpciones(respuesta.data.opciones); // Guardamos ID y texto
      })
      .catch((error) => {
        console.error("Error al cargar la pregunta:", error);
      });
  }, [id]);

  const agregarOpcion = () => {
    setOpciones([...opciones, { id: null, texto: "" }]); // Nuevas opciones sin ID (se generará en el backend)
  };

  const actualizarOpcion = (index, nuevaOpcion) => {
    const nuevasOpciones = [...opciones];
    nuevasOpciones[index] = nuevaOpcion; // Mantiene el ID y solo cambia el texto
    setOpciones(nuevasOpciones);
  };

  const eliminarOpcion = async (index) => {
    const opcion = opciones[index];

    // Si la opción tiene un ID, envía una solicitud para eliminarla del servidor
    if (opcion.id) {
      try {
        await axios.delete(`http://localhost:5000/api/opciones/${opcion.id}`);
      } catch (error) {
        console.error("Error al eliminar la opción del servidor:", error);
        setMensaje("Error al eliminar la opción.");
        return;
      }
    }

    // Elimina la opción del estado local
    const nuevasOpciones = opciones.filter((_, i) => i !== index);
    setOpciones(nuevasOpciones);
  };

  const manejarEdicion = async (e) => {
    e.preventDefault();
    try {
      // Actualizar la pregunta y las opciones en una sola solicitud
      await axios.put(`http://localhost:5000/api/preguntas/${id}`, {
        texto: pregunta,
        opciones: opciones, // Enviar todas las opciones (incluyendo nuevas y existentes)
      });

      setMensaje("Pregunta actualizada con éxito");

      // Limpiar los campos después de guardar
      setPregunta("");
      setOpciones([]);

      // Mostrar la ventana emergente
      setShowModal(true);

      // Opcional: Redirigir después de un tiempo
      setTimeout(() => {
        setShowModal(false);
        navigate(-2); // Regresa a la página anterior
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar la pregunta:", error);
      setMensaje("Error al actualizar la pregunta.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Editar Pregunta</h1>
      {mensaje && <p className="text-center text-lg mb-4">{mensaje}</p>}

      <form
        onSubmit={manejarEdicion}
        className="bg-white p-4 shadow-md rounded-md max-w-lg mx-auto"
      >
        <input
          type="text"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Editar la pregunta"
          className="w-full p-2 border rounded-md mb-4"
        />

        {opciones.map((opcion, index) => (
          <Opcion
            key={opcion.id || `new-${index}`} // Evita errores en nuevas opciones sin ID
            id={opcion.id}
            index={index + 1}
            valor={opcion.texto}
            onChange={(nuevaOpcion) => actualizarOpcion(index, nuevaOpcion)}
            onDelete={() => eliminarOpcion(index)}
          />
        ))}

        <button
          type="button"
          onClick={agregarOpcion}
          className="text-green-600 mt-2 block text-center w-full"
        >
          + Añadir opción
        </button>

        <div className="flex justify-between mt-4">
          {/* Botón de Cancelar */}
          <button
            type="button"
            onClick={() => navigate(-1)} // Regresa a la página anterior
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            Cancelar
          </button>

          {/* Botón de Guardar */}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </div>
      </form>

      {/* Ventana emergente */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              ¡Cambios guardados con éxito!
            </h2>
            <button
              onClick={() => {
                setShowModal(false);
                navigate("/preguntas-activas");
              }}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
