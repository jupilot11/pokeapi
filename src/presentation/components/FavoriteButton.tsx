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
        color={isFavorite ? '#E63946' : '#999'}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
