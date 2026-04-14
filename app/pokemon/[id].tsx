import { COLORS, TYPE_COLORS } from "@/src/core/constants/app";
import { formatName, formatPokemonId } from "@/src/core/utils/pokemon";
import type { Pokemon } from "@/src/domain/entities/pokemon";
import { ErrorState } from "@/src/presentation/components/ErrorState";
import { Loader } from "@/src/presentation/components/Loader";
import { PokemonTypeTag } from "@/src/presentation/components/PokemonTypeTag";
import { useFavorites } from "@/src/presentation/hooks/useFavorites";
import { usePokemonDetail } from "@/src/presentation/hooks/usePokemonDetail";
import { usePokemonStore } from "@/src/presentation/store/pokemonStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBar, TabView } from "react-native-tab-view";

import { styles } from "@/src/presentation/components/details/styles";

import {
  AboutTab,
  EvolutionTab,
  MovesTab,
  StatsTab,
} from "@/src/presentation/components/details/DetailsTabs";
import {
  Animated,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

type Route = {
  key: string;
  title: string;
};

const IMAGE_SIZE = 150;

const routes = [
  { key: "about", title: "About" },
  { key: "stats", title: "Base Stats" },
  { key: "evolution", title: "Evolution" },
  { key: "moves", title: "Moves" },
];

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = usePokemonDetail(id);
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const pokemonList = usePokemonStore((s) => s.pokemonList);
  const insets = useSafeAreaInsets();
  const imageAnim = useRef(new Animated.Value(0)).current;

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  // Look up basic Pokémon data (id, name, imageUrl, types) from whichever
  // in-memory store already has it. This is available immediately on navigation
  // so we can render the hero before the full detail fetch completes.
  const numericId = parseInt(id ?? "0", 10);
  const basicData: Pokemon | null =
    pokemonList.find((p) => p.id === numericId) ??
    favorites.find((p) => p.id === numericId) ??
    null;

  // heroData is whatever we can show right now — full detail if loaded,
  // otherwise the lightweight list entry.
  const heroData = data ?? basicData;

  useEffect(() => {
    if (heroData) {
      Animated.spring(imageAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 55,
        friction: 9,
      }).start();
    }
  }, [!!heroData, imageAnim]); // eslint-disable-line react-hooks/exhaustive-deps

  // No data at all (deep link before list loads, or genuine error path)
  if (!heroData && isLoading) return <Loader fullScreen />;

  if (error || !heroData) {
    return (
      <ErrorState
        message={error ?? "Pokémon not found."}
        onRetry={() => router.back()}
      />
    );
  }

  const bgColor = TYPE_COLORS[heroData.types[0]] ?? COLORS.skeleton;
  const favorite = isFavorite(heroData.id);

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case "about":
        return <AboutTab data={data!} />;
      case "stats":
        return <StatsTab data={data!} />;
      case "evolution":
        return <EvolutionTab data={data!} bgColor={bgColor} />;
      case "moves":
        return <MovesTab moves={data!.moves} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: bgColor }]}>
      {/* Hero — always rendered as soon as basicData (or full data) is available */}
      <View style={[styles.hero, { paddingTop: insets.top + 8 }]}>
        {/* Pokéball watermark */}
        <View style={styles.pokeball} pointerEvents="none">
          <View style={styles.pokeballTop} />
          <View style={styles.pokeballBand} />
          <View style={styles.pokeballCenter} />
        </View>

        {/* App bar */}
        <View style={styles.appBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleFavorite(heroData)}
            style={styles.iconBtn}
            hitSlop={8}
          >
            <Ionicons
              name={favorite ? "heart" : "heart-outline"}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Name + ID */}
        <View style={styles.nameRow}>
          <Text style={styles.heroName} numberOfLines={1}>
            {formatName(heroData.name)}
          </Text>
          <Text style={styles.heroId}>{formatPokemonId(heroData.id)}</Text>
        </View>

        <View style={styles.typesGenusRow}>
          <View style={styles.typesRow}>
            {heroData.types.map((t) => (
              <PokemonTypeTag key={t} type={t} />
            ))}
          </View>
          {/* genus only exists on full PokemonDetailFull */}
          {data?.genus ? (
            <Text style={styles.genus}>{data.genus}</Text>
          ) : null}
        </View>

        <Animated.View
          style={[
            styles.imageWrapper,
            {
              opacity: imageAnim,
              transform: [
                {
                  scale: imageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.75, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            source={{ uri: heroData.imageUrl }}
            style={styles.heroImage}
            contentFit="contain"
            transition={300}
          />
        </Animated.View>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <View style={styles.imageSpacer} />

        {/* Show a spinner in the card while full detail is fetching,
            then swap in the TabView once data is ready. */}
        {!data ? (
          <Loader />
        ) : (
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                style={{
                  backgroundColor: "transparent",
                  elevation: 0,
                  shadowOpacity: 0,
                  marginBottom: 12,
                }}
                scrollEnabled={true}
                tabStyle={{ paddingHorizontal: 10, width: "auto" }}
                indicatorStyle={{
                  height: 3,
                  borderRadius: 2,
                  backgroundColor:
                    TYPE_COLORS[heroData.types[0]] ?? COLORS.primary,
                }}
                activeColor="#000"
                inactiveColor="#999"
              />
            )}
          />
        )}
      </View>
    </View>
  );
}
