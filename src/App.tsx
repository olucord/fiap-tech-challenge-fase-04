import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import AnalysisCard from './components/AnalysisCard';
import type { MarketAnalysis } from './types';
import { analyzeTicker } from './services/MarketService';

const App: React.FC = () => {
  const [data, setData] = useState<MarketAnalysis | null>(null);
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
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-fin-900 text-white selection:bg-fin-accent selection:text-white pb-20">
      
      {/* Navbar */}
      <nav className="w-full border-b border-fin-700 bg-fin-900/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-fin-accent p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 flex flex-col items-center">
        
        {/* Hero Section */}
        {!data && !loading && (
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4">
              Mais dados, melhores insights
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Digite aqui o ticker desejado
            </p>
          </div>
        )}

        <SearchBar onSearch={handleSearch} isLoading={loading} />

        {/* Content Area */}
        <div className="w-full flex justify-center">
          {error && (
            <div className="bg-red-500/10 border border-fin-sell text-fin-sell px-6 py-4 rounded-xl max-w-lg w-full text-center">
              <p className="font-semibold">A analise falhou</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          )}

          {data && !loading && <AnalysisCard data={data} />}
          
          {!data && !loading && !error && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl opacity-30 mt-8 pointer-events-none select-none filter blur-[1px]">
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