import { useState } from "react";
import OpcionNew from "../../components/OpcionNew.jsx"; // Cambiar a OpcionNew
import axios from "axios";

export default function AgregarPregunta() {
  const [pregunta, setPregunta] = useState("");
  const [opciones, setOpciones] = useState([{ texto: "" }]); // Manejar opciones como objetos
  const [mensaje, setMensaje] = useState("");
  const [preguntaId, setPreguntaId] = useState(null);

  const agregarOpcion = () => {
    setOpciones([...opciones, { texto: "" }]); // Agregar una nueva opción vacía
  };

  const actualizarOpcion = (index, valor) => {
    const nuevasOpciones = [...opciones];
    nuevasOpciones[index].texto = valor; // Actualizar solo el texto de la opción
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
      const respuestaPregunta = await axios.post(
        "http://localhost:5000/api/preguntas",
        {
          texto: pregunta,
        }
      );

      if (respuestaPregunta.status === 200) {
        const id = respuestaPregunta.data.id;
        setPreguntaId(id);
        setMensaje("Pregunta guardada. Ahora se agregarán las opciones.");
        await guardarOpciones(id);
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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        Añadir pregunta al formulario
      </h1>
      <p className="text-center text-gray-600 mb-4">
        Escribe la pregunta que quieras añadir al formulario
      </p>

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

        {opciones.map((opcion, index) => (
          <div key={index} className="mb-4">
            <OpcionNew
              index={index + 1}
              valor={opcion.texto} // Pasar solo el texto
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
