import apiClient from './apiClient';
import { ENDPOINTS } from '@/src/core/constants/api';
import type {
  PokemonDetailResponseDto,
  PokemonListResponseDto,
} from '../models/pokemonApiModel';

export class PokemonApiService {
  async fetchPokemonList(
    limit: number,
    offset: number,
  ): Promise<PokemonListResponseDto> {
    const { data } = await apiClient.get<PokemonListResponseDto>(
      ENDPOINTS.pokemonList(limit, offset),
    );
    return data;
  }

  async fetchPokemonDetail(
    idOrName: number | string,
  ): Promise<PokemonDetailResponseDto> {
    const { data } = await apiClient.get<PokemonDetailResponseDto>(
      ENDPOINTS.pokemonDetail(idOrName),
    );
    return data;
  }
}
