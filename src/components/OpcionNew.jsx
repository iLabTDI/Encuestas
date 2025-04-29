export default function OpcionNew({ index, valor, onChange, onDelete }) {
  const eliminarOpcion = (index) => {
    if (opciones.length > 1) {
      const nuevasOpciones = opciones.filter((_, i) => i !== index);
      setOpciones(nuevasOpciones);
    }
  };

  return (
    <div className="flex items-center mb-2">
      <textarea
        type="text"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Opción ${index}`}
        className="flex-1 p-2 border rounded-md ring-1 ring-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button" // Asegúrate de que sea un botón de tipo "button" para evitar el envío del formulario
        onClick={(e) => {
          e.preventDefault(); // Evita cualquier comportamiento predeterminado
          onDelete();
        }}
        className="ml-2 text-red-600 hover:text-red-800"
      >
        Eliminar
      </button>
    </div>
  );
}
