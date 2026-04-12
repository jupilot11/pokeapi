import { COLORS } from "@/src/core/constants/app";
import type { Pokemon } from "@/src/domain/entities/pokemon";
import { EmptyState } from "@/src/presentation/components/EmptyState";
import { PokemonCard } from "@/src/presentation/components/PokemonCard";
import { SearchBar } from "@/src/presentation/components/SearchBar";
import { useFavorites } from "@/src/presentation/hooks/useFavorites";
import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Platform, StyleSheet } from "react-native";

export default function FavoritesScreen() {
  const { favorites, searchResults, error, searchQuery, handleQueryChange } =
    useFavorites();

  const renderItem = useCallback(
    ({ item }: { item: Pokemon }) => <PokemonCard pokemon={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Pokemon) => String(item.id), []);

  const isSearching = searchQuery.length > 0;
  const listData = isSearching ? searchResults : favorites;
  const emptyMessage = isSearching
    ? error || `No favorites match "${searchQuery}".`
    : "Tap the heart on any Pokémon to add it here.";

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleQueryChange}
        placeholder="Search Pokémon by name…"
      />
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <EmptyState title="No favorites yet" message={emptyMessage} />
        }
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={
          Platform.OS === "ios" ? "automatic" : undefined
        }
      />
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
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 100 : 24,
  },
  row: {
    justifyContent: "space-between",
    gap: 12,
  },
});
