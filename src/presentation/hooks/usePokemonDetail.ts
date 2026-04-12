import { useState, useEffect } from 'react';
import type { PokemonDetail } from '@/src/domain/entities/pokemon';
import { getPokemonDetailUseCase } from '@/src/di/container';

interface State {
  data: PokemonDetail | null;
  isLoading: boolean;
  error: string | null;
}

export function usePokemonDetail(idOrName: string | number) {
  const [state, setState] = useState<State>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, isLoading: true, error: null });

    getPokemonDetailUseCase
      .execute(idOrName)
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((e: Error) => {
        if (!cancelled)
          setState({ data: null, isLoading: false, error: e.message });
      });

    return () => {
      cancelled = true;
    };
  }, [idOrName]);

  return state;
}
