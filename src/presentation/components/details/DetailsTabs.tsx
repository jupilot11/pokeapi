import { COLORS } from "@/src/core/constants/app";
import { PokemonDetailFull, PokemonMove } from "@/src/domain/entities/pokemon";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { EvolutionChain } from "../EvolutionChain";
import { StatBar } from "../StatBar";
import { styles } from "./styles";

export function MovesTab({ moves }: { moves: PokemonMove[] }) {
  if (moves.length === 0) {
    return (
      <View style={styles.emptyMoves}>
        <Text style={styles.emptyMovesText}>No level-up moves found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.tabScene}
      showsVerticalScrollIndicator={false}
    >
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

      {moves.map((move, i) => (
        <View
          key={`${move.name}-${i}`}
          style={[styles.moveRow, i % 2 === 0 && styles.moveRowAlt]}
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
    </ScrollView>
  );
}

export function AboutTab({ data }: { data: PokemonDetailFull }) {
  const description = useMemo(() => {
    const pool = data.descriptions ?? [];
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [data.id]);

  return (
    <ScrollView
      contentContainerStyle={styles.tabScene}
      showsVerticalScrollIndicator={false}
    >
      {description ? (
        <Text style={styles.description}>{description}</Text>
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
    </ScrollView>
  );
}

export function StatsTab({ data }: { data: PokemonDetailFull }) {
  const total = data.stats.reduce((sum, s) => sum + s.value, 0);
  return (
    <ScrollView
      contentContainerStyle={styles.tabScene}
      showsVerticalScrollIndicator={false}
    >
      {data.stats.map((s) => (
        <StatBar key={s.name} name={s.name} value={s.value} />
      ))}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{total}</Text>
      </View>
    </ScrollView>
  );
}

export function EvolutionTab({
  data,
  bgColor,
}: {
  data: PokemonDetailFull;
  bgColor: string;
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.tabScene}
      showsVerticalScrollIndicator={false}
    >
      <SectionTitle>Evolution Chain</SectionTitle>
      <EvolutionChain chain={data.evolutionChain} typeColor={bgColor} />
    </ScrollView>
  );
}

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
