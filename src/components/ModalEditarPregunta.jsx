import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import axios from "axios";

export default function ModalEditarPregunta({ pregunta, onClose, onUpdate }) {
  const [textoPregunta, setTextoPregunta] = useState(pregunta.texto);
  const [opciones, setOpciones] = useState(pregunta.opciones);
  const navigate = useNavigate(); // Inicializa useNavigate

  const actualizarOpcion = (index, nuevoTexto) => {
    const nuevasOpciones = [...opciones];
    nuevasOpciones[index].texto = nuevoTexto;
    setOpciones(nuevasOpciones);
  };

  const agregarOpcion = () => {
    setOpciones([...opciones, { id: null, texto: "" }]); // Nueva opción sin ID
  };

  const eliminarOpcion = (index) => {
    const nuevasOpciones = opciones.filter((_, i) => i !== index);
    setOpciones(nuevasOpciones);
  };

  const manejarEdicion = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/preguntas/${pregunta.id}`, {
        texto: textoPregunta,
        opciones: opciones,
      });

      onUpdate(); // Recargar las preguntas después de editar
      onClose(); // Cerrar el modal

      // Redirige a la página de "Preguntas Activas"
      navigate("/admin/preguntas-activas");
    } catch (error) {
      console.error("Error al actualizar la pregunta:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Editar Pregunta</h2>
        <form onSubmit={manejarEdicion}>
          <input
            type="text"
            value={textoPregunta}
            onChange={(e) => setTextoPregunta(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
            placeholder="Editar pregunta"
          />

          {opciones.map((opcion, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={opcion.texto}
                onChange={(e) => actualizarOpcion(index, e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Editar opción"
              />
              <button
                type="button"
                onClick={() => eliminarOpcion(index)}
                className="ml-2 text-red-500"
              >
                ❌
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={agregarOpcion}
            className="text-green-600 mt-2"
          >
            + Añadir opción
          </button>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white py-2 px-4 rounded-md"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
