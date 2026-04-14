import { debounce } from "@/src/core/utils/debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { usePokemonStore } from "../store/pokemonStore";

// Only fire a search after the user has stopped typing for this long
const SEARCH_DEBOUNCE_MS = 600;

export function usePokemonList() {
  const {
    pokemonList,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    fetchInitial,
    loadMore,
    setSearchQuery,
    search,
    clearSearch,
  } = usePokemonStore(
    useShallow((s) => ({
      pokemonList: s.pokemonList,
      isLoading: s.isLoading,
      isLoadingMore: s.isLoadingMore,
      error: s.error,
      hasNextPage: s.hasNextPage,
      searchQuery: s.searchQuery,
      searchResults: s.searchResults,
      isSearching: s.isSearching,
      searchError: s.searchError,
      fetchInitial: s.fetchInitial,
      loadMore: s.loadMore,
      setSearchQuery: s.setSearchQuery,
      search: s.search,
      clearSearch: s.clearSearch,
    })),
  );

  // Tracks the query that was actually submitted to the search use-case.
  // isSearchMode is based on this — not on searchQuery — so the list only
  // switches away from pokemonList after the debounce fires, not on every
  // keystroke.
  const [committedQuery, setCommittedQuery] = useState("");

  // Keep a ref to the latest search action so the debounced closure never
  // holds a stale reference (Zustand actions are stable, but this is safer).
  const searchRef = useRef(search);
  searchRef.current = search;

  const debouncedSearch = useRef(
    debounce((query: string) => {
      setCommittedQuery(query);
      searchRef.current(query);
    }, SEARCH_DEBOUNCE_MS),
  ).current;

  useEffect(() => {
    fetchInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cancel any pending debounced search on unmount so it never fires stale
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleQueryChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query.trim()) {
        debouncedSearch.cancel(); // stop the pending timer before it fires
        setCommittedQuery("");
        clearSearch();
        return;
      }
      debouncedSearch(query);
    },
    [setSearchQuery, clearSearch, debouncedSearch],
  );

  // Only enter search mode once the debounce has actually fired
  const isSearchMode = committedQuery.trim().length > 0;
  const displayList = isSearchMode ? searchResults : pokemonList;

  const retrySearch = useCallback(() => {
    if (committedQuery) search(committedQuery);
  }, [committedQuery, search]);

  return {
    displayList,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    searchQuery,
    isSearchMode,
    isSearching,
    searchError,
    loadMore,
    handleQueryChange,
    retry: fetchInitial,
    retrySearch,
  };
}
