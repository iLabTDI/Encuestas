import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function SurveyCard({ id, estado }) {
  const [datos, setDatos] = useState([]);
  const [pregunta, setPregunta] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ["#82ca9d", "#8884d8", "#ffc658", "#8dd1e1", "#ff8042"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/preguntas/${id}/votos`
        );
        setPregunta(response.data.texto);
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
    <div
      className={`bg-white shadow-md p-4 rounded-xl border ${
        estado === 1 ? "border-blue-300" : "border-red-300"
      } flex flex-col items-center`}
    >
      <h3 className="text-lg font-bold text-center mb-4">
        {pregunta || `Pregunta ${id}`}{" "}
        {estado === 0 && (
          <span className="text-red-500 text-sm">(Inactiva)</span>
        )}
      </h3>

      <div className="w-full flex flex-col items-center">
        {loading && (
          <p className="text-center text-blue-500">Cargando datos...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && datos.length > 0 && (
          <>
            {/* Gráfico de pastel */}
            <div className="w-full flex justify-center mb-6">
              <PieChart width={250} height={250}>
                <Pie
                  data={datos}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
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
                <Legend />
              </PieChart>
            </div>

            {/* Tabla de datos */}
            <div className="overflow-x-auto w-full">
              <table className="w-full mt-4 border-collapse border border-gray-300 text-sm sm:text-base">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">Opción</th>
                    <th className="border border-gray-300 p-2">Votos</th>
                    <th className="border border-gray-300 p-2">Porcentaje</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((dato, index) => (
                    <tr key={index}>
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

        {!loading && !error && datos.length === 0 && (
          <p className="text-center text-red-500">
            No hay datos disponibles para esta pregunta.
          </p>
        )}
      </div>
    </div>
  );
}
