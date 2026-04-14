export const STORAGE_KEYS = {
  FAVORITES: "@pokeapi:favorites",
} as const;

/** Pokémon type → background color mapping */
export const TYPE_COLORS: Record<string, string> = {
  normal: "#b9b974",
  fire: "#fc6c6d",
  water: "#75bfff",
  electric: "#f1ef67",
  grass: "#49d0b0",
  ice: "#98D8D8",
  fighting: "#e65850",
  poison: "#ce5cce",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#adec79",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

/** Base stat name → display label */
export const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "Sp.ATK",
  "special-defense": "Sp.DEF",
  speed: "SPD",
};

/** Base stat name → bar color */
export const STAT_COLORS: Record<string, string> = {
  hp: "#FF5959",
  attack: "#F5AC78",
  defense: "#FAE078",
  "special-attack": "#9DB7F5",
  "special-defense": "#A7DB8D",
  speed: "#FA92B2",
};

export const COLORS = {
  primary: "#CC0000",
  background: "#F2F2F2",
  card: "#FFFFFF",
  textPrimary: "#1A1A1A",
  textSecondary: "#757575",
  border: "#E0E0E0",
  skeleton: "#E0E0E0",
} as const;
