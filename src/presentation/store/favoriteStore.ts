import { create } from 'zustand';
import type { Pokemon } from '@/src/domain/entities/pokemon';
import { storage } from '@/src/core/utils/storage';
import { STORAGE_KEYS } from '@/src/core/constants/app';

interface FavoriteStore {
  favorites: Pokemon[];
  isHydrated: boolean;

  hydrate: () => Promise<void>;
  toggleFavorite: (pokemon: Pokemon) => Promise<void>;
  isFavorite: (id: number) => boolean;
}

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],
  isHydrated: false,

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

  isFavorite: (id) => get().favorites.some((p) => p.id === id),
}));
