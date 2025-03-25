import { useState } from "react";
import Opcion from "../../components/Opcion.jsx";
import axios from "axios"; // Necesitas instalar axios

export default function AgregarPregunta() {
  const [pregunta, setPregunta] = useState("");
  const [opciones, setOpciones] = useState([""]);
  const [mensaje, setMensaje] = useState(""); // Para mostrar el mensaje de éxito o error
  const [preguntaId, setPreguntaId] = useState(null); // ID de la pregunta, que se obtiene al crearla

  const agregarOpcion = () => {
    setOpciones([...opciones, ""]);
  };

  const actualizarOpcion = (index, valor) => {
    const nuevasOpciones = [...opciones];
    nuevasOpciones[index] = valor;
    setOpciones(nuevasOpciones);
  };

  const eliminarOpcion = (index) => {
    if (opciones.length > 1) {
      const nuevasOpciones = opciones.filter((_, i) => i !== index);
      setOpciones(nuevasOpciones);
    }
  };

  const manejarEnvioPregunta = async (e) => {
    e.preventDefault();
    try {
      // Enviar la pregunta al servidor
      const respuestaPregunta = await axios.post(
        "http://localhost:5000/api/preguntas",
        {
          texto: pregunta,
        }
      );

      if (respuestaPregunta.status === 200) {
        const id = respuestaPregunta.data.id; // Asumimos que el servidor devuelve el ID de la pregunta
        setPreguntaId(id);
        setMensaje("Pregunta guardada. Ahora se agregarán las opciones.");

        // Ahora, guardar las opciones asociadas a la pregunta
        await guardarOpciones(id);
      }
    } catch (error) {
      console.error("Error al guardar la pregunta:", error);
      setMensaje("Hubo un error al guardar la pregunta.");
    }
  };

  const guardarOpciones = async (preguntaId) => {
    console.log("ID: ", preguntaId);
    try {
      // Filtrar opciones vacías
      const opcionesNoVacias = opciones.filter(
        (opcion) => opcion.trim() !== ""
      );

      // Si no hay opciones válidas, no hacer nada
      if (opcionesNoVacias.length === 0) {
        setMensaje("No se han agregado opciones válidas.");
        return;
      }

      // Enviar todas las opciones de una sola vez
      await axios.post("http://localhost:5000/api/opciones/multiple", {
        pregunta_id: preguntaId,
        opciones: opcionesNoVacias,
      });

      setMensaje("Todas las opciones han sido guardadas.");
    } catch (error) {
      console.error("Error al guardar las opciones:", error);
      setMensaje("Hubo un error al guardar las opciones.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        Añadir pregunta al formulario
      </h1>
      <p className="text-center text-gray-600 mb-4">
        Escribe la pregunta que quieras añadir al formulario
      </p>

      {/* Mostrar mensaje de éxito o error */}
      {mensaje && <p className="text-center text-lg mb-4">{mensaje}</p>}

      <form
        onSubmit={manejarEnvioPregunta}
        className="bg-white p-4 shadow-md rounded-md max-w-lg mx-auto"
      >
        <input
          type="text"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Ingresa la pregunta"
          className="w-full p-2 border rounded-md mb-4"
        />

        {/* Aquí es donde se generan las opciones */}
        {opciones.map((opcion, index) => (
          <div key={index} className="mb-4">
            <Opcion
              index={index + 1}
              valor={opcion}
              onChange={(valor) => actualizarOpcion(index, valor)}
              onDelete={() => eliminarOpcion(index)}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={agregarOpcion}
          className="text-green-600 mt-2 block text-center w-full"
        >
          + Añadir opción
        </button>

        <button
          type="submit"
          className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md w-full hover:bg-green-700"
        >
          Agregar pregunta
        </button>
      </form>
    </div>
  );
}
