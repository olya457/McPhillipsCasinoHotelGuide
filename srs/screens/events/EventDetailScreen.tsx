import React from 'react';
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
  Countdown,
  GlassCard,
  GradientButton,
  GradientText,
  Icon,
  ScreenContainer,
  SectionTitle,
  TagPill,
  TopScrim,
} from '../../components';
import {eventById} from '../../data/events';
import {venueById} from '../../data/venues';
import {colors, layout, s, typography, vs} from '../../theme';
import {useAppState} from '../../store/AppStateContext';
import {formatFullDate} from '../../utils/date';
import {eventDate, eventDateKey, eventStartAt} from '../../utils/events';
import type {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;

export const EventDetailScreen = ({navigation, route}: Props) => {
  const insets = useSafeAreaInsets();
  const {bookings} = useAppState();
  const event = eventById(route.params.eventId);

  if (!event) {
    return (
      <ScreenContainer>
        <View style={styles.missing}>
          <Text style={styles.missingText}>This event is not available.</Text>
          <GradientButton
            label="Go back"
            variant="outline"
            onPress={navigation.goBack}
          />
        </View>
      </ScreenContainer>
    );
  }

  const venue = venueById(event.venueId);
  const date = eventDate(event);
  const startAt = eventStartAt(event);
  const dateKeyValue = eventDateKey(event);
  const mySeats = bookings.filter(
    item => item.eventId === event.id && item.dateKey === dateKeyValue,
  );

  return (
    <ScreenContainer edges={{top: false}}>
      <TopScrim />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={event.image} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(6,9,7,0.7)', 'rgba(6,9,7,0.3)', 'rgba(6,9,7,0.99)']}
            locations={[0, 0.4, 0.95]}
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
              <TagPill label={event.category} tone="emerald" />
              <TagPill label={event.format} tone="gold" />
            </View>
          </View>

          <View style={styles.heroContent}>
            <GradientText style={styles.heroTitle}>{event.title}</GradientText>
            <Text style={styles.heroShort}>{event.short}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <GlassCard style={styles.metaCard}>
            <MetaRow
              icon="calendar"
              label="Date"
              value={formatFullDate(date)}
              tone={colors.emerald}
            />
            <MetaRow
              icon="clock"
              label="Start"
              value={`${event.time} · ${Math.round(event.durationMin / 60)} h programme`}
              tone={colors.gold}
            />
            <MetaRow
              icon="pin"
              label="Venue"
              value={venue?.name ?? ''}
              tone={colors.emerald}
              onPress={
                venue
                  ? () =>
                      navigation.navigate('VenueDetail', {venueId: venue.id})
                  : undefined
              }
            />
            <MetaRow
              icon="ticket"
              label="Ticket"
              value={event.price}
              tone={colors.gold}
              last
            />
          </GlassCard>

          <GlassCard tone="emerald" style={styles.countdownCard}>
            <Countdown
              targetAt={startAt}
              label="Starts in"
              caption={`Doors open 30 minutes before · ${venue?.name ?? ''}`}
            />
          </GlassCard>

          <View style={styles.section}>
            <SectionTitle title="About the event" />
            <Text style={styles.paragraph}>{event.description}</Text>
          </View>

          <View style={styles.section}>
            <SectionTitle title="Programme" caption={`${event.lineup.length} parts`} />
            <GlassCard>
              {event.lineup.map((item, index) => (
                <View
                  key={item}
                  style={[
                    styles.lineupRow,
                    index === event.lineup.length - 1 && styles.lineupLast,
                  ]}>
                  <View style={styles.lineupIndex}>
                    <Text style={styles.lineupIndexText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.lineupLabel}>{item}</Text>
                </View>
              ))}
            </GlassCard>
          </View>

          {venue?.lookImage ? (
            <View style={styles.section}>
              <SectionTitle
                title="Dress code"
                caption={venue.lookTitle ?? 'Recommended look'}
              />
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

          {mySeats.length > 0 ? (
            <View style={styles.section}>
              <SectionTitle
                title="Your seats"
                caption={`${mySeats.length} booked for this date`}
                actionLabel="Manage"
                onAction={() => navigation.navigate('MyBookings')}
              />
              <View style={styles.seatChips}>
                {mySeats.map(seat => (
                  <View key={seat.id} style={styles.seatChip}>
                    <Icon name="seat" size={s(13)} color={colors.emerald} />
                    <Text style={styles.seatChipText}>
                      {seat.sectorId} · row {seat.row} · seat {seat.number}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.actions}>
            <GradientButton
              label={mySeats.length ? 'Book another seat' : 'Book a seat'}
              icon="seat"
              onPress={() =>
                navigation.navigate('Main', {
                  screen: 'SeatBooking',
                  params: {eventId: event.id, dateKey: dateKeyValue},
                })
              }
            />
            {venue?.menuSections?.length ? (
              <GradientButton
                label="Open menu"
                variant="outline"
                icon="menu"
                onPress={() =>
                  navigation.navigate('Menu', {venueId: venue.id})
                }
              />
            ) : null}
            <GradientButton
              label="Decide with voting"
              variant="ghost"
              icon="vote"
              onPress={() => navigation.navigate('Voting')}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const MetaRow = ({
  icon,
  label,
  value,
  tone,
  onPress,
  last = false,
}: {
  icon: 'calendar' | 'clock' | 'pin' | 'ticket';
  label: string;
  value: string;
  tone: string;
  onPress?: () => void;
  last?: boolean;
}) => {
  const content = (
    <View style={[styles.metaRow, last && styles.metaRowLast]}>
      <View style={styles.metaIcon}>
        <Icon name={icon} size={s(15)} color={tone} />
      </View>
      <View style={styles.metaText}>
        <Text style={styles.metaLabel}>{label}</Text>
        <Text style={styles.metaValue} numberOfLines={2}>
          {value}
        </Text>
      </View>
      {onPress ? (
        <Icon name="chevron" size={s(13)} color={colors.textDim} />
      ) : null}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [pressed && styles.pressed]}>
      {content}
    </Pressable>
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
    height: vs(340),
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
    backgroundColor: 'rgba(6,9,7,0.6)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  pressed: {
    opacity: 0.65,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: s(6),
  },
  heroContent: {
    paddingHorizontal: layout.gutter,
    paddingBottom: s(18),
    gap: s(7),
  },
  heroTitle: {
    fontSize: typography.display,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  heroShort: {
    color: colors.textSoft,
    fontSize: typography.bodySm,
    lineHeight: typography.bodySm * 1.5,
  },
  body: {
    paddingHorizontal: layout.gutter,
    marginTop: s(14),
    gap: vs(20),
  },
  metaCard: {
    paddingVertical: s(6),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    paddingVertical: s(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.borderNeutral,
  },
  metaRowLast: {
    borderBottomWidth: 0,
  },
  metaIcon: {
    width: s(34),
    height: s(34),
    borderRadius: s(17),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  metaText: {
    flex: 1,
  },
  metaLabel: {
    color: colors.textDim,
    fontSize: typography.micro,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  metaValue: {
    marginTop: s(3),
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  countdownCard: {
    paddingVertical: s(18),
  },
  section: {
    gap: s(12),
  },
  paragraph: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: typography.body * 1.6,
  },
  lineupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    paddingVertical: s(11),
    borderBottomWidth: 1,
    borderBottomColor: colors.borderNeutral,
  },
  lineupLast: {
    borderBottomWidth: 0,
  },
  lineupIndex: {
    width: s(26),
    height: s(26),
    borderRadius: s(13),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(47,212,111,0.12)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  lineupIndexText: {
    color: colors.emeraldSoft,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  lineupLabel: {
    flex: 1,
    color: colors.textSoft,
    fontSize: typography.bodySm,
    fontWeight: '600',
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
  seatChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  seatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingHorizontal: s(11),
    paddingVertical: s(8),
    borderRadius: layout.pill,
    backgroundColor: 'rgba(47,212,111,0.1)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  seatChipText: {
    color: colors.textSoft,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  actions: {
    gap: s(10),
  },
});
