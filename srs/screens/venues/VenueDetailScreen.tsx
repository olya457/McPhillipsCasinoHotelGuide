import React, {useMemo} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  GlassCard,
  GradientButton,
  GradientText,
  Icon,
  ScreenContainer,
  SectionTitle,
  TagPill,
  TopScrim,
} from '../../components';
import {events} from '../../data/events';
import {venueById} from '../../data/venues';
import {colors, layout, s, typography, vs} from '../../theme';
import {formatShortDate} from '../../utils/date';
import {eventDate} from '../../utils/events';
import type {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'VenueDetail'>;

export const VenueDetailScreen = ({navigation, route}: Props) => {
  const insets = useSafeAreaInsets();
  const venue = venueById(route.params.venueId);

  const venueEvents = useMemo(
    () => events.filter(event => event.venueId === route.params.venueId),
    [route.params.venueId],
  );

  if (!venue) {
    return (
      <ScreenContainer>
        <View style={styles.missing}>
          <Text style={styles.missingText}>This venue is not available.</Text>
          <GradientButton
            label="Go back"
            variant="outline"
            onPress={navigation.goBack}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={{top: false}}>
      <TopScrim />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={venue.image} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(24,13,38,0.72)', 'rgba(24,13,38,0.32)', 'rgba(24,13,38,0.99)']}
            locations={[0, 0.42, 0.95]}
            style={styles.heroOverlay}
          />
          <View style={[styles.heroTop, {paddingTop: insets.top + s(8)}]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={layout.hitSlop}
              onPress={navigation.goBack}
              style={({pressed}) => [styles.circle, pressed && styles.pressed]}>
              <Icon name="back" size={s(20)} color={colors.textSoft} />
            </Pressable>
            <View style={styles.heroBadges}>
              {venue.ageRestricted ? <TagPill label="18+" tone="danger" /> : null}
              {venue.bookingRequired ? (
                <TagPill label="By reservation" tone="gold" />
              ) : null}
            </View>
          </View>

          <View style={styles.heroContent}>
            <GradientText style={styles.heroTitle}>{venue.name}</GradientText>
            <Text style={styles.heroShort}>{venue.short}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <GlassCard tone="emerald" style={styles.hoursCard}>
            <View style={styles.hoursRow}>
              <Icon name="clock" size={s(17)} color={colors.emerald} />
              <View style={styles.hoursText}>
                <Text style={styles.hoursLabel}>Opening hours</Text>
                <Text style={styles.hoursValue}>{venue.schedule.days}</Text>
                <Text style={styles.hoursValue}>{venue.schedule.hours}</Text>
                {venue.schedule.closed ? (
                  <Text style={styles.hoursClosed}>{venue.schedule.closed}</Text>
                ) : null}
              </View>
            </View>
          </GlassCard>

          <View style={styles.chips}>
            {venue.highlights.map(item => (
              <TagPill key={item} label={item} tone="neutral" />
            ))}
          </View>

          <View style={styles.section}>
            <SectionTitle title="About" />
            {venue.paragraphs.map(paragraph => (
              <Text key={paragraph.slice(0, 24)} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>

          {venue.lookImage ? (
            <View style={styles.section}>
              <SectionTitle title="Dress code" caption={venue.lookTitle} />
              <GlassCard tone="gold" padded={false} style={styles.lookCard}>
                <Image
                  source={venue.lookImage}
                  style={styles.lookImage}
                  resizeMode="cover"
                />
                <View style={styles.lookText}>
                  <Text style={styles.lookTitle}>{venue.lookTitle}</Text>
                  <Text style={styles.lookNote}>{venue.lookNote}</Text>
                </View>
              </GlassCard>
            </View>
          ) : null}

          {venueEvents.length ? (
            <View style={styles.section}>
              <SectionTitle
                title="Events here"
                caption={`${venueEvents.length} upcoming`}
              />
              {venueEvents.map(event => (
                <Pressable
                  key={event.id}
                  accessibilityRole="button"
                  onPress={() =>
                    navigation.navigate('EventDetail', {eventId: event.id})
                  }
                  style={({pressed}) => [
                    styles.eventRow,
                    pressed && styles.pressed,
                  ]}>
                  <Image
                    source={event.image}
                    style={styles.eventThumb}
                    resizeMode="cover"
                  />
                  <View style={styles.eventText}>
                    <Text style={styles.eventTitle} numberOfLines={1}>
                      {event.title}
                    </Text>
                    <Text style={styles.eventMeta} numberOfLines={1}>
                      {formatShortDate(eventDate(event))} · {event.time} ·{' '}
                      {event.price}
                    </Text>
                  </View>
                  <Icon name="chevron" size={s(14)} color={colors.textDim} />
                </Pressable>
              ))}
            </View>
          ) : null}

          <View style={styles.actions}>
            {venue.menuSections?.length ? (
              <GradientButton
                label="Open menu"
                icon="menu"
                onPress={() => navigation.navigate('Menu', {venueId: venue.id})}
              />
            ) : null}
            <GradientButton
              label="Book a seat"
              variant="outline"
              icon="seat"
              onPress={() =>
                navigation.navigate('Main', {screen: 'SeatBooking'})
              }
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: vs(30),
  },
  missing: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: layout.gutter,
    gap: s(16),
  },
  missingText: {
    color: colors.textSoft,
    fontSize: typography.body,
    textAlign: 'center',
  },
  hero: {
    height: vs(330),
    justifyContent: 'space-between',
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.gutter,
    gap: s(10),
  },
  circle: {
    width: s(38),
    height: s(38),
    borderRadius: s(19),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(24,13,38,0.6)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  pressed: {
    opacity: 0.7,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: s(6),
  },
  heroContent: {
    paddingHorizontal: layout.gutter,
    paddingBottom: s(18),
    gap: s(6),
  },
  heroTitle: {
    fontSize: typography.display,
    fontWeight: '800',
  },
  heroShort: {
    color: colors.textSoft,
    fontSize: typography.bodySm,
    lineHeight: typography.bodySm * 1.5,
  },
  body: {
    paddingHorizontal: layout.gutter,
    marginTop: s(14),
    gap: vs(18),
  },
  hoursCard: {
    paddingVertical: s(16),
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(12),
  },
  hoursText: {
    flex: 1,
    gap: s(2),
  },
  hoursLabel: {
    color: colors.textDim,
    fontSize: typography.micro,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: s(3),
  },
  hoursValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  hoursClosed: {
    marginTop: s(4),
    color: '#F09A93',
    fontSize: typography.bodySm,
    fontWeight: '600',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(7),
  },
  section: {
    gap: s(12),
  },
  paragraph: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: typography.body * 1.62,
  },
  lookCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lookImage: {
    width: s(104),
    height: s(104),
  },
  lookText: {
    flex: 1,
    padding: s(14),
    gap: s(5),
  },
  lookTitle: {
    color: colors.gold,
    fontSize: typography.h3,
    fontWeight: '800',
  },
  lookNote: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: typography.caption * 1.5,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    padding: s(10),
    borderRadius: layout.radiusMd,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  eventThumb: {
    width: s(52),
    height: s(52),
    borderRadius: layout.radiusSm,
  },
  eventText: {
    flex: 1,
  },
  eventTitle: {
    color: colors.text,
    fontSize: typography.bodySm,
    fontWeight: '700',
  },
  eventMeta: {
    marginTop: s(3),
    color: colors.textDim,
    fontSize: typography.caption,
  },
  actions: {
    gap: s(10),
  },
});
