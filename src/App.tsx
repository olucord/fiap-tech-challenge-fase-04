import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import AnalysisCard from './components/AnalysisCard';
import type { PredictionResponse } from './types';
import { analyzeTicker } from './services/MarketService';

const App: React.FC = () => {
  const [data, setData] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (ticker: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await analyzeTicker(ticker);
      setData(result);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-fin-900 to-fin-800 text-white selection:bg-fin-accent selection:text-white pb-20">

      {/* NAVBAR */}
      <nav className="w-full border-b border-fin-700 bg-fin-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-black/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-fin-accent/90 p-2.5 rounded-xl shadow-md shadow-fin-accent/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">StockPred</h1>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 flex flex-col items-center">

        {/* HERO (quando não há busca) */}
        {!data && !loading && (
          <div className="text-center mb-14 animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-sm mb-6">
              Insights que impulsionam decisões
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Pesquise qualquer ativo e obtenha uma análise rápida, clara e orientada por dados.
            </p>
          </div>
        )}

        {/* Search */}
        <SearchBar onSearch={handleSearch} isLoading={loading} />

        <div className="w-full flex justify-center mt-10">

          {/* ERROR BOX */}
          {error && (
            <div className="bg-red-500/10 border border-red-600/60 text-red-400 px-6 py-5 rounded-xl max-w-lg w-full text-center animate-fade-in">
              <p className="font-semibold text-lg">A análise falhou</p>
              <p className="text-sm opacity-80 mt-1">{error}</p>
            </div>
          )}

          {/* RESULT */}
          {data && !loading && (
            <div className="w-full max-w-3xl animate-fade-in-up">
              <AnalysisCard data={data} />
            </div>
          )}

          {/* PLACEHOLDER CARDS (antes de pesquisar) */}
          {!data && !loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl opacity-20 mt-8 pointer-events-none select-none filter blur-[1px] animate-fade-in">
              <div className="h-40 bg-fin-800 rounded-xl border border-fin-700"></div>
              <div className="h-40 bg-fin-800 rounded-xl border border-fin-700"></div>
              <div className="h-40 bg-fin-800 rounded-xl border border-fin-700"></div>
              <div className="col-span-1 md:col-span-3 h-64 bg-fin-800 rounded-xl border border-fin-700"></div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
