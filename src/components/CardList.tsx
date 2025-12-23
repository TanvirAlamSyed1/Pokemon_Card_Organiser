import React from 'react';
import type { PokemonCard } from '../types/pokemon';

export const CardList: React.FC<{ cards: PokemonCard[] }> = ({ cards }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, idx) => (
        <div 
          key={`${card.id}-${idx}`}
          className="group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-slate-500 transition-all hover:shadow-2xl hover:-translate-y-1"
        >
          {/* Card Image Wrapper */}
          <div className="relative aspect-[3/4.2] bg-slate-900 flex items-center justify-center p-4">
            <img 
              src={card.imageUrl} 
              alt={card.name} 
              className="w-full h-full object-contain drop-shadow-2xl z-10"
              loading="lazy"
            />
            {/* Background Glow based on Type (Optional simplified version) */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
          </div>

          {/* Card Details */}
          <div className="p-3 relative z-20 bg-slate-800">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-slate-100 text-sm truncate pr-2">{card.name}</h3>
              <span className="text-[10px] text-slate-500 font-mono">#{card.number}</span>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] uppercase text-slate-400 tracking-wider truncate max-w-[50%]">
                {card.set}
              </span>
              <RarityBadge rarity={card.rarity} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper for Rarity Colors
const RarityBadge = ({ rarity }: { rarity: string }) => {
  let colorClass = "bg-slate-700 text-slate-300 border-slate-600";
  
  if (rarity?.includes("Rare")) colorClass = "bg-blue-900/50 text-blue-300 border-blue-700/50";
  if (rarity?.includes("Ultra") || rarity?.includes("V")) colorClass = "bg-purple-900/50 text-purple-300 border-purple-700/50";
  if (rarity?.includes("Secret") || rarity?.includes("Rainbow")) colorClass = "bg-yellow-900/30 text-yellow-300 border-yellow-700/50";

  return (
    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${colorClass}`}>
      {rarity || "Common"}
    </span>
  );
};