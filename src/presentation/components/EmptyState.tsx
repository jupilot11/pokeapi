import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/src/core/constants/app';

interface Props {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = 'No Pokémon found',
  message = 'Try a different search term.',
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔍</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 300,
  },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
