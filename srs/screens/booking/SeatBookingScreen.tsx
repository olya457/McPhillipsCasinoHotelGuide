import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import {
  BottomSheet,
  EmptyState,
  GlassCard,
  GradientButton,
  Icon,
  ScreenContainer,
  ScreenHeader,
  SectionTitle,
  TagPill,
} from '../../components';
import {venueName} from '../../data/venues';
import {colors, layout, s, typography, vs} from '../../theme';
import {useAppState} from '../../store/AppStateContext';
import {dateFromKey, dateKey, formatFullDate, startOfDay} from '../../utils/date';
import {eventDateKey, eventForDate} from '../../utils/events';
import {eventById} from '../../data/events';
import type {RootStackParamList, TabParamList} from '../../navigation/types';
import type {Seat} from '../../types';
import {DateStrip} from './DateStrip';
import {SeatMap} from './SeatMap';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<TabParamList, 'SeatBooking'>;

export const SeatBookingScreen = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Route>();
  const {bookings, addBooking, removeBooking, isSeatBooked} = useAppState();
  const [selectedKey, setSelectedKey] = useState(() =>
    dateKey(startOfDay(new Date())),
  );
  const [pendingSeat, setPendingSeat] = useState<Seat | null>(null);
  const [confirmed, setConfirmed] = useState<Seat | null>(null);

  useEffect(() => {
    const params = route.params;
    if (params?.dateKey) {
      setSelectedKey(params.dateKey);
      return;
    }
    if (params?.eventId) {
      const target = eventById(params.eventId);
      if (target) {
        setSelectedKey(eventDateKey(target));
      }
    }
  }, [route.params]);

  const selectedDate = useMemo(() => dateFromKey(selectedKey), [selectedKey]);
  const event = useMemo(() => eventForDate(selectedDate), [selectedDate]);

  const dayBookings = useMemo(
    () =>
      bookings
        .filter(item => item.dateKey === selectedKey)
        .sort((a, b) => a.createdAt - b.createdAt),
    [bookings, selectedKey],
  );

  const seatChecker = useCallback(
    (seatId: string) =>
      event ? isSeatBooked(event.id, selectedKey, seatId) : false,
    [event, isSeatBooked, selectedKey],
  );

  const confirmBooking = useCallback(() => {
    if (!pendingSeat || !event) {
      return;
    }
    addBooking({
      eventId: event.id,
      eventTitle: event.title,
      dateKey: selectedKey,
      time: event.time,
      seatId: pendingSeat.id,
      sectorId: pendingSeat.sectorId,
      sectorName: pendingSeat.sectorName,
      row: pendingSeat.row,
      number: pendingSeat.number,
      price: pendingSeat.price,
    });
    setConfirmed(pendingSeat);
    setPendingSeat(null);
  }, [addBooking, event, pendingSeat, selectedKey]);

  const total = dayBookings.reduce((sum, item) => sum + item.price, 0);

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Seat booking"
        subtitle={formatFullDate(selectedDate)}
        actionIcon="ticket"
        onAction={() => navigation.navigate('MyBookings')}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.stripWrapper}>
          <DateStrip selectedKey={selectedKey} onSelect={setSelectedKey} />
        </View>

        <View style={styles.body}>
          {event ? (
            <>
              <GlassCard padded={false} style={styles.eventCard}>
                <Image
                  source={event.image}
                  style={styles.eventImage}
                  resizeMode="cover"
                />
                <View style={styles.eventText}>
                  <View style={styles.eventBadges}>
                    <TagPill label={event.category} tone="emerald" />
                    <TagPill label={event.time} tone="gold" icon="clock" />
                  </View>
                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {event.title}
                  </Text>
                  <Text style={styles.eventVenue} numberOfLines={1}>
                    {venueName(event.venueId)}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      navigation.navigate('EventDetail', {eventId: event.id})
                    }
                    style={({pressed}) => [
                      styles.eventLink,
                      pressed && styles.pressed,
                    ]}>
                    <Text style={styles.eventLinkLabel}>Event details</Text>
                    <Icon name="chevron" size={s(12)} color={colors.emerald} />
                  </Pressable>
                </View>
              </GlassCard>

              <View style={styles.section}>
                <SectionTitle
                  title="Hall plan"
                  caption="Tap a free seat to see its number, sector and price"
                />
                <GlassCard style={styles.mapCard}>
                  <SeatMap
                    eventId={event.id}
                    dateKeyValue={selectedKey}
                    allowedSectors={event.seatingSectors}
                    selectedSeatId={pendingSeat?.id ?? null}
                    isBooked={seatChecker}
                    onSelectSeat={setPendingSeat}
                  />
                </GlassCard>
              </View>

              <View style={styles.section}>
                <SectionTitle
                  title="Booked seats"
                  caption={
                    dayBookings.length
                      ? `${dayBookings.length} seat${
                          dayBookings.length > 1 ? 's' : ''
                        } · €${total}`
                      : 'Nothing booked for this date yet'
                  }
                  actionLabel={dayBookings.length ? 'All bookings' : undefined}
                  onAction={() => navigation.navigate('MyBookings')}
                />
                {dayBookings.length ? (
                  <GlassCard style={styles.bookingList}>
                    {dayBookings.map((item, index) => (
                      <View
                        key={item.id}
                        style={[
                          styles.bookingRow,
                          index === dayBookings.length - 1 &&
                            styles.bookingRowLast,
                        ]}>
                        <View style={styles.bookingBadge}>
                          <Text style={styles.bookingBadgeText}>
                            {item.sectorId}
                          </Text>
                        </View>
                        <View style={styles.bookingText}>
                          <Text style={styles.bookingTitle}>
                            Row {item.row} · Seat {item.number}
                          </Text>
                          <Text style={styles.bookingMeta} numberOfLines={1}>
                            {item.sectorName} · €{item.price}
                          </Text>
                        </View>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Cancel booking"
                          hitSlop={layout.hitSlop}
                          onPress={() => removeBooking(item.id)}
                          style={({pressed}) => [
                            styles.removeButton,
                            pressed && styles.pressed,
                          ]}>
                          <Icon name="trash" size={s(15)} color={colors.danger} />
                        </Pressable>
                      </View>
                    ))}
                  </GlassCard>
                ) : (
                  <GlassCard style={styles.hintCard}>
                    <Icon name="info" size={s(16)} color={colors.textMuted} />
                    <Text style={styles.hintText}>
                      Choose a seat on the plan above and confirm the booking to
                      see it here.
                    </Text>
                  </GlassCard>
                )}
              </View>
            </>
          ) : (
            <EmptyState
              icon="calendar"
              title="No event on this date"
              message="There is no scheduled programme for the selected day. Pick another date from the strip above."
            />
          )}
        </View>
      </ScrollView>

      <BottomSheet
        visible={pendingSeat != null}
        onClose={() => setPendingSeat(null)}
        title="Confirm the seat"
        subtitle={event ? `${event.title} · ${event.time}` : ''}
        footer={
          <>
            <GradientButton label="Confirm booking" icon="check" onPress={confirmBooking} />
            <GradientButton
              label="Choose another seat"
              variant="ghost"
              onPress={() => setPendingSeat(null)}
            />
          </>
        }>
        {pendingSeat ? (
          <>
            <DetailRow label="Seat number" value={`${pendingSeat.number}`} />
            <DetailRow label="Row" value={`${pendingSeat.row}`} />
            <DetailRow label="Sector" value={pendingSeat.sectorName} />
            <DetailRow label="Date" value={formatFullDate(selectedDate)} />
            <DetailRow
              label="Price"
              value={`€${pendingSeat.price}`}
              highlight
            />
          </>
        ) : null}
      </BottomSheet>

      <BottomSheet
        visible={confirmed != null}
        onClose={() => setConfirmed(null)}
        title="Seat booked"
        subtitle="The seat has been added to your bookings"
        footer={
          <>
            <GradientButton
              label="View my bookings"
              icon="ticket"
              onPress={() => {
                setConfirmed(null);
                navigation.navigate('MyBookings');
              }}
            />
            <GradientButton
              label="Keep booking seats"
              variant="ghost"
              onPress={() => setConfirmed(null)}
            />
          </>
        }>
        {confirmed ? (
          <GlassCard tone="emerald">
            <Text style={styles.successTitle}>
              {confirmed.sectorId} · Row {confirmed.row} · Seat{' '}
              {confirmed.number}
            </Text>
            <Text style={styles.successMeta}>
              {confirmed.sectorName} · €{confirmed.price}
            </Text>
            <Text style={styles.successMeta}>
              {formatFullDate(selectedDate)}
              {event ? ` · ${event.time}` : ''}
            </Text>
          </GlassCard>
        ) : null}
      </BottomSheet>
    </ScreenContainer>
  );
};

