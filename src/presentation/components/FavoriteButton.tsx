import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  isFavorite: boolean;
  onToggle: () => void;
  size?: number;
  style?: object;
}

export const FavoriteButton = React.memo(function FavoriteButton({
  isFavorite,
  onToggle,
  size = 22,
  style,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[styles.button, style]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={size}
        color={isFavorite ? '#fff' : 'rgba(255,255,255,0.65)'}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 12,
    padding: 3,
  },
});
