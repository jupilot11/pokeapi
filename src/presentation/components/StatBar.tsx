import { STAT_COLORS, STAT_LABELS } from "@/src/core/constants/app";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

interface Props {
  name: string;
  value: number;
  /** Maximum stat value used to compute the fill ratio. Default: 255 */
  max?: number;
}

export const StatBar = React.memo(function StatBar({
  name,
  value,
  max = 255,
}: Props) {
  const label = STAT_LABELS[name] ?? name.toUpperCase();
  const color = STAT_COLORS[name] ?? "#A8A878";
  const pct = Math.min(value / max, 1);

  const animPct = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animPct, {
      toValue: pct,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [animPct, pct]);

  const animatedWidth = animPct.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, { width: animatedWidth, backgroundColor: color }]}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    width: 64,
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  value: {
    width: 32,
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "right",
    marginRight: 10,
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: "#EBEBEB",
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
  },
});
