import React from 'react';
import type { PokemonCard } from '../types/pokemon';

interface ExportButtonProps {
  cards: PokemonCard[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ cards }) => {
  const handleExport = () => {
    if (cards.length === 0) return;

    // 1. Define CSV Headers
    const headers = ['ID', 'Name', 'Set', 'Number', 'Rarity', 'Types'].join(',');

    // 2. Map card data to CSV rows
    const rows = cards.map(card => {
      // Escape quotes in data to prevent CSV breakage
      const safeData = [
        card.id,
        card.name,
        card.set,
        card.number,
        card.rarity,
        card.type?.join(' | ') || 'N/A'
      ].map(field => `"${String(field || '').replace(/"/g, '""')}"`);

      return safeData.join(',');
    });

    // 3. Combine headers and rows
    const csvContent = [headers, ...rows].join('\n');

    // 4. Create Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `pokemon_pulls_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 5. Cleanup memory
    URL.revokeObjectURL(url);
  };

  const isActive = cards.length > 0;

  return (
    <button
      onClick={handleExport}
      disabled={!isActive}
      className={`
        relative w-full group overflow-hidden rounded-xl p-[1px] transition-all duration-300
        ${isActive ? 'cursor-pointer hover:shadow-lg hover:shadow-blue-500/20' : 'cursor-not-allowed opacity-50'}
      `}
    >
      {/* 1. Gradient Border Effect (Invisible until active) */}
      <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transition-opacity duration-300 ${isActive ? 'opacity-100 group-hover:animate-pulse' : 'opacity-0'}`} />
      
      {/* 2. Button Content Container */}
      <div className="relative bg-slate-900 h-full rounded-xl px-4 py-3 flex items-center justify-center gap-3 border border-slate-800 group-hover:border-transparent transition-colors">
        
        {/* Fixed Icon Size (w-5 h-5) to prevent layout breakage */}
        <div className={`flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-600'}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
        </div>
        
        <span className={`font-bold text-sm tracking-wide uppercase ${isActive ? 'text-white' : 'text-slate-500'}`}>
          Export CSV
        </span>
        
        {/* Distinct Counter Badge */}
        {isActive && (
          <span className="bg-slate-800 text-blue-200 text-[10px] font-mono font-bold py-0.5 px-2 rounded border border-slate-700 shadow-sm">
            {cards.length}
          </span>
        )}
      </div>
    </button>
  );
};