import type { IPokemonRepository } from '@/src/domain/repositories/IPokemonRepository';
import type {
  PaginatedPokemon,
  Pokemon,
  PokemonDetail,
  PokemonDetailFull,
  PokemonNameEntry,
  EvolutionStep,
  PokemonMove,
} from '@/src/domain/entities/pokemon';
import type {
  PokemonDetailResponseDto,
  PokemonSpeciesResponseDto,
  EvolutionChainResponseDto,
  EvolutionChainLink,
} from '../models/pokemonApiModel';
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
  /** In-memory cache of raw detail DTOs keyed by Pokémon ID. */
  private detailCache = new Map<number, PokemonDetailResponseDto>();
  /** In-memory cache of fully-enriched detail objects keyed by Pokémon ID. */
  private fullDetailCache = new Map<number, PokemonDetailFull>();

  constructor(private readonly apiService: PokemonApiService) {}

  private async fetchDetail(id: number): Promise<PokemonDetailResponseDto> {
    const cached = this.detailCache.get(id);
    if (cached) return cached;
    const dto = await this.apiService.fetchPokemonDetail(id);
    this.detailCache.set(id, dto);
    return dto;
  }

  async getPokemonList(offset: number, limit: number): Promise<PaginatedPokemon> {
    const listResponse = await this.apiService.fetchPokemonList(limit, offset);

    // Fetch all details in parallel to retrieve types and sprites per page.
    // fetchDetail serves cached entries instantly, so revisited pages cost 0 extra requests.
    const detailDtos = await Promise.all(
      listResponse.results.map((item) => this.fetchDetail(extractIdFromUrl(item.url))),
    );

    return {
      items: detailDtos.map(mapDetailToEntity),
      total: listResponse.count,
      hasNextPage: listResponse.next !== null,
    };
  }

  async getPokemonDetail(idOrName: number | string): Promise<PokemonDetail> {
    const id = typeof idOrName === 'number' ? idOrName : parseInt(idOrName, 10);
    const dto = isNaN(id)
      ? await this.apiService.fetchPokemonDetail(idOrName)
      : await this.fetchDetail(id);
    return mapDetailToFullEntity(dto);
  }

  async getPokemonDetailFull(idOrName: number | string): Promise<PokemonDetailFull> {
    const id = typeof idOrName === 'number' ? idOrName : parseInt(idOrName, 10);
    const dto = isNaN(id)
      ? await this.apiService.fetchPokemonDetail(idOrName)
      : await this.fetchDetail(id);

    const pokemonId = dto.id;

    // Serve from in-memory cache if available
    const cached = this.fullDetailCache.get(pokemonId);
    if (cached) return cached;

    // Species must be fetched first to get the evolution chain URL
    let species: PokemonSpeciesResponseDto | null = null;
    let evoChain: EvolutionChainResponseDto | null = null;

    try {
      species = await this.apiService.fetchPokemonSpecies(pokemonId);
      const evoChainId = extractIdFromUrl(species.evolution_chain.url);
      evoChain = await this.apiService.fetchEvolutionChain(evoChainId);
    } catch {
      // Degrade gracefully — species/evolution data is supplemental
    }

    const full = mapToDetailFull(dto, species, evoChain);
    this.fullDetailCache.set(pokemonId, full);
    return full;
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
      matched.map((entry) => this.fetchDetail(entry.id)),
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

function mapToDetailFull(
  dto: PokemonDetailResponseDto,
  species: PokemonSpeciesResponseDto | null,
  evoChain: EvolutionChainResponseDto | null,
): PokemonDetailFull {
  const base = mapDetailToFullEntity(dto);

  // Collect all unique English flavor texts; clean special whitespace characters from the API
  const descriptions = Array.from(
    new Set(
      (species?.flavor_text_entries ?? [])
        .filter((e) => e.language.name === 'en')
        .map((e) =>
          e.flavor_text.replace(/[\n\f\u000c\u00ad]/g, ' ').replace(/\s+/g, ' ').trim(),
        )
        .filter(Boolean),
    ),
  );

  // Extract English genus (e.g. "Seed Pokémon")
  const genusEntry = species?.genera.find((g) => g.language.name === 'en');
  const genus = genusEntry?.genus ?? '';

  // Parse evolution chain into a flat ordered list
  const evolutionChain = evoChain ? parseEvolutionChain(evoChain.chain) : [];

  // Collect level-up moves, deduplicated and sorted by level
  const seenMoves = new Set<string>();
  const moves: PokemonMove[] = dto.moves
    .flatMap((m) => {
      const levelUpEntries = m.version_group_details.filter(
        (d) => d.move_learn_method.name === 'level-up',
      );
      if (levelUpEntries.length === 0) return [];
      // Pick the minimum level across all game versions for this move
      const levelLearned = Math.min(...levelUpEntries.map((d) => d.level_learned_at));
      const name = formatName(m.move.name);
      if (seenMoves.has(name)) return [];
      seenMoves.add(name);
      return [{ name, levelLearned, learnMethod: 'level-up' }];
    })
    .sort((a, b) => a.levelLearned - b.levelLearned);

  return { ...base, descriptions, genus, evolutionChain, moves };
}

/**
 * Recursively flattens the nested evolution chain tree into an ordered array.
 * Follows the first branch at each node (handles most main-series chains).
 */
function parseEvolutionChain(
  link: EvolutionChainLink,
  minLevel: number | null = null,
): EvolutionStep[] {
  const id = extractIdFromUrl(link.species.url);
  const current: EvolutionStep = {
    id,
    name: link.species.name,
    imageUrl: getPokemonImageUrl(id),
    minLevel,
  };

  if (link.evolves_to.length === 0) return [current];

  const nextLink = link.evolves_to[0];
  const nextMinLevel = nextLink.evolution_details[0]?.min_level ?? null;

  return [current, ...parseEvolutionChain(nextLink, nextMinLevel)];
}
