import type {
  PaginatedPokemon,
  Pokemon,
  PokemonDetail,
  PokemonDetailFull,
  PokemonNameEntry,
} from '../entities/pokemon';

export interface IPokemonRepository {
  /** Fetches a paginated list with full details (image + types). */
  getPokemonList(offset: number, limit: number): Promise<PaginatedPokemon>;

  /** Fetches complete detail for a single Pokémon by ID or name. */
  getPokemonDetail(idOrName: number | string): Promise<PokemonDetail>;

  /**
   * Fetches enriched detail including species data (description, genus)
   * and full evolution chain. Results are cached in-memory.
   */
  getPokemonDetailFull(idOrName: number | string): Promise<PokemonDetailFull>;

  /**
   * Searches Pokémon by partial name using the full names catalogue.
   * Returns lightweight entries (id + name + image + types).
   */
  searchByName(query: string): Promise<Pokemon[]>;

  /**
   * Fetches (and caches internally) the full catalogue of Pokémon names.
   * Used as the source for client-side search filtering.
   */
  getAllPokemonNames(): Promise<PokemonNameEntry[]>;
}
