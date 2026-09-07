import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Icon, TagPill} from '../../components';
import {venueName} from '../../data/venues';
import {colors, layout, s, typography, vs} from '../../theme';
import type {CasinoEvent} from '../../types';
import {formatFullDate} from '../../utils/date';
import {eventDate} from '../../utils/events';

interface EventCardProps {
  event: CasinoEvent;
  onPress: () => void;
  bookedSeats?: number;
}

export const EventCard = ({event, onPress, bookedSeats = 0}: EventCardProps) => {
  const date = eventDate(event);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [styles.root, pressed && styles.pressed]}>
      <View style={styles.imageWrapper}>
        <Image source={event.image} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(6,9,7,0.1)', 'rgba(6,9,7,0.5)', 'rgba(6,9,7,0.97)']}
          locations={[0, 0.45, 1]}
          style={styles.imageOverlay}
        />
        <View style={styles.badges}>
          <TagPill label={event.category} tone="emerald" />
          <TagPill label={event.format} tone="gold" />
        </View>
        {bookedSeats > 0 ? (
          <View style={styles.bookedBadge}>
            <Icon name="check" size={s(11)} color="#04170C" />
            <Text style={styles.bookedLabel}>
              {bookedSeats} seat{bookedSeats > 1 ? 's' : ''}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="calendar" size={s(12)} color={colors.emerald} />
            <Text style={styles.metaText}>{formatFullDate(date)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="clock" size={s(12)} color={colors.gold} />
            <Text style={styles.metaText}>{event.time}</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.venue} numberOfLines={1}>
          {venueName(event.venueId)}
        </Text>
        <Text style={styles.short} numberOfLines={2}>
          {event.short}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>{event.price}</Text>
          <View style={styles.more}>
            <Text style={styles.moreLabel}>Details</Text>
            <Icon name="chevron" size={s(13)} color={colors.emerald} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    borderRadius: layout.radiusLg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  pressed: {
    opacity: 0.88,
  },
  imageWrapper: {
    height: vs(150),
    justifyContent: 'flex-start',
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
  },
  badges: {
    flexDirection: 'row',
    gap: s(6),
    padding: s(12),
  },
  bookedBadge: {
    position: 'absolute',
    right: s(12),
    bottom: s(10),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    paddingHorizontal: s(9),
    paddingVertical: s(5),
    borderRadius: layout.pill,
    backgroundColor: colors.emerald,
  },
  bookedLabel: {
    color: '#04170C',
    fontSize: typography.micro,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  body: {
    padding: s(14),
    paddingTop: s(10),
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(14),
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
  },
  metaText: {
    color: colors.textSoft,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  title: {
    marginTop: s(8),
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '800',
  },
  venue: {
    marginTop: s(3),
    color: colors.emeraldSoft,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  short: {
    marginTop: s(7),
    color: colors.textMuted,
    fontSize: typography.bodySm,
    lineHeight: typography.bodySm * 1.45,
  },
  footer: {
    marginTop: s(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: s(11),
    borderTopWidth: 1,
    borderTopColor: colors.borderNeutral,
  },
  price: {
    color: colors.gold,
    fontSize: typography.body,
    fontWeight: '800',
  },
  more: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
  },
  moreLabel: {
    color: colors.emerald,
    fontSize: typography.bodySm,
    fontWeight: '700',
  },
});
