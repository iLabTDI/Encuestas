export default function Opcion({ id, index, valor, onChange, onDelete }) {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md mb-2">
      <span className="bg-purple-300 text-white px-3 py-1 rounded-md">
        {index}
      </span>

      <input
        type="text"
        value={valor}
        onChange={(e) => onChange({ id, texto: e.target.value })} // 🔹 Mantiene el ID al actualizar
        placeholder="Inserta la opción"
        className="w-full p-2 border rounded-md"
      />

      <button
        onClick={onDelete}
        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
      >
        ✖
      </button>
    </div>
  );
}
