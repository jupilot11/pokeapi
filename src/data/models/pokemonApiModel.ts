/** Shape of a single item in the /pokemon list endpoint. */
export interface PokemonListItemDto {
  name: string;
  url: string;
}

/** Response from GET /pokemon?limit=N&offset=N */
export interface PokemonListResponseDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItemDto[];
}

/** Response from GET /pokemon/{id|name} */
export interface PokemonDetailResponseDto {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string | null;
    other: {
      'official-artwork': {
        front_default: string | null;
      };
    };
  };
  types: Array<{
    slot: number;
    type: { name: string; url: string };
  }>;
  abilities: Array<{
    ability: { name: string; url: string };
    is_hidden: boolean;
    slot: number;
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: { name: string; url: string };
  }>;
  moves: Array<{
    move: { name: string; url: string };
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: { name: string; url: string };
      version_group: { name: string; url: string };
    }>;
  }>;
}

/** Response from GET /pokemon-species/{id|name} */
export interface PokemonSpeciesResponseDto {
  id: number;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string; url: string };
    version: { name: string; url: string };
  }>;
  genera: Array<{
    genus: string;
    language: { name: string; url: string };
  }>;
  evolution_chain: { url: string };
}

/** A single node in the evolution chain tree (recursive). */
export interface EvolutionChainLink {
  species: { name: string; url: string };
  evolves_to: EvolutionChainLink[];
  evolution_details: Array<{
    min_level: number | null;
    trigger: { name: string; url: string };
  }>;
}

/** Response from GET /evolution-chain/{id} */
export interface EvolutionChainResponseDto {
  id: number;
  chain: EvolutionChainLink;
}
