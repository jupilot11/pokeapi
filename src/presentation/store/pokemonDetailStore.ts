import { create } from 'zustand';
import type { PokemonDetailFull } from '@/src/domain/entities/pokemon';
import { getPokemonDetailFullUseCase } from '@/src/di/container';
import { storage } from '@/src/core/utils/storage';
import { STORAGE_KEYS } from '@/src/core/constants/app';

interface PokemonDetailStore {
  /** Cache of enriched detail objects keyed by Pokémon ID. */
  cache: Record<number, PokemonDetailFull>;
  /** Currently active Pokémon ID being viewed. */
  currentId: number | null;
  isLoading: boolean;
  error: string | null;

  /** Fetch full detail for a given ID or name, serving from cache when available. */
  fetchPokemonDetail: (idOrName: number | string) => Promise<void>;
  /** Restore the cache from AsyncStorage on app start. */
  hydrateCache: () => Promise<void>;
}

export const usePokemonDetailStore = create<PokemonDetailStore>((set, get) => ({
  cache: {},
  currentId: null,
  isLoading: false,
  error: null,

  hydrateCache: async () => {
    const persisted = await storage.get<Record<number, PokemonDetailFull>>(
      STORAGE_KEYS.POKEMON_DETAIL_CACHE,
    );
    if (persisted) {
      set((state) => ({ cache: { ...persisted, ...state.cache } }));
    }
  },

  fetchPokemonDetail: async (idOrName) => {
    const parsedId =
      typeof idOrName === 'number' ? idOrName : parseInt(String(idOrName), 10);

    // Serve immediately from cache if we already have this Pokémon
    const existing = !isNaN(parsedId) ? get().cache[parsedId] : undefined;
    if (existing) {
      set({ currentId: existing.id, isLoading: false, error: null });
      return;
    }

    set({ isLoading: true, error: null, currentId: null });

    try {
      const data = await getPokemonDetailFullUseCase.execute(idOrName);

      set((state) => {
        const updatedCache = { ...state.cache, [data.id]: data };
        // Persist the updated cache to AsyncStorage (best-effort)
        storage.set(STORAGE_KEYS.POKEMON_DETAIL_CACHE, updatedCache);
        return {
          cache: updatedCache,
          currentId: data.id,
          isLoading: false,
          error: null,
        };
      });
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message });
    }
  },
}));
