import type { PokemonCard } from '../types/pokemon';

export const formatCardToCsvRow = (card: PokemonCard): string => {
  const fields = [
    card.id,
    card.name,
    card.set,
    card.number,
    card.rarity,
    card.type?.join(' | ') || 'N/A'
  ];
  
  // Wrap in quotes to handle names with commas
  return fields.map(field => `"${field}"`).join(',');
};