import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ContentReveal,
  EmptyState,
  Icon,
  ScreenContainer,
  ScreenHeader,
  TagPill,
} from '../../components';
import { venues } from '../../data/venues';
import { colors, layout, s, typography, vs } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import type { Venue } from '../../types';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const ListSeparator = () => <View style={styles.separator} />;

export const VenuesScreen = () => {
  const navigation = useNavigation<Navigation>();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return venues;
    }
    return venues.filter(
      venue =>
        venue.name.toLowerCase().includes(normalized) ||
        venue.short.toLowerCase().includes(normalized),
    );
  }, [query]);

  const renderItem = ({ item, index }: { item: Venue; index: number }) => (
    <ContentReveal delay={index < 4 ? index * 65 : 0}>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('VenueDetail', { venueId: item.id })}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(24,13,38,0.25)', 'rgba(24,13,38,0.82)', 'rgba(24,13,38,0.99)']}
          locations={[0, 0.55, 1]}
          style={styles.overlay}
        />
        <View style={styles.cardTop}>
          <View style={styles.indexBadge}>
            <Text style={styles.indexText}>{index + 1}</Text>
          </View>
          <View style={styles.cardBadges}>
            {item.ageRestricted ? <TagPill label="18+" tone="danger" /> : null}
            {item.bookingRequired ? (
              <TagPill label="Booking" tone="gold" />
            ) : null}
            {item.menuSections?.length ? (
              <TagPill label="Menu" tone="emerald" icon="menu" />
            ) : null}
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.cardShort} numberOfLines={2}>
            {item.short}
          </Text>
          <View style={styles.cardMeta}>
            <Icon name="clock" size={s(12)} color={colors.gold} />
            <Text style={styles.cardHours} numberOfLines={1}>
              {item.schedule.hours}
            </Text>
            <Icon name="chevron" size={s(13)} color={colors.emerald} />
          </View>
        </View>
      </Pressable>
    </ContentReveal>
  );

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Venues"
        subtitle={`${results.length} of ${venues.length} places in the complex`}
      />

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={ListSeparator}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.searchWrapper}>
            <Icon name="filter" size={s(16)} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search venues"
              placeholderTextColor={colors.textDim}
              selectionColor={colors.emerald}
              style={styles.searchInput}
            />
            {query ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                hitSlop={layout.hitSlop}
                onPress={() => setQuery('')}
              >
                <Icon name="close" size={s(15)} color={colors.textMuted} />
              </Pressable>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="venues"
            title="Nothing found"
            message="No venue matches this search. Try a shorter query."
          />
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: layout.gutter,
    paddingBottom: vs(28),
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    height: layout.inputHeight,
    paddingHorizontal: s(14),
    borderRadius: layout.pill,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    marginBottom: s(14),
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    padding: 0,
  },
  card: {
    height: vs(190),
    borderRadius: layout.radiusLg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.87,
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: s(12),
    gap: s(8),
  },
  indexBadge: {
    width: s(30),
    height: s(30),
    borderRadius: s(15),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(24,13,38,0.65)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  indexText: {
    color: colors.emeraldSoft,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  cardBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: s(6),
    maxWidth: '70%',
  },
  cardBody: {
    padding: s(14),
    gap: s(4),
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '800',
  },
  cardShort: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    lineHeight: typography.bodySm * 1.4,
  },
  cardMeta: {
    marginTop: s(6),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(7),
  },
  cardHours: {
    flex: 1,
    color: colors.textSoft,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  separator: {
    height: layout.gap + s(2),
  },
});