const DetailRow = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, highlight && styles.detailHighlight]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: vs(28),
  },
  stripWrapper: {
    paddingBottom: s(6),
  },
  body: {
    paddingHorizontal: layout.gutter,
    marginTop: s(14),
    gap: vs(20),
  },
  eventCard: {
    flexDirection: 'row',
  },
  eventImage: {
    width: s(112),
    height: '100%',
    minHeight: s(140),
  },
  eventText: {
    flex: 1,
    padding: s(14),
    gap: s(5),
  },
  eventBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginBottom: s(3),
  },
  eventTitle: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '800',
  },
  eventVenue: {
    color: colors.emeraldSoft,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  eventLink: {
    marginTop: s(6),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    alignSelf: 'flex-start',
  },
  eventLinkLabel: {
    color: colors.emerald,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.65,
  },
  section: {
    gap: s(12),
  },
  mapCard: {
    paddingVertical: s(18),
  },
  bookingList: {
    paddingVertical: s(4),
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    paddingVertical: s(11),
    borderBottomWidth: 1,
    borderBottomColor: colors.borderNeutral,
  },
  bookingRowLast: {
    borderBottomWidth: 0,
  },
  bookingBadge: {
    width: s(34),
    height: s(34),
    borderRadius: s(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(47,212,111,0.14)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bookingBadgeText: {
    color: colors.emeraldSoft,
    fontSize: typography.bodySm,
    fontWeight: '800',
  },
  bookingText: {
    flex: 1,
  },
  bookingTitle: {
    color: colors.text,
    fontSize: typography.bodySm,
    fontWeight: '700',
  },
  bookingMeta: {
    marginTop: s(2),
    color: colors.textDim,
    fontSize: typography.caption,
  },
  removeButton: {
    width: s(34),
    height: s(34),
    borderRadius: s(17),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(229,87,78,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(229,87,78,0.28)',
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  hintText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: typography.bodySm,
    lineHeight: typography.bodySm * 1.45,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: s(12),
    paddingHorizontal: s(14),
    borderRadius: layout.radiusMd,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    gap: s(10),
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
  },
  detailValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  detailHighlight: {
    color: colors.gold,
    fontSize: typography.h3,
  },
  successTitle: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '800',
  },
  successMeta: {
    marginTop: s(4),
    color: colors.textMuted,
    fontSize: typography.bodySm,
  },
});
