import { COLORS, TYPE_COLORS } from "@/src/core/constants/app";
import { formatName, formatPokemonId } from "@/src/core/utils/pokemon";
import type { Pokemon } from "@/src/domain/entities/pokemon";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFavoriteStore } from "../store/favoriteStore";
import { FavoriteButton } from "./FavoriteButton";
import { PokemonTypeTag } from "./PokemonTypeTag";

interface Props {
  pokemon: Pokemon;
}

const CARD_WIDTH = (Dimensions.get("window").width - 48) / 2;

export const PokemonCard = React.memo(function PokemonCard({ pokemon }: Props) {
  const toggleFavorite = useFavoriteStore((s) => s.toggleFavorite);
  const favorite = useFavoriteStore(
    useCallback(
      (s) => s.favorites.some((f) => f.id === pokemon.id),
      [pokemon.id],
    ),
  );

  const bgColor =
    pokemon.types.length > 0
      ? (TYPE_COLORS[pokemon.types[0]] ?? COLORS.skeleton)
      : COLORS.skeleton;

  const handlePress = useCallback(() => {
    router.push(`/pokemon/${pokemon.id}`);
  }, [pokemon.id]);

  const handleFavorite = useCallback(() => {
    toggleFavorite(pokemon);
  }, [toggleFavorite, pokemon]);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bgColor }]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      {/* Pokéball watermark */}
      <View style={styles.pokeball} pointerEvents="none">
        <View style={styles.pokeballTop} />
        <View style={styles.pokeballBand} />
        <View style={styles.pokeballCenter} />
      </View>

      <View style={styles.header}>
        <Text style={styles.id}>{formatPokemonId(pokemon.id)}</Text>
        <FavoriteButton
          isFavorite={favorite}
          onToggle={handleFavorite}
          size={18}
        />
      </View>

      <Image
        source={{ uri: pokemon.imageUrl }}
        style={styles.image}
        contentFit="contain"
        transition={200}
      />

      <View style={styles.footer}>
        <Text style={styles.name} numberOfLines={1}>
          {formatName(pokemon.name)}
        </Text>
        <View style={styles.types}>
          {pokemon.types.map((t) => (
            <PokemonTypeTag key={t} type={t} size="sm" />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 5,
  },
  // Pokéball watermark (bottom-right corner)
  pokeball: {
    position: "absolute",
    bottom: -18,
    right: -18,
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: "hidden",
    opacity: 0.18,
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.9)",
  },
  pokeballTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  pokeballBand: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 7,
    backgroundColor: "rgba(255,255,255,0.95)",
    transform: [{ translateY: -3.5 }],
  },
  pokeballCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.95)",
    transform: [{ translateX: -9 }, { translateY: -9 }],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  id: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(0,0,0,0.3)",
    letterSpacing: 0.3,
  },
  image: {
    width: "100%",
    height: 96,
    alignSelf: "center",
  },
  footer: {
    marginTop: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 5,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  types: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: 4,
  },
});
