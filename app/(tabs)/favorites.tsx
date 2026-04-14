import { COLORS } from "@/src/core/constants/app";
import type { Pokemon } from "@/src/domain/entities/pokemon";
import { EmptyState } from "@/src/presentation/components/EmptyState";
import { PokemonCard } from "@/src/presentation/components/PokemonCard";
import { ScreenHeader } from "@/src/presentation/components/ScreenHeader";
import { SearchBar } from "@/src/presentation/components/SearchBar";
import { useFavorites } from "@/src/presentation/hooks/useFavorites";
import React, { useCallback } from "react";
import { FlatList, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom", "left", "right"]}
    >
      <ScreenHeader title="Favorites" />
      <SearchBar
        value={searchQuery}
        onChangeText={handleQueryChange}
        placeholder="Search favorites…"
      />
      <View style={styles.listContainer}>
        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.content}
          ListEmptyComponent={
            <EmptyState
              title="No favorites yet"
              message={emptyMessage}
              icon={isSearching ? "search-outline" : "heart-outline"}
            />
          }
          removeClippedSubviews
          windowSize={8}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentInsetAdjustmentBehavior={
            Platform.OS === "ios" ? "automatic" : undefined
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    flex: 1,
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
});
