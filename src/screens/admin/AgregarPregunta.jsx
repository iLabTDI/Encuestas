import { useState } from "react";
import Opcion from "../../components/Opcion.jsx";

export default function AgregarPregunta() {
  const [pregunta, setPregunta] = useState("");
  const [opciones, setOpciones] = useState([""]);

  const agregarOpcion = () => {
    setOpciones([...opciones, ""]); // Agrega una nueva opción vacía
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

  const manejarEnvio = (e) => {
    e.preventDefault();
    console.log("Pregunta:", pregunta);
    console.log("Opciones:", opciones);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        Añadir pregunta al formulario
      </h1>
      <p className="text-center text-gray-600 mb-4">
        Escribe la pregunta que quieras añadir al formulario
      </p>

      <form
        onSubmit={manejarEnvio}
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
          <Opcion
            key={index}
            index={index + 1}
            valor={opcion}
            onChange={(valor) => actualizarOpcion(index, valor)}
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
