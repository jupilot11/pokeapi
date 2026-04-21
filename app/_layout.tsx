import { COLORS } from "@/src/core/constants/app";
import { useFavoriteStore } from "@/src/presentation/store/favoriteStore";
import { usePokemonDetailStore } from "@/src/presentation/store/pokemonDetailStore";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";

export default function RootLayout() {
  const hydrateFavorites = useFavoriteStore((s) => s.hydrate);
  const hydrateDetailCache = usePokemonDetailStore((s) => s.hydrateCache);

  // Restore persisted data from AsyncStorage on first mount
  useEffect(() => {
    hydrateFavorites();
    hydrateDetailCache();
  }, [hydrateFavorites, hydrateDetailCache]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="pokemon/[id]"
          options={{
            headerShown: false,
            statusBarStyle: "light",
            animation: "fade",
            contentStyle: { backgroundColor: COLORS.background },
          }}
        />
      </Stack>
    </View>
  );
}
