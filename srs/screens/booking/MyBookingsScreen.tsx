import React, {useMemo} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  EmptyState,
  GlassCard,
  GradientButton,
  Icon,
  ScreenContainer,
  ScreenHeader,
  TagPill,
} from '../../components';
import {colors, layout, s, typography, vs} from '../../theme';
import {useAppState} from '../../store/AppStateContext';
import {dateFromKey, formatFullDate} from '../../utils/date';
import type {RootStackParamList} from '../../navigation/types';
import type {Booking} from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'MyBookings'>;

export const MyBookingsScreen = ({navigation}: Props) => {
  const {bookings, removeBooking} = useAppState();

  const grouped = useMemo(() => {
    const map = new Map<string, Booking[]>();
    [...bookings]
      .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
      .forEach(booking => {
        const key = `${booking.dateKey}|${booking.eventId}`;
        const list = map.get(key) ?? [];
        list.push(booking);
        map.set(key, list);
      });
    return Array.from(map.entries());
  }, [bookings]);

  const total = bookings.reduce((sum, item) => sum + item.price, 0);

  return (
    <ScreenContainer>
      <ScreenHeader
        title="My bookings"
        subtitle={
          bookings.length
            ? `${bookings.length} seat${bookings.length > 1 ? 's' : ''} · €${total}`
            : 'No seats booked yet'
        }
        onBack={navigation.goBack}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {grouped.length === 0 ? (
          <EmptyState
            icon="seat"
            title="Nothing booked yet"
            message="Open the seat booking screen, pick a date and choose your seat on the hall plan.">
            <GradientButton
              label="Go to seat booking"
              onPress={() =>
                navigation.navigate('Main', {screen: 'SeatBooking'})
              }
            />
          </EmptyState>
        ) : (
          grouped.map(([key, items]) => {
            const [dateKeyValue, eventId] = key.split('|');
            const first = items[0];
            return (
              <GlassCard key={key} style={styles.group}>
                <View style={styles.groupHead}>
                  <View style={styles.groupText}>
                    <Text style={styles.groupTitle} numberOfLines={2}>
                      {first.eventTitle}
                    </Text>
                    <Text style={styles.groupDate}>
                      {formatFullDate(dateFromKey(dateKeyValue))} · {first.time}
                    </Text>
                  </View>
                  <TagPill
                    label={`${items.length} seat${items.length > 1 ? 's' : ''}`}
                    tone="emerald"
                  />
                </View>

                {items.map(item => (
                  <View key={item.id} style={styles.row}>
                    <View style={styles.rowBadge}>
                      <Text style={styles.rowBadgeText}>{item.sectorId}</Text>
                    </View>
                    <View style={styles.rowText}>
                      <Text style={styles.rowTitle}>
                        Row {item.row} · Seat {item.number}
                      </Text>
                      <Text style={styles.rowMeta} numberOfLines={1}>
                        {item.sectorName}
                      </Text>
                    </View>
                    <Text style={styles.rowPrice}>€{item.price}</Text>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Cancel booking"
                      hitSlop={layout.hitSlop}
                      onPress={() => removeBooking(item.id)}
                      style={({pressed}) => [
                        styles.remove,
                        pressed && styles.pressed,
                      ]}>
                      <Icon name="trash" size={s(14)} color={colors.danger} />
                    </Pressable>
                  </View>
                ))}

                <GradientButton
                  label="Open event"
                  variant="outline"
                  size="sm"
                  icon="ticket"
                  onPress={() => navigation.navigate('EventDetail', {eventId})}
                  style={styles.groupAction}
                />
              </GlassCard>
            );
          })
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: layout.gutter,
    paddingBottom: vs(30),
    gap: layout.gap + s(2),
  },
  group: {
    gap: s(4),
  },
  groupHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: s(10),
    paddingBottom: s(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.borderNeutral,
  },
  groupText: {
    flex: 1,
  },
  groupTitle: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '800',
  },
  groupDate: {
    marginTop: s(3),
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    paddingVertical: s(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.borderNeutral,
  },
  rowBadge: {
    width: s(30),
    height: s(30),
    borderRadius: s(9),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(47,212,111,0.14)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowBadgeText: {
    color: colors.emeraldSoft,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    color: colors.text,
    fontSize: typography.bodySm,
    fontWeight: '700',
  },
  rowMeta: {
    marginTop: s(2),
    color: colors.textDim,
    fontSize: typography.caption,
  },
  rowPrice: {
    color: colors.gold,
    fontSize: typography.bodySm,
    fontWeight: '800',
  },
  remove: {
    width: s(30),
    height: s(30),
    borderRadius: s(15),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(229,87,78,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(229,87,78,0.28)',
  },
  pressed: {
    opacity: 0.65,
  },
  groupAction: {
    marginTop: s(12),
  },
});
