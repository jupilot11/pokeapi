import type { IPokemonRepository } from '../repositories/IPokemonRepository';
import type { PokemonDetail } from '../entities/pokemon';

export class GetPokemonDetailUseCase {
  constructor(private readonly repository: IPokemonRepository) {}

  execute(idOrName: number | string): Promise<PokemonDetail> {
    return this.repository.getPokemonDetail(idOrName);
  }
}
