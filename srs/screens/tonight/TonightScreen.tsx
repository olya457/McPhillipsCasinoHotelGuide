import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
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
import {tonightHeadline} from '../../data/tonight';
import {venueName} from '../../data/venues';
import {useTonightProgram} from '../../hooks/useTonightProgram';
import {useAppState} from '../../store/AppStateContext';
import {
  colors,
  layout,
  s,
  screenWidth,
  typography,
  vs,
} from '../../theme';
import {formatFullDate, formatRelativeMinutes} from '../../utils/date';
import type {RootStackParamList} from '../../navigation/types';
import type {TimelineEntry} from '../../types';
import {MiniEventCard} from './MiniEventCard';
import {TimelineRail} from './TimelineRail';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const CARD_WIDTH = screenWidth - layout.gutter * 2 - s(30);
const CARD_GAP = s(12);
const SNAP = CARD_WIDTH + CARD_GAP;

const QUICK_GAP = s(10);
const QUICK_WIDTH = Math.floor(
  (screenWidth - layout.gutter * 2 - QUICK_GAP - 1) / 2,
);

const CarouselSeparator = () => <View style={styles.carouselSeparator} />;

export const TonightScreen = () => {
  const navigation = useNavigation<Navigation>();
  const {reminders, toggleReminder, setReminderMinutes, bookings} =
    useAppState();
  const program = useTonightProgram(reminders);
  const listRef = useRef<FlatList<TimelineEntry>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const remindedIds = useMemo(
    () =>
      Object.keys(reminders).filter(key => reminders[key]?.enabled === true),
    [reminders],
  );

  const scrollToIndex = useCallback((index: number) => {
    setActiveIndex(index);
    listRef.current?.scrollToOffset({offset: index * SNAP, animated: true});
  }, []);

  const onCarouselScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(event.nativeEvent.contentOffset.x / SNAP);
      setActiveIndex(Math.max(0, Math.min(program.entries.length - 1, next)));
    },
    [program.entries.length],
  );

  const renderCard = useCallback(
    ({item, index}: {item: TimelineEntry; index: number}) => (
      <MiniEventCard
        entry={item}
        width={CARD_WIDTH}
        now={program.now}
        active={index === activeIndex}
        reminderEnabled={reminders[item.id]?.enabled ?? false}
        reminderMinutes={reminders[item.id]?.minutesBefore ?? 15}
        onToggleReminder={next => toggleReminder(item.id, next)}
        onSelectMinutes={minutes => setReminderMinutes(item.id, minutes)}
        onOpenVenue={() =>
          navigation.navigate('VenueDetail', {venueId: item.venueId})
        }
      />
    ),
    [
      activeIndex,
      navigation,
      program.now,
      reminders,
      setReminderMinutes,
      toggleReminder,
    ],
  );

  const upcoming = program.nextEntry ?? program.entries[0];

  return (
    <ScreenContainer edges={{top: false}}>
      <TopScrim />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            source={tonightHeadline.image}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(24,13,38,0.55)', 'rgba(24,13,38,0.35)', 'rgba(24,13,38,0.99)']}
            locations={[0, 0.4, 0.94]}
            style={styles.heroOverlay}
          />
          <View style={styles.heroContent}>
            <View style={styles.heroTop}>
              <TagPill label="Tonight" tone="emerald" icon="star" />
              <Text style={styles.heroDate}>
                {formatFullDate(program.programDate)}
              </Text>
            </View>
            <GradientText style={styles.heroTitle}>
              {tonightHeadline.title}
            </GradientText>
            <Text style={styles.heroSubtitle}>{tonightHeadline.subtitle}</Text>
            <View style={styles.heroMeta}>
              <View style={styles.heroMetaItem}>
                <Icon name="pin" size={s(13)} color={colors.emerald} />
                <Text style={styles.heroMetaText}>
                  {venueName(tonightHeadline.venueId)}
                </Text>
              </View>
              <View style={styles.heroMetaItem}>
                <Icon name="star" size={s(13)} color={colors.gold} />
                <Text style={styles.heroMetaText}>
                  {tonightHeadline.dressCode}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <GlassCard tone="emerald" style={styles.countdownCard}>
            <Countdown
              targetAt={program.countdownTarget}
              label={
                program.activeEntry
                  ? `Next act · ${upcoming?.title ?? ''}`
                  : 'Programme starts in'
              }
              caption={
                program.activeEntry
                  ? `On stage now: ${program.activeEntry.title} · ${venueName(
                      program.activeEntry.venueId,
                    )}`
                  : `${program.total} acts · first one at ${
                      program.entries[0]?.time ?? ''
                    }`
              }
            />
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <LinearGradient
                  colors={['#5CEE95', '#0C7A42']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.round(
                        (program.completed / program.total) * 100,
                      )}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressLabel}>
                {program.completed}/{program.total}
              </Text>
            </View>
          </GlassCard>

          {program.dueReminders.length > 0 ? (
            <GlassCard tone="gold" style={styles.reminderBanner}>
              <View style={styles.reminderHead}>
                <Icon name="bell" size={s(16)} color={colors.gold} />
                <Text style={styles.reminderTitle}>Reminder</Text>
              </View>
              {program.dueReminders.map(entry => (
                <Text key={entry.id} style={styles.reminderText}>
                  {entry.title} starts{' '}
                  {formatRelativeMinutes(entry.startAt - program.now)} ·{' '}
                  {venueName(entry.venueId)}
                </Text>
              ))}
            </GlassCard>
          ) : null}

          <View style={styles.section}>
            <SectionTitle
              title="Programme cards"
              caption="Swipe through every act of the evening"
            />
            <FlatList
              ref={listRef}
              data={program.entries}
              keyExtractor={item => item.id}
              renderItem={renderCard}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={SNAP}
              decelerationRate="fast"
              disableIntervalMomentum
              onMomentumScrollEnd={onCarouselScroll}
              contentContainerStyle={styles.carousel}
              ItemSeparatorComponent={CarouselSeparator}
            />
          </View>

          <View style={styles.section}>
            <SectionTitle
              title="Evening timeline"
              caption="Tap an act to open its card"
            />
            <GlassCard style={styles.timelineCard}>
              <TimelineRail
                entries={program.entries}
                activeIndex={activeIndex}
                remindedIds={remindedIds}
                onSelect={scrollToIndex}
              />
            </GlassCard>
          </View>

          <View style={styles.section}>
            <SectionTitle title="Plan the evening" />
            <View style={styles.quickGrid}>
              <QuickAction
                icon="vote"
                label="Event voting"
                caption="Decide together"
                onPress={() => navigation.navigate('Voting')}
              />
              <QuickAction
                icon="seat"
                label="Seat booking"
                caption={
                  bookings.length
                    ? `${bookings.length} booked`
                    : 'Choose your seat'
                }
                onPress={() => navigation.navigate('Main', {screen: 'SeatBooking'})}
              />
              <QuickAction
                icon="menu"
                label="Restaurant menu"
                caption="Starters to desserts"
                onPress={() => navigation.navigate('Menu')}
              />
              <QuickAction
                icon="gallery"
                label="Gallery"
                caption="Official & my photos"
                onPress={() => navigation.navigate('Main', {screen: 'Gallery'})}
              />
            </View>
          </View>

          <GradientButton
            label="Open gala event"
            icon="ticket"
            onPress={() =>
              navigation.navigate('EventDetail', {
                eventId: tonightHeadline.id,
              })
            }
            style={styles.cta}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const QuickAction = ({
  icon,
  label,
  caption,
  onPress,
}: {
  icon: 'vote' | 'seat' | 'menu' | 'gallery';
  label: string;
  caption: string;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({pressed}) => [styles.quickItem, pressed && styles.quickPressed]}>
    <LinearGradient
      colors={['rgba(47,212,111,0.12)', 'rgba(33,18,51,0.9)']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.quickInner}>
      <View style={styles.quickIcon}>
        <Icon name={icon} size={s(18)} color={colors.emerald} />
      </View>
      <Text style={styles.quickLabel} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.quickCaption} numberOfLines={1}>
        {caption}
      </Text>
    </LinearGradient>
  </Pressable>
);

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: vs(30),
  },
  hero: {
    height: vs(330),
    justifyContent: 'flex-end',
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
  },
  heroContent: {
    paddingHorizontal: layout.gutter,
    paddingBottom: s(18),
    gap: s(8),
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: s(10),
  },
  heroDate: {
    color: colors.textSoft,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: typography.display,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  heroSubtitle: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    lineHeight: typography.bodySm * 1.45,
  },
  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(14),
    marginTop: s(2),
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  heroMetaText: {
    color: colors.textSoft,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: layout.gutter,
    marginTop: s(16),
    gap: vs(20),
  },
  countdownCard: {
    paddingVertical: s(18),
  },
  progressRow: {
    marginTop: s(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  progressTrack: {
    flex: 1,
    height: s(6),
    borderRadius: s(3),
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: s(3),
  },
  progressLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  reminderBanner: {
    gap: s(6),
  },
  reminderHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(7),
  },
  reminderTitle: {
    color: colors.gold,
    fontSize: typography.micro,
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  reminderText: {
    color: colors.text,
    fontSize: typography.bodySm,
    fontWeight: '600',
    lineHeight: typography.bodySm * 1.45,
  },
  section: {
    gap: s(12),
  },
  carousel: {
    paddingRight: s(4),
    paddingVertical: s(2),
  },
  carouselSeparator: {
    width: CARD_GAP,
  },
  timelineCard: {
    paddingVertical: s(18),
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: QUICK_GAP,
  },
  quickItem: {
    width: QUICK_WIDTH,
    borderRadius: layout.radiusMd,
    overflow: 'hidden',
  },
  quickPressed: {
    opacity: 0.8,
  },
  quickInner: {
    padding: s(14),
    borderRadius: layout.radiusMd,
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    gap: s(4),
    overflow: 'hidden',
  },
  quickIcon: {
    width: s(34),
    height: s(34),
    borderRadius: s(17),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(47,212,111,0.1)',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: s(6),
    overflow: 'hidden',
  },
  quickLabel: {
    color: colors.text,
    fontSize: typography.bodySm,
    fontWeight: '700',
  },
  quickCaption: {
    color: colors.textDim,
    fontSize: typography.caption,
  },
  cta: {
    marginTop: s(2),
  },
});
