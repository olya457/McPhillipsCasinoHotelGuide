import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from '../../components';
import {venueName} from '../../data/venues';
import {colors, layout, s, typography} from '../../theme';
import type {TimelineEntry} from '../../types';

interface TimelineRailProps {
  entries: TimelineEntry[];
  activeIndex: number;
  remindedIds: string[];
  onSelect: (index: number) => void;
}

export const TimelineRail = ({
  entries,
  activeIndex,
  remindedIds,
  onSelect,
}: TimelineRailProps) => (
  <View style={styles.root}>
    {entries.map((entry, index) => {
      const isLast = index === entries.length - 1;
      const selected = index === activeIndex;
      const done = entry.status === 'done';
      const live = entry.status === 'now';
      const reminded = remindedIds.includes(entry.id);

      return (
        <Pressable
          key={entry.id}
          accessibilityRole="button"
          accessibilityState={{selected}}
          onPress={() => onSelect(index)}
          style={({pressed}) => [styles.row, pressed && styles.pressed]}>
          <View style={styles.rail}>
            <View
              style={[
                styles.node,
                done && styles.nodeDone,
                live && styles.nodeLive,
                selected && styles.nodeSelected,
              ]}>
              {done ? (
                <Icon name="check" size={s(10)} color={colors.emeraldSoft} />
              ) : live ? (
                <View style={styles.livePulse} />
              ) : (
                <View style={styles.nodeInner} />
              )}
            </View>
            {!isLast ? (
              <LinearGradient
                colors={
                  done
                    ? ['rgba(47,212,111,0.55)', 'rgba(47,212,111,0.2)']
                    : ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.05)']
                }
                style={styles.line}
              />
            ) : null}
          </View>

          <View style={[styles.content, isLast && styles.contentLast]}>
            <View style={styles.headRow}>
              <Text
                style={[
                  styles.time,
                  done && styles.dim,
                  selected && styles.timeSelected,
                ]}>
                {entry.time}
              </Text>
              {live ? <Text style={styles.nowLabel}>Now</Text> : null}
              {entry.status === 'next' ? (
                <Text style={styles.nextLabel}>Next</Text>
              ) : null}
              {reminded ? (
                <Icon name="bell" size={s(12)} color={colors.gold} />
              ) : null}
            </View>
            <Text
              numberOfLines={1}
              style={[
                styles.title,
                done && styles.dim,
                selected && styles.titleSelected,
              ]}>
              {entry.title}
            </Text>
            <Text numberOfLines={1} style={styles.venue}>
              {venueName(entry.venueId)}
            </Text>
          </View>

          <Icon
            name="chevron"
            size={s(14)}
            color={selected ? colors.emerald : colors.textDim}
          />
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  root: {
    marginTop: s(4),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(12),
  },
  pressed: {
    opacity: 0.7,
  },
  rail: {
    alignItems: 'center',
    width: s(24),
  },
  node: {
    width: s(22),
    height: s(22),
    borderRadius: s(11),
    borderWidth: 1.4,
    borderColor: colors.borderNeutral,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDone: {
    borderColor: 'rgba(47,212,111,0.5)',
    backgroundColor: 'rgba(47,212,111,0.12)',
  },
  nodeLive: {
    borderColor: colors.emerald,
    backgroundColor: 'rgba(47,212,111,0.2)',
  },
  nodeSelected: {
    borderColor: colors.gold,
  },
  nodeInner: {
    width: s(6),
    height: s(6),
    borderRadius: s(3),
    backgroundColor: colors.textDim,
  },
  livePulse: {
    width: s(9),
    height: s(9),
    borderRadius: s(5),
    backgroundColor: colors.emerald,
  },
  line: {
    width: 2,
    flexGrow: 1,
    minHeight: s(46),
    borderRadius: 1,
    marginVertical: s(3),
  },
  content: {
    flex: 1,
    paddingBottom: s(20),
  },
  contentLast: {
    paddingBottom: s(4),
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(7),
  },
  time: {
    color: colors.textSoft,
    fontSize: typography.bodySm,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  timeSelected: {
    color: colors.gold,
  },
  dim: {
    color: colors.textDim,
  },
  nowLabel: {
    color: colors.emerald,
    fontSize: typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  nextLabel: {
    color: colors.gold,
    fontSize: typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: s(3),
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  titleSelected: {
    color: colors.emeraldSoft,
  },
  venue: {
    marginTop: s(2),
    color: colors.textDim,
    fontSize: typography.caption,
  },
  spacer: {
    height: layout.gap,
  },
});
