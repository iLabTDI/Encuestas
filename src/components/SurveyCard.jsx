import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function SurveyCard({ nombre, datos }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const COLORS = ["#82ca9d", "#8884d8", "#ffc658", "#8dd1e1", "#ff8042"];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`bg-white shadow-md p-4 rounded-xl border border-blue-300 ${
        isExpanded ? "w-full" : ""
      }`}
      onClick={toggleExpand}
    >
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-bold text-center">{nombre}</h3>
        {!isExpanded && (
          <div className="mt-3 bg-blue-100 w-full p-2 rounded-md text-center">
            Haz clic para ver más detalles
          </div>
        )}
      </div>

      {isExpanded && datos && datos.length > 0 && (
        <div className="mt-4">
          {/* Gráfico de pastel */}
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
            <Legend />
          </PieChart>

          {/* Tabla de datos */}
          <table className="w-full mt-4 border-collapse border border-gray-300">
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
                  <td className="border border-gray-300 p-2">{dato.name}</td>
                  <td className="border border-gray-300 p-2">{dato.value}</td>
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
      )}

      {isExpanded && (!datos || datos.length === 0) && (
        <div className="mt-4 text-center text-red-500">
          No hay datos disponibles para esta pregunta.
        </div>
      )}
    </div>
  );
}
