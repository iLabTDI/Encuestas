import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { PieChart as PieChartIcon } from "react-feather"; // Ícono de gráfica
import Modal from "./Modal"; // Componente para la ventana modal

export default function SurveyCard({ id, estado }) {
  const [datos, setDatos] = useState([]);
  const [pregunta, setPregunta] = useState("");
  const [tipo, setTipo] = useState(""); // Tipo de pregunta (cerrada o abierta)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const COLORS = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#E6E6FA",
    "#8A2BE2",
    "#5F9EA0",
    "#7FFF00",
    "#D2691E",
    "#DC143C",
    "#00FFFF",
    "#00008B",
    "#008B8B",
    "#B8860B",
    "#A9A9A9",
    "#006400",
    "#BDB76B",
    "#8B008B",
    "#556B2F",
    "#FF8C00",
    "#9932CC",
    "#8B0000",
    "#E9967A",
    "#8FBC8F",
    "#483D8B",
    "#2F4F4F",
    "#00CED1",
    "#9400D3",
    "#FF1493",
    "#00BFFF",
    "#696969",
    "#1E90FF",
    "#B22222",
    "#FFFAF0",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/preguntas/${id}/votos`
        );
        console.log("Datos obtenidos para la pregunta:", response.data);

        setPregunta(response.data.texto);
        setTipo(response.data.tipo);
        setDatos(response.data.datos);
      } catch (err) {
        console.error("Error al obtener los datos de la pregunta:", err);
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      {/* Card principal */}
      <div
        className={`bg-white shadow-md p-6 rounded-xl border cursor-pointer ${
          estado === 1 ? "border-blue-300" : "border-red-300"
        } flex flex-col items-center justify-center`}
        onClick={() => setIsModalOpen(true)} // Abrir modal al hacer clic
      >
        <h3 className="text-lg font-bold text-center mb-4">
          {pregunta || `Pregunta ${id}`}
        </h3>
        <PieChartIcon size={48} className="text-blue-500" />{" "}
        {/* Ícono de gráfica */}
      </div>

      {/* Modal para mostrar detalles */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{pregunta}</h2>
            {loading && <p className="text-blue-500">Cargando datos...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && tipo === "cerrada" && datos.length > 0 && (
              <>
                {/* Gráfico de pastel */}
                <div className="w-full flex justify-center mb-6">
                  <PieChart width={300} height={300}>
                    <Pie
                      data={datos}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {datos.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>

                {/* Tabla de datos con colores */}
                <div className="overflow-x-auto w-full">
                  <table className="w-full mt-4 border-collapse border border-gray-300 text-sm sm:text-base">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 p-2">Color</th>
                        <th className="border border-gray-300 p-2">Opción</th>
                        <th className="border border-gray-300 p-2">Votos</th>
                        <th className="border border-gray-300 p-2">
                          Porcentaje
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {datos.map((dato, index) => (
                        <tr key={index}>
                          {/* Bola de color */}
                          <td className="border border-gray-300 p-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            ></div>
                          </td>
                          <td className="border border-gray-300 p-2">
                            {dato.name}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {dato.value}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {(
                              (dato.value /
                                datos.reduce((sum, d) => sum + d.value, 0)) *
                              100
                            ).toFixed(2)}
                            %
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {!loading && !error && tipo === "abierta" && (
              <>
                {/* Lista de respuestas abiertas */}
                <h3 className="text-lg font-semibold mb-4">
                  Respuestas abiertas:
                </h3>
                <ul className="list-disc pl-6">
                  {datos.length > 0 ? (
                    datos.map((respuesta, index) => (
                      <li key={index} className="mb-2">
                        {respuesta.texto}
                      </li>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      No hay respuestas disponibles.
                    </p>
                  )}
                </ul>
              </>
            )}

            {!loading && !error && datos.length === 0 && tipo === "cerrada" && (
              <p className="text-center text-red-500">
                No hay datos disponibles para esta pregunta.
              </p>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
