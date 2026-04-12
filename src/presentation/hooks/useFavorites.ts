import { useCallback } from 'react';
import { useFavoriteStore } from '../store/favoriteStore';
import type { Pokemon } from '@/src/domain/entities/pokemon';

export function useFavorites() {
  const { favorites, toggleFavorite, isFavorite } = useFavoriteStore();

  const handleToggle = useCallback(
    (pokemon: Pokemon) => toggleFavorite(pokemon),
    [toggleFavorite],
  );

  return { favorites, isFavorite, toggleFavorite: handleToggle };
}
