import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  title: string;
}

export function ScreenHeader({ title }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: 0.2,
  },
});
