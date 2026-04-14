import type { IPokemonRepository } from '../repositories/IPokemonRepository';
import type { PokemonDetailFull } from '../entities/pokemon';

export class GetPokemonDetailFullUseCase {
  constructor(private readonly repository: IPokemonRepository) {}

  execute(idOrName: number | string): Promise<PokemonDetailFull> {
    return this.repository.getPokemonDetailFull(idOrName);
  }
}
