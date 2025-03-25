import { PieChart } from "recharts";

export default function SurveyCard({ nombre }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-xl flex flex-col items-center border border-blue-300">
      <PieChart width={100} height={100}>
        {/* Aquí irían los datos reales de cada encuesta */}
      </PieChart>
      <div className="mt-3 bg-blue-100 w-full p-2 rounded-md text-center">
        {nombre}
      </div>
    </div>
  );
}
