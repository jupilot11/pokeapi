import { COLORS, TYPE_COLORS } from "@/src/core/constants/app";
import { formatName, formatPokemonId } from "@/src/core/utils/pokemon";
import { ErrorState } from "@/src/presentation/components/ErrorState";
import { Loader } from "@/src/presentation/components/Loader";
import { PokemonTypeTag } from "@/src/presentation/components/PokemonTypeTag";
import { StatBar } from "@/src/presentation/components/StatBar";
import { useFavorites } from "@/src/presentation/hooks/useFavorites";
import { usePokemonDetail } from "@/src/presentation/hooks/usePokemonDetail";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = usePokemonDetail(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const insets = useSafeAreaInsets();

  if (isLoading) return <Loader fullScreen />;
  if (error || !data) {
    return (
      <ErrorState
        message={error ?? "Pokémon not found."}
        onRetry={() => router.back()}
      />
    );
  }

  const bgColor = TYPE_COLORS[data.types[0]] ?? COLORS.skeleton;
  const favorite = isFavorite(data.id);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero section */}
      <View
        style={[
          styles.hero,
          { backgroundColor: bgColor, paddingTop: insets.top + 8 },
        ]}
      >
        {/* Appbar row */}
        <View style={styles.appBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => toggleFavorite(data)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={favorite ? "heart" : "heart-outline"}
              size={26}
              color={"#fff"}
            />
          </TouchableOpacity>
        </View>

        {/* Name + ID row */}
        <View style={styles.nameRow}>
          <Text style={styles.heroName}>{formatName(data.name)}</Text>
          <Text style={styles.idLabel}>{formatPokemonId(data.id)}</Text>
        </View>

        <View style={styles.typesRow}>
          {data.types.map((t) => (
            <PokemonTypeTag key={t} type={t} />
          ))}
        </View>

        <Image
          source={{ uri: data.imageUrl }}
          style={styles.heroImage}
          contentFit="contain"
          transition={300}
        />
      </View>

      {/* Detail card */}
      <View style={styles.card}>
        {/* Measurements */}
        <View style={styles.measureRow}>
          <View style={styles.measure}>
            <Text style={styles.measureValue}>
              {(data.height / 10).toFixed(1)} m
            </Text>
            <Text style={styles.measureLabel}>Height</Text>
          </View>
          <View style={styles.measureDivider} />
          <View style={styles.measure}>
            <Text style={styles.measureValue}>
              {(data.weight / 10).toFixed(1)} kg
            </Text>
            <Text style={styles.measureLabel}>Weight</Text>
          </View>
          <View style={styles.measureDivider} />
          <View style={styles.measure}>
            <Text style={styles.measureValue}>{data.baseExperience}</Text>
            <Text style={styles.measureLabel}>Base EXP</Text>
          </View>
        </View>

        <SectionTitle>Abilities</SectionTitle>
        <View style={styles.abilitiesGrid}>
          {data.abilities.map((a) => (
            <View
              key={a.name}
              style={[styles.abilityChip, a.isHidden && styles.hiddenChip]}
            >
              <Text
                style={[styles.abilityText, a.isHidden && styles.hiddenText]}
              >
                {a.name}
                {a.isHidden ? " (Hidden)" : ""}
              </Text>
            </View>
          ))}
        </View>

        <SectionTitle>Base Stats</SectionTitle>
        {data.stats.map((s) => (
          <StatBar key={s.name} name={s.name} value={s.value} />
        ))}
      </View>
    </ScrollView>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children as string}</Text>;
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 40 },

  // Hero
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 0,
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 4,
  },
  idLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  heroName: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    flexShrink: 1,
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  typesRow: {
    flexDirection: "row",
    marginTop: 10,
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
  },
  heroImage: {
    width: 200,
    height: 200,
    marginTop: 8,
  },

  // Detail card
  card: {
    backgroundColor: COLORS.card,
    marginTop: -24,
    marginHorizontal: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },

  // Measurements
  measureRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 28,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
    borderRadius: 16,
  },
  measure: { alignItems: "center", flex: 1 },
  measureValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  measureLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  measureDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },

  // Abilities
  abilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  abilityChip: {
    backgroundColor: "#EEF2FF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  hiddenChip: {
    backgroundColor: "#FFF3F3",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#FFAAAA",
  },
  abilityText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3B4CCA",
  },
  hiddenText: { color: "#CC4444" },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 12,
    padding: 3,
  },
});
