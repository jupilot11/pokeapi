import { useEffect } from 'react';
import { usePokemonDetailStore } from '@/src/presentation/store/pokemonDetailStore';
import type { PokemonDetailFull } from '@/src/domain/entities/pokemon';

interface DetailState {
  data: PokemonDetailFull | null;
  isLoading: boolean;
  error: string | null;
}

export function usePokemonDetail(idOrName: string | number): DetailState {
  const { cache, currentId, isLoading, error, fetchPokemonDetail } =
    usePokemonDetailStore();

  useEffect(() => {
    // idOrName can be briefly undefined during Expo Router back-navigation
    // transitions; skip the fetch entirely to avoid resetting screen state.
    if (!idOrName) return;
    fetchPokemonDetail(idOrName);
  }, [idOrName]); // eslint-disable-line react-hooks/exhaustive-deps

  const data = currentId != null ? (cache[currentId] ?? null) : null;

  return { data, isLoading, error };
}
