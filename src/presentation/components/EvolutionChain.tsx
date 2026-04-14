import { formatName } from "@/src/core/utils/pokemon";
import type { EvolutionStep } from "@/src/domain/entities/pokemon";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  chain: EvolutionStep[];
  typeColor: string;
}

/**
 * Renders the evolution chain as a series of horizontal "from → to" rows,
 * matching the reference Pokédex UI:
 *
 *   [Bulbasaur]  Lv 16  [Ivysaur]
 *   [Ivysaur]   Lv 34  [Venusaur]
 */
export const EvolutionChain = React.memo(function EvolutionChain({
  chain,
  typeColor,
}: Props) {
  if (chain.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No evolution data available.</Text>
      </View>
    );
  }

  if (chain.length === 1) {
    return (
      <View style={styles.singleContainer}>
        <EvolutionNode step={chain[0]} typeColor={typeColor} />
        <Text style={styles.noEvoText}>This Pokémon does not evolve.</Text>
      </View>
    );
  }

  // Build one row per consecutive pair: (0→1), (1→2), etc.
  const pairs: Array<[EvolutionStep, EvolutionStep]> = [];
  for (let i = 0; i < chain.length - 1; i++) {
    pairs.push([chain[i], chain[i + 1]]);
  }

  return (
    <View style={styles.container}>
      {pairs.map(([from, to], index) => (
        <View key={`${from.id}-${to.id}`}>
          <EvolutionRow from={from} to={to} typeColor={typeColor} />
          {/* Separator between rows (not after the last one) */}
          {index < pairs.length - 1 && <View style={styles.rowSeparator} />}
        </View>
      ))}
    </View>
  );
});

// ─── Row: from → to ───────────────────────────────────────────────────────────

function EvolutionRow({
  from,
  to,
  typeColor,
}: {
  from: EvolutionStep;
  to: EvolutionStep;
  typeColor: string;
}) {
  return (
    <View style={styles.row}>
      {/* Left Pokémon */}
      <EvolutionNode step={from} typeColor={typeColor} />

      {/* Arrow + level */}
      <View style={styles.arrowCol}>
        <View style={styles.arrowLine} />
        <View style={styles.arrowBadge}>
          {to.minLevel != null && to.minLevel > 0 && (
            <Text style={styles.levelText}>Lv {to.minLevel}</Text>
          )}
          <Ionicons name="chevron-forward" size={18} color="#9E9E9E" />
        </View>
        <View style={styles.arrowLine} />
      </View>

      {/* Right Pokémon */}
      <EvolutionNode step={to} typeColor={typeColor} />
    </View>
  );
}

// ─── Single Pokémon node ─────────────────────────────────────────────────────

function EvolutionNode({
  step,
  typeColor,
}: {
  step: EvolutionStep;
  typeColor: string;
}) {
  return (
    <View style={styles.node}>
      <View
        style={[styles.imageWrapper, { backgroundColor: `${typeColor}22` }]}
      >
        <Image
          source={{ uri: step.imageUrl }}
          style={styles.image}
          contentFit="contain"
          transition={200}
        />
      </View>
      <Text style={styles.pokemonName} numberOfLines={1}>
        {formatName(step.name)}
      </Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },

  // ── No-evolution states ───────────────────────────────────────────────────
  empty: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: "#9E9E9E",
  },
  singleContainer: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },
  noEvoText: {
    fontSize: 13,
    color: "#9E9E9E",
    fontStyle: "italic",
  },

  // ── Evolution row (from → to) ─────────────────────────────────────────────
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  rowSeparator: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 8,
  },

  // ── Arrow column ──────────────────────────────────────────────────────────
  arrowCol: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  arrowLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  arrowBadge: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    gap: 1,
  },
  levelText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#757575",
    letterSpacing: 0.2,
  },

  // ── Pokémon node ─────────────────────────────────────────────────────────
  node: {
    alignItems: "center",
    width: 90,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  image: {
    width: 60,
    height: 60,
  },
  pokemonName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
});
