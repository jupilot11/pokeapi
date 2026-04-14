import { TYPE_COLORS } from "@/src/core/constants/app";
import { formatName } from "@/src/core/utils/pokemon";
import { darken, lighten } from "polished";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  type: string;
  size?: "sm" | "md";
}

export const PokemonTypeTag = React.memo(function PokemonTypeTag({
  type,
  size = "md",
}: Props) {
  const bg = TYPE_COLORS[type] ?? "#A8A878";
  return (
    <View
      style={[
        styles.tag,
        {
          backgroundColor: darken(0.2, bg),
          borderColor: lighten(0.1, bg),
          borderWidth: 1,
        },
        size === "sm" && styles.sm,
      ]}
    >
      <Text style={[styles.label, size === "sm" && styles.labelSm]}>
        {formatName(type)}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 4,
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
    marginRight: 4,
    marginBottom: 0,
  },
  label: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  labelSm: {
    fontSize: 10,
  },
});
