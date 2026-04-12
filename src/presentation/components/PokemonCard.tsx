import React, { useCallback } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import type { Pokemon } from '@/src/domain/entities/pokemon';
import { formatName, formatPokemonId } from '@/src/core/utils/pokemon';
import { TYPE_COLORS, COLORS } from '@/src/core/constants/app';
import { PokemonTypeTag } from './PokemonTypeTag';
import { FavoriteButton } from './FavoriteButton';
import { useFavorites } from '../hooks/useFavorites';
import { useFavoriteStore } from '../store/favoriteStore';

interface Props {
  pokemon: Pokemon;
}

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2;

export const PokemonCard = React.memo(function PokemonCard({ pokemon }: Props) {
  const { toggleFavorite } = useFavorites();
  // Selector-based subscription: Zustand re-renders this card only when
  // THIS Pokémon's favorite status changes, not on every favorites update.
  const favorite = useFavoriteStore(
    useCallback((s) => s.favorites.some((f) => f.id === pokemon.id), [pokemon.id]),
  );

  const bgColor =
    pokemon.types.length > 0
      ? TYPE_COLORS[pokemon.types[0]] ?? COLORS.skeleton
      : COLORS.skeleton;

  const handlePress = useCallback(() => {
    router.push(`/pokemon/${pokemon.id}`);
  }, [pokemon.id]);

  const handleFavorite = useCallback(() => {
    toggleFavorite(pokemon);
  }, [toggleFavorite, pokemon]);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bgColor }]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <Text style={styles.id}>{formatPokemonId(pokemon.id)}</Text>
        <FavoriteButton isFavorite={favorite} onToggle={handleFavorite} size={20} />
      </View>

      <Image
        source={{ uri: pokemon.imageUrl }}
        style={styles.image}
        contentFit="contain"
        transition={200}
        placeholder={{ thumbhash: undefined }}
      />

      <View style={styles.footer}>
        <Text style={styles.name} numberOfLines={1}>
          {formatName(pokemon.name)}
        </Text>
        <View style={styles.types}>
          {pokemon.types.map((t) => (
            <PokemonTypeTag key={t} type={t} size="sm" />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  id: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.35)',
  },
  image: {
    width: '100%',
    height: 100,
    alignSelf: 'center',
  },
  footer: {
    marginTop: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
