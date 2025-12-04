import React from 'react';
import { type PredictionResponse, PredictionAction } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalysisCardProps {
  data: PredictionResponse;
}

export default function AnalysisCard({ data }: AnalysisCardProps) {
  const history = data.history.map((item) => ({
    date: item.Date,
    close: item.Close,
  }));

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-md space-y-6">
      <h2 className="text-2xl font-semibold">{data.ticker} — Análise do Modelo</h2>

      {/* Ação Recomendada */}
      <div className="p-4 rounded-xl bg-gray-100">
        <p className="text-lg font-medium">Recomendação:</p>
        <p
          className={`text-2xl font-bold ${
            data.action === PredictionAction.BUY
              ? 'text-green-600'
              : data.action === PredictionAction.SELL
              ? 'text-red-600'
              : 'text-yellow-600'
          }`}
        >
          {data.action}
        </p>
      </div>

      {/* Gráfico */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="closeColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide={false} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="close" stroke="#8884d8" fillOpacity={1} fill="url(#closeColor)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Valor da Previsão */}
      <div className="p-4 rounded-xl bg-gray-100">
        <p className="text-lg font-medium">Preço previsto (último ponto):</p>
        <p className="text-2xl font-bold">{data.prediction.toFixed(2)}</p>
      </div>
    </div>
  );
}