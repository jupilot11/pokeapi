import { POKEMON_ARTWORK_URL } from '../constants/api';

/** Extracts numeric ID from a PokéAPI resource URL, e.g. ".../pokemon/1/" → 1 */
export function extractIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, '').split('/');
  return parseInt(parts[parts.length - 1], 10);
}

/** Official artwork URL for a given Pokémon ID */
export function getPokemonImageUrl(id: number): string {
  return POKEMON_ARTWORK_URL(id);
}

/** Formats a numeric ID to a zero-padded string, e.g. 1 → "#001" */
export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

/** Converts hyphenated API names to Title Case, e.g. "bulba-saur" → "Bulba Saur" */
export function formatName(name: string): string {
  return name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
