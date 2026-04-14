import type { Pokemon } from "@/src/domain/entities/pokemon";
import { useCallback, useRef } from "react";
import { useShallow } from "zustand/shallow";
import { useFavoriteStore } from "../store/favoriteStore";

export function useFavorites() {
  const {
    favorites,
    searchQuery,
    searchResults,
    error,
    setSearchQuery,
    toggleFavorite,
    isFavorite,
    search,
  } = useFavoriteStore(
    useShallow((s) => ({
      favorites: s.favorites,
      searchQuery: s.searchQuery,
      searchResults: s.searchResults,
      error: s.error,
      setSearchQuery: s.setSearchQuery,
      toggleFavorite: s.toggleFavorite,
      isFavorite: s.isFavorite,
      search: s.search,
    })),
  );

  const searchRef = useRef(search);
  searchRef.current = search;

  const handleToggle = useCallback(
    (pokemon: Pokemon) => toggleFavorite(pokemon),
    [toggleFavorite],
  );

  const handleQueryChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      searchRef.current(query);
    },
    [setSearchQuery],
  );

  return {
    favorites,
    searchResults,
    searchQuery,
    error,
    handleQueryChange,
    isFavorite,
    toggleFavorite: handleToggle,
  };
}
