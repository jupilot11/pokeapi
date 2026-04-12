import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { STAT_COLORS, STAT_LABELS } from '@/src/core/constants/app';

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
  const color = STAT_COLORS[name] ?? '#A8A878';
  const pct = Math.min(value / max, 1);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.track}>
        <View
          style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: 64,
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    width: 32,
    fontSize: 13,
    fontWeight: '700',
    color: '#222',
    textAlign: 'right',
    marginRight: 10,
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
