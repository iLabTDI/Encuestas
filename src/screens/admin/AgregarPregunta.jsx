import { useState } from "react";
import OpcionNew from "../../components/OpcionNew.jsx";
import axios from "axios";

export default function AgregarPregunta() {
  const [pregunta, setPregunta] = useState("");
  const [opciones, setOpciones] = useState([{ texto: "" }]);
  const [mensaje, setMensaje] = useState("");
  const [tipoPregunta, setTipoPregunta] = useState("cerrada"); // Estado para el tipo de pregunta

  const agregarOpcion = () => {
    setOpciones([...opciones, { texto: "" }]);
  };

  const actualizarOpcion = (index, valor) => {
    const nuevasOpciones = [...opciones];
    nuevasOpciones[index].texto = valor;
    setOpciones(nuevasOpciones);
  };

  const eliminarOpcion = (index) => {
    if (opciones.length > 1) {
      const nuevasOpciones = opciones.filter((_, i) => i !== index);
      setOpciones(nuevasOpciones);
    }
  };

  const manejarEnvioPregunta = async (e) => {
    e.preventDefault(); // Previene la recarga automática
    console.log("Enviando pregunta:", { texto: pregunta, tipo: tipoPregunta }); // Verifica el valor
    try {
      const respuestaPregunta = await axios.post(
        "http://localhost:5000/api/preguntas",
        {
          texto: pregunta,
          tipo: tipoPregunta, // Enviar el tipo de pregunta
        }
      );

      if (respuestaPregunta.status === 200) {
        setMensaje("Pregunta guardada con éxito.");

        if (tipoPregunta === "cerrada") {
          const id = respuestaPregunta.data.id;
          await guardarOpciones(id);
        }
      }
    } catch (error) {
      console.error("Error al guardar la pregunta:", error);
      setMensaje("Hubo un error al guardar la pregunta.");
    }
  };

  const guardarOpciones = async (preguntaId) => {
    try {
      const opcionesNoVacias = opciones
        .filter((opcion) => opcion.texto.trim() !== "")
        .map((opcion) => opcion.texto);

      if (opcionesNoVacias.length === 0) {
        setMensaje("No se han agregado opciones válidas.");
        return;
      }

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
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
        Añadir Pregunta
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Escribe la pregunta y selecciona el tipo.
      </p>

      {mensaje && (
        <p className="text-center text-lg mb-4 text-green-600">{mensaje}</p>
      )}

      <form
        onSubmit={manejarEnvioPregunta}
        className="bg-white p-6 shadow-lg rounded-lg max-w-lg w-full"
      >
        <label className="block text-gray-700 font-medium mb-2">
          Pregunta:
        </label>
        <textarea
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          onInput={(e) => {
            e.target.style.height = "auto"; // Restablece la altura
            e.target.style.height = `${e.target.scrollHeight}px`; // Ajusta la altura al contenido
          }}
          placeholder="Ingresa la pregunta"
          className="w-full p-3 border rounded-md mb-6 ring-1 ring-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
        />

        <label className="block text-gray-700 font-medium mb-2">
          Tipo de Pregunta:
        </label>
        <select
          value={tipoPregunta}
          onChange={(e) => {
            const nuevoTipo = e.target.value;
            console.log(`Tipo de pregunta cambiado a: ${nuevoTipo}`); // Log para registrar el cambio
            setTipoPregunta(nuevoTipo);
          }}
          className="w-full p-3 border rounded-md mb-6 ring-1 ring-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="cerrada">Cerrada (con opciones)</option>
          <option value="abierta">Abierta (respuesta libre)</option>
        </select>

        {/* Mostrar opciones solo si la pregunta es cerrada */}
        {tipoPregunta === "cerrada" && (
          <>
            <label className="block text-gray-700 font-medium mb-2">
              Opciones:
            </label>
            {opciones.map((opcion, index) => (
              <div key={index} className="flex items-center mb-4">
                <OpcionNew
                  index={index + 1}
                  valor={opcion.texto}
                  onChange={(valor) => actualizarOpcion(index, valor)}
                  onDelete={() => eliminarOpcion(index)}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={agregarOpcion}
              className="w-full text-green-600 border border-green-600 py-2 rounded-md hover:bg-green-100 transition duration-200"
            >
              + Añadir opción
            </button>
          </>
        )}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
          >
            Guardar Pregunta
          </button>
        </div>
      </form>
    </div>
  );
}
