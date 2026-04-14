import { STORAGE_KEYS } from "@/src/core/constants/app";
import { storage } from "@/src/core/utils/storage";
import type { Pokemon } from "@/src/domain/entities/pokemon";
import { create } from "zustand";

interface FavoriteStore {
  favorites: Pokemon[];
  error: string | null;
  searchQuery: string;
  searchResults: Pokemon[];
  isHydrated: boolean;

  setSearchQuery: (query: string) => void;
  search: (query: string) => Promise<void>;
  hydrate: () => Promise<void>;
  toggleFavorite: (pokemon: Pokemon) => Promise<void>;
  isFavorite: (id: number) => boolean;
}

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],
  isHydrated: false,
  searchQuery: "",
  searchResults: [],
  error: null,

  setSearchQuery: (query) => set({ searchQuery: query }),

  /** Called once on app start to restore persisted favorites. */
  hydrate: async () => {
    const stored = await storage.get<Pokemon[]>(STORAGE_KEYS.FAVORITES);
    set({ favorites: stored ?? [], isHydrated: true });
  },

  toggleFavorite: async (pokemon) => {
    const current = get().favorites;
    const exists = current.some((p) => p.id === pokemon.id);
    const updated = exists
      ? current.filter((p) => p.id !== pokemon.id)
      : [...current, pokemon];

    set({ favorites: updated });
    await storage.set(STORAGE_KEYS.FAVORITES, updated);
  },

  search: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], error: null });
      return;
    }
    const current = get().favorites;
    const results = current.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()),
    );
    set({
      searchResults: results,
      error: results.length === 0 ? `No favorites match "${query}".` : null,
    });
  },

  isFavorite: (id) => get().favorites.some((p) => p.id === id),
}));
