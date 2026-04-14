import { COLORS, TYPE_COLORS } from "@/src/core/constants/app";
import { formatName, formatPokemonId } from "@/src/core/utils/pokemon";
import type {
  PokemonDetailFull,
  PokemonMove,
} from "@/src/domain/entities/pokemon";
import { ErrorState } from "@/src/presentation/components/ErrorState";
import { EvolutionChain } from "@/src/presentation/components/EvolutionChain";
import { Loader } from "@/src/presentation/components/Loader";
import { PokemonTypeTag } from "@/src/presentation/components/PokemonTypeTag";
import { StatBar } from "@/src/presentation/components/StatBar";
import { useFavorites } from "@/src/presentation/hooks/useFavorites";
import { usePokemonDetail } from "@/src/presentation/hooks/usePokemonDetail";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Tab configuration ────────────────────────────────────────────────────────

const TABS = ["About", "Base Stats", "Evolution", "Moves"] as const;
type Tab = (typeof TABS)[number];

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_WIDTH = SCREEN_WIDTH / TABS.length;

const IMAGE_SIZE = 200;
// How far the image dips below the hero into the card
const IMAGE_OVERLAP = IMAGE_SIZE / 2;
// The card's visible curve height
const CARD_RADIUS = 40;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = usePokemonDetail(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<Tab>("About");

  const imageAnim = useRef(new Animated.Value(0)).current;
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (data) {
      Animated.spring(imageAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 55,
        friction: 9,
      }).start();
    }
  }, [data, imageAnim]);

  const handleTabChange = (tab: Tab) => {
    const index = TABS.indexOf(tab);
    setActiveTab(tab);
    Animated.spring(indicatorAnim, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  };

  if (isLoading && !data) return <Loader fullScreen />;

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
    /**
     * ScrollView carries the type color as its background.
     * The hero view is TRANSPARENT — this is critical so the card's rounded
     * white top corners are visible against the type color, creating the
     * curve in the reference design.
     */
    <ScrollView
      style={[styles.scroll, { backgroundColor: bgColor }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero (transparent bg — type color comes from ScrollView) ──────── */}
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
            onPress={() => toggleFavorite(data)}
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
            {formatName(data.name)}
          </Text>
          <Text style={styles.heroId}>{formatPokemonId(data.id)}</Text>
        </View>

        {/* Type badges */}
        <View style={styles.typesRow}>
          {data.types.map((t) => (
            <PokemonTypeTag key={t} type={t} />
          ))}
        </View>

        {/* Genus subtitle */}
        {data.genus ? <Text style={styles.genus}>{data.genus}</Text> : null}

        {/* Pokémon artwork — in normal flow at the bottom of the hero.
            Because the hero has zIndex > card, this image renders above
            the white card even though the card pulls up behind it. */}
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
            source={{ uri: data.imageUrl }}
            style={styles.heroImage}
            contentFit="contain"
            transition={300}
          />
        </Animated.View>
      </View>

      {/* ── Detail card ───────────────────────────────────────────────────── */}
      {/*
       * marginTop: -IMAGE_OVERLAP  → card top aligns with image midpoint
       * borderRadius: CARD_RADIUS  → the white curve visible vs type color
       * zIndex: 1                  → renders below the hero (zIndex 2)
       */}
      <View style={styles.card}>
        {/* Reserve vertical space so the first real content clears the image */}
        <View style={styles.imageSpacer} />

        {/* ── Tab bar ───────────────────────────────────────────────────── */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabItem}
              onPress={() => handleTabChange(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab && {
                    color: bgColor,
                    fontWeight: "800",
                  },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Sliding underline indicator */}
          <Animated.View
            style={[
              styles.tabIndicator,
              { backgroundColor: bgColor },
              { transform: [{ translateX: indicatorAnim }] },
            ]}
          />
        </View>

        {/* ── Tab content ───────────────────────────────────────────────── */}
        <View style={styles.tabContent}>
          {activeTab === "About" && <AboutTab data={data} />}
          {activeTab === "Base Stats" && <StatsTab data={data} />}
          {activeTab === "Evolution" && (
            <EvolutionTab data={data} bgColor={bgColor} />
          )}
          {activeTab === "Moves" && <MovesTab moves={data.moves} />}
        </View>
      </View>
    </ScrollView>
  );
}

// ─── About tab ───────────────────────────────────────────────────────────────

function AboutTab({ data }: { data: PokemonDetailFull }) {
  return (
    <View>
      {data.description ? (
        <Text style={styles.description}>{data.description}</Text>
      ) : null}

      <View style={styles.measureRow}>
        <MeasureItem
          value={`${(data.height / 10).toFixed(1)} m`}
          label="Height"
          icon="resize-outline"
        />
        <View style={styles.measureDivider} />
        <MeasureItem
          value={`${(data.weight / 10).toFixed(1)} kg`}
          label="Weight"
          icon="barbell-outline"
        />
        <View style={styles.measureDivider} />
        <MeasureItem
          value={String(data.baseExperience)}
          label="Base EXP"
          icon="star-outline"
        />
      </View>

      <SectionTitle>Abilities</SectionTitle>
      <View style={styles.abilitiesGrid}>
        {data.abilities.map((a) => (
          <View
            key={a.name}
            style={[styles.abilityChip, a.isHidden && styles.hiddenChip]}
          >
            <Text style={[styles.abilityText, a.isHidden && styles.hiddenText]}>
              {a.name}
              {a.isHidden ? " (Hidden)" : ""}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Stats tab ───────────────────────────────────────────────────────────────

function StatsTab({ data }: { data: PokemonDetailFull }) {
  const total = data.stats.reduce((sum, s) => sum + s.value, 0);
  return (
    <View>
      {data.stats.map((s) => (
        <StatBar key={s.name} name={s.name} value={s.value} />
      ))}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{total}</Text>
      </View>
    </View>
  );
}

// ─── Evolution tab ────────────────────────────────────────────────────────────

function EvolutionTab({
  data,
  bgColor,
}: {
  data: PokemonDetailFull;
  bgColor: string;
}) {
  return (
    <View>
      <SectionTitle>Evolution Chain</SectionTitle>
      <EvolutionChain chain={data.evolutionChain} typeColor={bgColor} />
    </View>
  );
}

// ─── Moves tab ────────────────────────────────────────────────────────────────

function MovesTab({ moves }: { moves: PokemonMove[] }) {
  if (moves.length === 0) {
    return (
      <View style={styles.emptyMoves}>
        <Text style={styles.emptyMovesText}>No level-up moves found.</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.moveHeader}>
        <Text
          style={[styles.moveCell, styles.moveCellLvl, styles.moveHeaderText]}
        >
          Lv
        </Text>
        <Text
          style={[styles.moveCell, styles.moveCellName, styles.moveHeaderText]}
        >
          Move
        </Text>
      </View>

      {moves.map((move, index) => (
        <View
          key={`${move.name}-${index}`}
          style={[styles.moveRow, index % 2 === 0 && styles.moveRowAlt]}
        >
          <Text
            style={[styles.moveCell, styles.moveCellLvl, styles.moveLvlText]}
          >
            {move.levelLearned === 0 ? "—" : move.levelLearned}
          </Text>
          <Text
            style={[styles.moveCell, styles.moveCellName, styles.moveNameText]}
          >
            {move.name}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function MeasureItem({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}) {
  return (
    <View style={styles.measure}>
      <Ionicons
        name={icon}
        size={15}
        color={COLORS.textSecondary}
        style={styles.measureIcon}
      />
      <Text style={styles.measureValue}>{value}</Text>
      <Text style={styles.measureLabel}>{label}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  /**
   * The ScrollView carries the type color. The hero is transparent so the
   * card's white curved top is visible against the type color background.
   */
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 48 },

  // ── Hero (transparent) ───────────────────────────────────────────────────────
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 0,
    // NO backgroundColor — type color comes from ScrollView
    zIndex: 2,
    elevation: 2,
  },

  // Pokéball watermark (absolute inside hero)
  pokeball: {
    position: "absolute",
    right: -30,
    top: 60,
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
    opacity: 0.15,
    borderWidth: 7,
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
    height: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    transform: [{ translateY: -5 }],
  },
  pokeballCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },

  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 8,
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
  heroId: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    marginLeft: 8,
  },
  typesRow: {
    flexDirection: "row",
    marginTop: 10,
    flexWrap: "wrap",
    gap: 6,
  },
  genus: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 6,
    fontStyle: "italic",
  },

  // Image sits in normal flow at the hero bottom.
  // Hero zIndex:2 > card zIndex:1 → image renders above the card.
  imageWrapper: {
    alignItems: "center",
    marginTop: 16,
  },
  heroImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },

  // ── Card ─────────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: COLORS.card,
    // Pull the card up so its top aligns with the image midpoint.
    // The white rounded corners become visible against the type color.
    marginTop: -IMAGE_OVERLAP,
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    paddingHorizontal: 20,
    paddingBottom: 32,
    // Lower than hero so hero (and its image) paints on top
    zIndex: 1,
    elevation: 1,
  },
  // Pushes content below the bottom of the overlapping image
  imageSpacer: {
    height: IMAGE_OVERLAP + 16,
  },

  // ── Tab bar ──────────────────────────────────────────────────────────────────
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 24,
    position: "relative",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  tabIndicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    width: TAB_WIDTH,
    height: 3,
    borderRadius: 2,
  },

  // ── Tab content ──────────────────────────────────────────────────────────────
  tabContent: {
    minHeight: 220,
  },

  // ── About tab ────────────────────────────────────────────────────────────────
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  measureRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
  measure: { alignItems: "center", flex: 1 },
  measureIcon: { marginBottom: 4 },
  measureValue: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  measureLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 3,
    fontWeight: "500",
  },
  measureDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },
  abilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  abilityChip: {
    backgroundColor: "#EEF2FF",
    borderRadius: 999,
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

  // ── Stats tab ────────────────────────────────────────────────────────────────
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    width: 64,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginLeft: 42,
  },

  // ── Moves tab ────────────────────────────────────────────────────────────────
  moveHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 4,
  },
  moveHeaderText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  moveRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  moveRowAlt: {
    backgroundColor: "#F8F8F8",
  },
  moveCell: { fontSize: 13 },
  moveCellLvl: { width: 44, textAlign: "center" },
  moveCellName: { flex: 1 },
  moveLvlText: { fontWeight: "700", color: COLORS.textSecondary },
  moveNameText: { fontWeight: "600", color: COLORS.textPrimary },
  emptyMoves: { alignItems: "center", paddingVertical: 32 },
  emptyMovesText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },

  // ── Shared ───────────────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 14,
    letterSpacing: 0.2,
  },
});
