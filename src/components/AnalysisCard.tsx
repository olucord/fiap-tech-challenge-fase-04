import React from 'react';
import { type MarketAnalysis, RecommendationType } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalysisCardProps {
  data: MarketAnalysis;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ data }) => {
  const getRecColor = (rec: RecommendationType) => {
    switch (rec) {
      case RecommendationType.BUY: return 'text-fin-buy border-fin-buy';
      case RecommendationType.SELL: return 'text-fin-sell border-fin-sell';
      default: return 'text-fin-hold border-fin-hold';
    }
  };

  const getRecBg = (rec: RecommendationType) => {
    switch (rec) {
      case RecommendationType.BUY: return 'bg-emerald-500/10';
      case RecommendationType.SELL: return 'bg-red-500/10';
      default: return 'bg-amber-500/10';
    }
  };

  const formatCurrency = (val: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(val);
  };

  const chartColor = data.recommendation === RecommendationType.SELL ? '#ef4444' : '#10b981';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-fin-800 rounded-2xl p-6 border border-fin-700 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{data.companyName}</h2>
          <span className="text-fin-accent font-mono text-lg">{data.ticker.toUpperCase()}</span>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-white">{formatCurrency(data.currentPrice, data.currency)}</p>
          <p className="text-gray-400 text-sm">Real-time Estimate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recommendation Panel */}
        <div className={`col-span-1 md:col-span-1 bg-fin-800 rounded-2xl p-6 border border-fin-700 shadow-xl flex flex-col justify-center items-center text-center ${getRecBg(data.recommendation)}`}>
          <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-2">Recommendation</p>
          <div className={`text-5xl font-black ${getRecColor(data.recommendation)} mb-2`}>
            {data.recommendation}
          </div>
          <div className="w-full bg-fin-900 h-2 rounded-full overflow-hidden mt-4">
            <div 
              className={`h-full ${data.recommendation === RecommendationType.SELL ? 'bg-fin-sell' : 'bg-fin-buy'}`} 
              style={{ width: `${data.confidenceScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">AI Confidence: {data.confidenceScore}%</p>
        </div>

        {/* Metrics Panel */}
        <div className="col-span-1 md:col-span-2 bg-fin-800 rounded-2xl p-6 border border-fin-700 shadow-xl">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-4">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-fin-900/50 p-4 rounded-xl">
              <p className="text-gray-500 text-xs">P/ L</p>
              <p className="text-white font-mono text-xl">{data.metrics.peRatio}</p>
            </div>
            <div className="bg-fin-900/50 p-4 rounded-xl">
              <p className="text-gray-500 text-xs">Div. Yield</p>
              <p className="text-white font-mono text-xl">{data.metrics.dividendYield}%</p>
            </div>
            <div className="bg-fin-900/50 p-4 rounded-xl">
              <p className="text-gray-500 text-xs">Valor de Mercado</p>
              <p className="text-white font-mono text-xl">{data.metrics.marketCap}</p>
            </div>
            <div className="bg-fin-900/50 p-4 rounded-xl">
              <p className="text-gray-500 text-xs">Volatividade</p>
              <p className="text-white font-mono text-xl">{data.metrics.volatility}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="bg-fin-800 rounded-2xl p-6 border border-fin-700 shadow-xl">
        <h3 className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-2">Relação de Análise</h3>
        <p className="text-gray-300 leading-relaxed">
          {data.reasoning}
        </p>
      </div>

      {/* Chart Section */}
      <div className="bg-fin-800 rounded-2xl p-6 border border-fin-700 shadow-xl h-80">
        <h3 className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-4">Metricas nos ultimos 30 dias</h3>
        <div className="w-full h-full pb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.history}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{fill: '#94a3b8', fontSize: 10}} 
                axisLine={false} 
                tickLine={false}
                minTickGap={30}
              />
              <YAxis 
                hide={false} 
                domain={['auto', 'auto']} 
                tick={{fill: '#94a3b8', fontSize: 10}}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={chartColor} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;