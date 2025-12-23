import React, { useState } from 'react';
import { Scanner } from './components/Scanner';
import { CardList } from './components/CardList';
import { ExportButton } from './components/ExportButton';
import type { PokemonCard } from './types/pokemon';

const App: React.FC = () => {
  const [collection, setCollection] = useState<PokemonCard[]>([]);

  const handleNewCard = (card: PokemonCard) => {
    setCollection((prev) => [card, ...prev]);
  };

  const clearCollection = () => {
    if (window.confirm("Delete all scanned cards?")) {
      setCollection([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-red-500/30 pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Poké-Tracker
            </h1>
          </div>
          <div className="text-xs font-mono text-slate-500">
            SESSION_ID: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls (Fixed on Desktop) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Scanner Module */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl shadow-black/50">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Optical Scanner
              </h2>
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </div>
            {/* The Scanner Component sits here */}
            <Scanner onDetected={handleNewCard} />
          </div>

          {/* 2. Actions Module */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              Data Management
            </h2>
            <div className="space-y-3">
              <ExportButton cards={collection} />
              
              <button 
                onClick={clearCollection}
                className="w-full py-3 text-xs font-bold text-slate-500 hover:text-red-400 border border-dashed border-slate-800 hover:border-red-900/50 rounded-xl transition-all uppercase tracking-widest"
              >
                Reset Session
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Grid (Scrollable) */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl min-h-[600px] flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-baseline">
              <h2 className="text-2xl font-bold text-white">Collection Feed</h2>
              <span className="text-sm font-mono text-slate-400">
                {collection.length} CARD{collection.length !== 1 ? 'S' : ''}
              </span>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 p-6 bg-[#0B1120]">
              {collection.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <svg className="w-24 h-24 mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-lg font-medium">No cards scanned</p>
                  <p className="text-sm text-slate-500">Use the scanner to add to your list</p>
                </div>
              ) : (
                <CardList cards={collection} />
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;