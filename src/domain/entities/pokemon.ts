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

/** A single stage in an evolution chain. */
export interface EvolutionStep {
  id: number;
  name: string;
  imageUrl: string;
  /** Level required to evolve from the previous stage; null for the base form. */
  minLevel: number | null;
}

export interface PokemonMove {
  name: string;
  levelLearned: number;
  learnMethod: string;
}

/** Full Pokémon detail including species data and evolution chain. */
export interface PokemonDetailFull extends PokemonDetail {
  description: string;
  genus: string;
  evolutionChain: EvolutionStep[];
  moves: PokemonMove[];
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
