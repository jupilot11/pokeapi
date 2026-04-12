export const API_BASE_URL = 'https://pokeapi.co/api/v2';
export const API_TIMEOUT_MS = 10_000;

export const DEFAULT_LIMIT = 20;
export const ALL_POKEMON_LIMIT = 2000;

export const ENDPOINTS = {
  pokemonList: (limit: number, offset: number) =>
    `/pokemon?limit=${limit}&offset=${offset}`,
  pokemonDetail: (idOrName: number | string) => `/pokemon/${idOrName}`,
} as const;

export const POKEMON_ARTWORK_URL = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
