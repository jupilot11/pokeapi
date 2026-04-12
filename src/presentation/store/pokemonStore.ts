import { create } from 'zustand';
import type { Pokemon } from '@/src/domain/entities/pokemon';
import {
  getPokemonListUseCase,
  searchPokemonUseCase,
} from '@/src/di/container';
import { DEFAULT_LIMIT } from '@/src/core/constants/api';

interface PokemonStore {
  // ── List state ─────────────────────────────────────────────────────────────
  pokemonList: Pokemon[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasNextPage: boolean;
  offset: number;

  // ── Search state ───────────────────────────────────────────────────────────
  searchQuery: string;
  searchResults: Pokemon[];
  isSearching: boolean;
  searchError: string | null;
  /** Incremented on every new search; used to discard stale in-flight results. */
  searchToken: number;

  // ── Actions ────────────────────────────────────────────────────────────────
  fetchInitial: () => Promise<void>;
  loadMore: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export const usePokemonStore = create<PokemonStore>((set, get) => ({
  // ── List defaults ──────────────────────────────────────────────────────────
  pokemonList: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  hasNextPage: true,
  offset: 0,

  // ── Search defaults ────────────────────────────────────────────────────────
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  searchError: null,
  searchToken: 0,

  // ── fetchInitial ───────────────────────────────────────────────────────────
  fetchInitial: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const result = await getPokemonListUseCase.execute(0, DEFAULT_LIMIT);
      set({
        pokemonList: result.items,
        hasNextPage: result.hasNextPage,
        offset: DEFAULT_LIMIT,
        isLoading: false,
      });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  // ── loadMore (infinite scroll) ─────────────────────────────────────────────
  loadMore: async () => {
    const { isLoadingMore, hasNextPage, offset } = get();
    if (isLoadingMore || !hasNextPage) return;
    set({ isLoadingMore: true });
    try {
      const result = await getPokemonListUseCase.execute(offset, DEFAULT_LIMIT);
      set((state) => ({
        pokemonList: [...state.pokemonList, ...result.items],
        hasNextPage: result.hasNextPage,
        offset: state.offset + DEFAULT_LIMIT,
        isLoadingMore: false,
      }));
    } catch (e) {
      set({ isLoadingMore: false, error: (e as Error).message });
    }
  },

  // ── Search ─────────────────────────────────────────────────────────────────
  setSearchQuery: (query) => set({ searchQuery: query }),

  search: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], searchError: null, isSearching: false });
      return;
    }
    const token = get().searchToken + 1;
    set({ isSearching: true, searchError: null, searchToken: token });
    try {
      const results = await searchPokemonUseCase.execute(query);
      // Discard if a newer search has started since this one was dispatched
      if (get().searchToken !== token) return;
      set({ searchResults: results, isSearching: false });
    } catch (e) {
      if (get().searchToken !== token) return;
      set({ searchError: (e as Error).message, isSearching: false });
    }
  },

  clearSearch: () =>
    set((state) => ({
      searchQuery: '',
      searchResults: [],
      searchError: null,
      isSearching: false,
      // Increment the token so any in-flight request is silently discarded
      searchToken: state.searchToken + 1,
    })),
}));
