import React, {useMemo} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, layout, s, typography} from '../../theme';
import {
  addDays,
  dateKey,
  formatDayLabel,
  formatMonthLabel,
  startOfDay,
} from '../../utils/date';
import {eventForDate} from '../../utils/events';

interface DateStripProps {
  days?: number;
  selectedKey: string;
  onSelect: (key: string) => void;
}

export const DateStrip = ({
  days = 14,
  selectedKey,
  onSelect,
}: DateStripProps) => {
  const items = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({length: days}, (_, index) => {
      const date = addDays(today, index);
      return {
        key: dateKey(date),
        date,
        hasEvent: eventForDate(date) != null,
        isToday: index === 0,
      };
    });
  }, [days]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {items.map(item => {
        const selected = item.key === selectedKey;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="button"
            accessibilityState={{selected}}
            onPress={() => onSelect(item.key)}
            style={({pressed}) => [styles.cell, pressed && styles.pressed]}>
            {selected ? (
              <LinearGradient
                colors={['#5CEE95', '#0C7A42']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.inner}>
                <Text style={styles.weekdayActive}>
                  {formatDayLabel(item.date)}
                </Text>
                <Text style={styles.dayActive}>{item.date.getDate()}</Text>
                <Text style={styles.monthActive}>
                  {formatMonthLabel(item.date)}
                </Text>
              </LinearGradient>
            ) : (
              <View style={[styles.inner, styles.innerIdle]}>
                <Text style={styles.weekday}>{formatDayLabel(item.date)}</Text>
                <Text style={styles.day}>{item.date.getDate()}</Text>
                <Text style={styles.month}>
                  {formatMonthLabel(item.date)}
                </Text>
                {item.hasEvent ? <View style={styles.dot} /> : null}
              </View>
            )}
            {item.isToday ? <Text style={styles.today}>today</Text> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: s(8),
    paddingHorizontal: layout.gutter,
    paddingVertical: s(2),
  },
  cell: {
    alignItems: 'center',
    gap: s(4),
  },
  pressed: {
    opacity: 0.75,
  },
  inner: {
    width: s(58),
    paddingVertical: s(10),
    borderRadius: layout.radiusMd,
    alignItems: 'center',
    gap: s(2),
  },
  innerIdle: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  weekday: {
    color: colors.textDim,
    fontSize: typography.micro,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  weekdayActive: {
    color: 'rgba(4,23,12,0.7)',
    fontSize: typography.micro,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '800',
  },
  day: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '800',
  },
  dayActive: {
    color: '#04170C',
    fontSize: typography.h2,
    fontWeight: '800',
  },
  month: {
    color: colors.textDim,
    fontSize: typography.micro,
    textTransform: 'uppercase',
  },
  monthActive: {
    color: 'rgba(4,23,12,0.7)',
    fontSize: typography.micro,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    bottom: s(5),
    width: s(5),
    height: s(5),
    borderRadius: s(3),
    backgroundColor: colors.emerald,
  },
  today: {
    color: colors.gold,
    fontSize: typography.micro,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
});
