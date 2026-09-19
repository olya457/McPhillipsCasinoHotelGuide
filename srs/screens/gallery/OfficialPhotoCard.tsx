import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {TagPill} from '../../components';
import {venueName} from '../../data/venues';
import {colors, layout, s, screenWidth, typography} from '../../theme';
import type {CasinoEvent} from '../../types';
import {formatShortDate} from '../../utils/date';
import {eventDate} from '../../utils/events';

const GRID_GAP = s(10);
const COLUMN_WIDTH = Math.floor(
  (screenWidth - layout.gutter * 2 - GRID_GAP - 1) / 2,
);

interface OfficialPhotoCardProps {
  event: CasinoEvent;
  onPress: () => void;
}

export const OfficialPhotoCard = ({
  event,
  onPress,
}: OfficialPhotoCardProps) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({pressed}) => [styles.root, pressed && styles.pressed]}>
    <Image source={event.image} style={styles.image} resizeMode="cover" />
    <LinearGradient
      colors={['rgba(24,13,38,0.05)', 'rgba(24,13,38,0.7)', 'rgba(24,13,38,0.98)']}
      locations={[0, 0.45, 1]}
      style={styles.overlay}
    />
    <View style={styles.badge}>
      <TagPill label={event.category} tone="emerald" />
    </View>
    <View style={styles.content}>
      <Text style={styles.title} numberOfLines={2}>
        {event.title}
      </Text>
      <Text style={styles.meta} numberOfLines={1}>
        {formatShortDate(eventDate(event))} · {event.time}
      </Text>
      <Text style={styles.venue} numberOfLines={1}>
        {venueName(event.venueId)}
      </Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  root: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH * 1.34,
    borderRadius: layout.radiusMd,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.85,
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  badge: {
    padding: s(9),
  },
  content: {
    padding: s(11),
    gap: s(2),
  },
  title: {
    color: colors.text,
    fontSize: typography.bodySm,
    fontWeight: '800',
  },
  meta: {
    color: colors.gold,
    fontSize: typography.micro,
    fontWeight: '700',
  },
  venue: {
    color: colors.textMuted,
    fontSize: typography.micro,
  },
});

export const galleryColumnWidth = COLUMN_WIDTH;
export const galleryGridGap = GRID_GAP;
