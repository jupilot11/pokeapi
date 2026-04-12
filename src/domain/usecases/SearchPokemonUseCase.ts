import type { IPokemonRepository } from '../repositories/IPokemonRepository';
import type { Pokemon } from '../entities/pokemon';

export class SearchPokemonUseCase {
  constructor(private readonly repository: IPokemonRepository) {}

  async execute(query: string): Promise<Pokemon[]> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return this.repository.searchByName(normalized);
  }
}
