import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, layout, s, typography} from '../theme';
import {formatCountdown} from '../utils/date';
import {useNow} from '../hooks/useNow';

interface CountdownProps {
  targetAt: number;
  label: string;
  caption?: string;
}

const Unit = ({value, unit}: {value: string; unit: string}) => (
  <View style={styles.unit}>
    <LinearGradient
      colors={['rgba(47,212,111,0.18)', 'rgba(33,18,51,0.9)']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.unitBox}>
      <Text style={styles.unitValue}>{value}</Text>
    </LinearGradient>
    <Text style={styles.unitLabel}>{unit}</Text>
  </View>
);

export const Countdown = ({targetAt, label, caption}: CountdownProps) => {
  const now = useNow(1000);
  const remaining = targetAt - now;
  const {days, hours, minutes, seconds} = formatCountdown(remaining);
  const live = remaining <= 0;

  return (
    <View style={styles.root}>
      <Text style={styles.label}>{label}</Text>
      {live ? (
        <View style={styles.liveBox}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>The programme is live now</Text>
        </View>
      ) : (
        <View style={styles.row}>
          {days > 0 ? <Unit value={`${days}`} unit="days" /> : null}
          <Unit value={hours} unit="hours" />
          <Text style={styles.colon}>:</Text>
          <Unit value={minutes} unit="min" />
          <Text style={styles.colon}>:</Text>
          <Unit value={seconds} unit="sec" />
        </View>
      )}
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.micro,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: s(10),
    gap: s(4),
  },
  unit: {
    alignItems: 'center',
    minWidth: s(52),
  },
  unitBox: {
    paddingHorizontal: s(10),
    paddingVertical: s(8),
    borderRadius: layout.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: s(52),
    alignItems: 'center',
    overflow: 'hidden',
  },
  unitValue: {
    color: colors.text,
    fontSize: typography.h1,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  unitLabel: {
    marginTop: s(5),
    color: colors.textDim,
    fontSize: typography.micro,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  colon: {
    color: colors.emerald,
    fontSize: typography.h1,
    fontWeight: '700',
    marginTop: s(7),
  },
  caption: {
    marginTop: s(10),
    color: colors.textSoft,
    fontSize: typography.bodySm,
    textAlign: 'center',
  },
  liveBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginTop: s(12),
    paddingHorizontal: s(14),
    paddingVertical: s(9),
    borderRadius: layout.pill,
    backgroundColor: 'rgba(47,212,111,0.14)',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  liveDot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: colors.emerald,
  },
  liveText: {
    color: colors.emeraldSoft,
    fontWeight: '700',
    fontSize: typography.bodySm,
  },
});
