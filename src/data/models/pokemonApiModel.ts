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
}
