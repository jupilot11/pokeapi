export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonDetail extends Pokemon {
  height: number;
  weight: number;
  baseExperience: number;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
}

export interface PaginatedPokemon {
  items: Pokemon[];
  total: number;
  hasNextPage: boolean;
}

export interface PokemonNameEntry {
  id: number;
  name: string;
}
