import Tesseract from 'tesseract.js';
import type { PokemonCard, ScanResponse } from '../types/pokemon';

export const scanCardLocally = async (imageSource: string): Promise<ScanResponse> => {
  // 1. Perform OCR in the browser
  const { data: { text } } = await Tesseract.recognize(imageSource, 'eng');
  
  // 2. Extract Set Number (Regex to find patterns like 123/202)
  const setNumberMatch = text.match(/(\d+)\/(\d+)/);
  if (!setNumberMatch) {
    return { success: false, confidence: 0, error: "Could not find card number" };
  }

  // 3. Fetch directly from the Pokémon TCG API
  const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=number:${setNumberMatch[1]}`);
  const apiData = await response.json();

  if (apiData.data && apiData.data.length > 0) {
    const card = apiData.data[0];
    return {
      success: true,
      confidence: 1.0,
      card: {
        id: card.id,
        name: card.name,
        set: card.set.name,
        number: card.number,
        rarity: card.rarity || 'Unknown',
        imageUrl: card.images.small,
      }
    };
  }

  return { success: false, confidence: 0, error: "Card not found in database" };
};