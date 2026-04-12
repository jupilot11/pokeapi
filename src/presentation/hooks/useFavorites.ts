import type { Pokemon } from "@/src/domain/entities/pokemon";
import { useCallback, useRef } from "react";
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
  } = useFavoriteStore();

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
      console.log({ query });
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
