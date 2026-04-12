/**
 * Dependency-injection container (service-locator pattern).
 *
 * Constructs the object graph once at module load time.
 * All stores and hooks import their use-cases from here so that
 * the data/domain layers remain decoupled from the presentation layer.
 */
import { PokemonApiService } from '@/src/data/services/pokemonApiService';
import { PokemonRepositoryImpl } from '@/src/data/repositories/pokemonRepositoryImpl';
import { GetPokemonListUseCase } from '@/src/domain/usecases/GetPokemonListUseCase';
import { GetPokemonDetailUseCase } from '@/src/domain/usecases/GetPokemonDetailUseCase';
import { SearchPokemonUseCase } from '@/src/domain/usecases/SearchPokemonUseCase';

// ── Infrastructure ──────────────────────────────────────────────────────────
const pokemonApiService = new PokemonApiService();
const pokemonRepository = new PokemonRepositoryImpl(pokemonApiService);

// ── Use Cases ───────────────────────────────────────────────────────────────
export const getPokemonListUseCase = new GetPokemonListUseCase(pokemonRepository);
export const getPokemonDetailUseCase = new GetPokemonDetailUseCase(pokemonRepository);
export const searchPokemonUseCase = new SearchPokemonUseCase(pokemonRepository);
