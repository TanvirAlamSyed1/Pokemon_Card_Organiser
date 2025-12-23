/**
 * Restricts rarity to valid TCG categories.
 * This ensures your CSV and UI always use consistent naming.
 */
export type CardRarity = 
  | 'Common' 
  | 'Uncommon' 
  | 'Rare' 
  | 'Holo Rare' 
  | 'Ultra Rare' 
  | 'Secret Rare' 
  | 'Promo'
  | 'Unknown';

/**
 * The core interface for a Pokémon Card.
 * This matches what your Flask backend will send to the frontend.
 */
export interface PokemonCard {
  id: string;          // e.g., "base1-1"
  name: string;        // e.g., "Alakazam"
  set: string;         // e.g., "Base Set"
  number: string;      // e.g., "1/102"
  rarity: CardRarity;
  imageUrl: string;    // The URL for the card art preview
  type?: string[];     // e.g., ["Psychic"]
}

/**
 * Defines the structure of the API response from your Python server.
 */
export interface ScanResponse {
  success: boolean;
  card?: PokemonCard;  // Present if success is true
  error?: string;      // Present if success is false
  confidence: number;  // OCR accuracy score (0.0 to 1.0)
}