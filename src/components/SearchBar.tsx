import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (ticker: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mb-10">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-fin-accent to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-fin-800 rounded-xl p-2 border border-fin-700">
          <input
            type="text"
            className="w-full bg-transparent text-white p-3 outline-none placeholder-gray-500 font-mono uppercase text-lg"
            placeholder="Enter Ticker (e.g. AAPL)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              isLoading 
                ? 'bg-fin-700 text-gray-400 cursor-not-allowed' 
                : 'bg-fin-accent hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analisando
              </span>
            ) : (
              'Analyze'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;