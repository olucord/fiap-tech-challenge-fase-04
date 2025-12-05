import { type PredictionResponse, PredictionAction } from '../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface AnalysisCardProps {
  data: PredictionResponse;
}

export default function AnalysisCard({ data }: AnalysisCardProps) {
  const history = data.history.map((item) => ({
    date: item.Date,
    close: item.Close,
  }));

  const actionLabel =
    data.action === PredictionAction.BUY
      ? "Comprar"
      : data.action === PredictionAction.SELL
      ? "Vender"
      : "Manter";

  const actionColor =
    data.action === PredictionAction.BUY
      ? "bg-green-100 text-green-700 border-green-300"
      : data.action === PredictionAction.SELL
      ? "bg-red-100 text-red-700 border-red-300"
      : "bg-yellow-100 text-yellow-700 border-yellow-300";

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-lg border border-gray-200 space-y-6">

      {/* Título */}
      <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
        {data.ticker.toUpperCase()} — Análise do Modelo
      </h2>

      {/* Recomendação */}
      <div className="flex flex-col gap-2">
        <p className="text-gray-700 font-medium">Recomendação do Modelo:</p>

        <span
          className={`px-4 py-2 rounded-xl text-lg font-semibold inline-block border ${actionColor}`}
        >
          {actionLabel}
        </span>
      </div>

      {/* Gráfico */}
      <div className="h-64 rounded-xl bg-gray-50 p-2 border border-gray-200">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="closeColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#closeColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Preço previsto */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
        <p className="text-gray-700 text-lg font-medium">Última previsão numérica:</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">
          {data.prediction.toFixed(2)}
        </p>
      </div>

    </div>
  );
}
