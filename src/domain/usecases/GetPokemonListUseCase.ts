import type { IPokemonRepository } from '../repositories/IPokemonRepository';
import type { PaginatedPokemon } from '../entities/pokemon';
import { DEFAULT_LIMIT } from '@/src/core/constants/api';

export class GetPokemonListUseCase {
  constructor(private readonly repository: IPokemonRepository) {}

  execute(offset: number, limit = DEFAULT_LIMIT): Promise<PaginatedPokemon> {
    return this.repository.getPokemonList(offset, limit);
  }
}
