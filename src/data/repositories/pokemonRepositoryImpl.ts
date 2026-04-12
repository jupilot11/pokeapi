import type { IPokemonRepository } from '@/src/domain/repositories/IPokemonRepository';
import type {
  PaginatedPokemon,
  Pokemon,
  PokemonDetail,
  PokemonNameEntry,
} from '@/src/domain/entities/pokemon';
import type { PokemonDetailResponseDto } from '../models/pokemonApiModel';
import type { PokemonApiService } from '../services/pokemonApiService';
import {
  extractIdFromUrl,
  getPokemonImageUrl,
  formatName,
} from '@/src/core/utils/pokemon';
import { ALL_POKEMON_LIMIT } from '@/src/core/constants/api';

export class PokemonRepositoryImpl implements IPokemonRepository {
  /** In-memory cache of the full Pokémon name catalogue for search. */
  private namesCatalogue: PokemonNameEntry[] | null = null;

  constructor(private readonly apiService: PokemonApiService) {}

  async getPokemonList(offset: number, limit: number): Promise<PaginatedPokemon> {
    const listResponse = await this.apiService.fetchPokemonList(limit, offset);

    // Fetch all details in parallel to retrieve types and sprites per page
    const detailDtos = await Promise.all(
      listResponse.results.map((item) => {
        const id = extractIdFromUrl(item.url);
        return this.apiService.fetchPokemonDetail(id);
      }),
    );

    return {
      items: detailDtos.map(mapDetailToEntity),
      total: listResponse.count,
      hasNextPage: listResponse.next !== null,
    };
  }

  async getPokemonDetail(idOrName: number | string): Promise<PokemonDetail> {
    const dto = await this.apiService.fetchPokemonDetail(idOrName);
    return mapDetailToFullEntity(dto);
  }

  async getAllPokemonNames(): Promise<PokemonNameEntry[]> {
    if (this.namesCatalogue) return this.namesCatalogue;

    const response = await this.apiService.fetchPokemonList(
      ALL_POKEMON_LIMIT,
      0,
    );
    this.namesCatalogue = response.results.map((item) => ({
      id: extractIdFromUrl(item.url),
      name: item.name,
    }));
    return this.namesCatalogue;
  }

  async searchByName(query: string): Promise<Pokemon[]> {
    const catalogue = await this.getAllPokemonNames();
    const matched = catalogue
      .filter((entry) => entry.name.includes(query))
      .slice(0, 20);

    const detailDtos = await Promise.all(
      matched.map((entry) => this.apiService.fetchPokemonDetail(entry.id)),
    );
    return detailDtos.map(mapDetailToEntity);
  }
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

function mapDetailToEntity(dto: PokemonDetailResponseDto): Pokemon {
  return {
    id: dto.id,
    name: dto.name,
    imageUrl:
      dto.sprites.other['official-artwork'].front_default ??
      dto.sprites.front_default ??
      getPokemonImageUrl(dto.id),
    types: dto.types
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name),
  };
}

function mapDetailToFullEntity(dto: PokemonDetailResponseDto): PokemonDetail {
  return {
    ...mapDetailToEntity(dto),
    height: dto.height,
    weight: dto.weight,
    baseExperience: dto.base_experience,
    abilities: dto.abilities
      .sort((a, b) => a.slot - b.slot)
      .map((a) => ({
        name: formatName(a.ability.name),
        isHidden: a.is_hidden,
      })),
    stats: dto.stats.map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
  };
}
