import { COLORS } from "@/src/core/constants/app";
import type { Pokemon } from "@/src/domain/entities/pokemon";
import { EmptyState } from "@/src/presentation/components/EmptyState";
import { ErrorState } from "@/src/presentation/components/ErrorState";
import { Loader } from "@/src/presentation/components/Loader";
import { PokemonCard } from "@/src/presentation/components/PokemonCard";
import { ScreenHeader } from "@/src/presentation/components/ScreenHeader";
import { SearchBar } from "@/src/presentation/components/SearchBar";
import { usePokemonList } from "@/src/presentation/hooks/usePokemonList";
import React, { useCallback } from "react";
import { FlatList, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PokedexScreen() {
  const {
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
    retry,
    retrySearch,
  } = usePokemonList();

  const renderItem = useCallback(
    ({ item }: { item: Pokemon }) => <PokemonCard pokemon={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Pokemon) => String(item.id), []);

  const ListFooter = useCallback(() => {
    if (isLoadingMore || isSearching) return <Loader size="small" />;
    return null;
  }, [isLoadingMore, isSearching]);

  const listEmpty =
    !isLoading && !isSearching ? (
      <EmptyState
        title={isSearchMode ? "No results" : "No Pokémon found"}
        message={
          isSearchMode
            ? `No Pokémon match "${searchQuery}".`
            : "Pull down to refresh."
        }
      />
    ) : null;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      <ScreenHeader title="Pokédex" />

      {/*
        SearchBar lives OUTSIDE FlatList so it is never unmounted when the
        list re-renders. Putting it inside ListHeaderComponent causes FlatList
        to recreate the component on every state change, which dismisses the
        keyboard after each character.
      */}
      <SearchBar
        value={searchQuery}
        onChangeText={handleQueryChange}
        placeholder="Search Pokémon by name…"
      />

      <View style={styles.listContainer}>
        {isLoading && displayList.length === 0 ? (
          <Loader fullScreen />
        ) : error && displayList.length === 0 ? (
          <ErrorState message={error} onRetry={retry} />
        ) : isSearchMode && isSearching && displayList.length === 0 ? (
          <Loader fullScreen />
        ) : isSearchMode && searchError ? (
          <ErrorState message={searchError} onRetry={retrySearch} />
        ) : (
          <FlatList
            data={displayList}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.content}
            ListFooterComponent={ListFooter}
            ListEmptyComponent={listEmpty}
            onEndReached={!isSearchMode ? loadMore : undefined}
            onEndReachedThreshold={0.4}
            removeClippedSubviews
            windowSize={8}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior={
              Platform.OS === "ios" ? "automatic" : undefined
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: Platform.OS === "ios" ? 100 : 24,
  },
  row: {
    justifyContent: "space-between",
    gap: 12,
  },
  listContainer: {
    flex: 1,
  },
});
