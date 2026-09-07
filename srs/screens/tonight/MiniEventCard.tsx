import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {GlassCard, Icon, TagPill} from '../../components';
import {venueName} from '../../data/venues';
import {colors, layout, s, typography} from '../../theme';
import type {TimelineEntry} from '../../types';
import {formatRelativeMinutes} from '../../utils/date';
import {ReminderControl} from './ReminderControl';

interface MiniEventCardProps {
  entry: TimelineEntry;
  width: number;
  now: number;
  active: boolean;
  reminderEnabled: boolean;
  reminderMinutes: number;
  onToggleReminder: (next: boolean) => void;
  onSelectMinutes: (minutes: number) => void;
  onOpenVenue: () => void;
}

const statusMeta = {
  now: {label: 'Now', tone: 'emerald' as const},
  next: {label: 'Next', tone: 'gold' as const},
  later: {label: 'Later', tone: 'neutral' as const},
  done: {label: 'Finished', tone: 'neutral' as const},
};

const MiniEventCardComponent = ({
  entry,
  width,
  now,
  active,
  reminderEnabled,
  reminderMinutes,
  onToggleReminder,
  onSelectMinutes,
  onOpenVenue,
}: MiniEventCardProps) => {
  const meta = statusMeta[entry.status];
  const finished = entry.status === 'done';

  return (
    <GlassCard
      tone={entry.status === 'now' ? 'emerald' : 'default'}
      highlighted={active}
      style={[styles.card, {width}]}>
      <View style={styles.topRow}>
        <View style={styles.timeBlock}>
          <Text style={[styles.time, finished && styles.dim]}>{entry.time}</Text>
          <Text style={styles.duration}>{entry.durationMin} min</Text>
        </View>
        <View style={styles.badges}>
          <TagPill label={meta.label} tone={meta.tone} />
          <TagPill label={entry.tag} tone="neutral" />
        </View>
      </View>

      <Text style={[styles.title, finished && styles.dim]} numberOfLines={2}>
        {entry.title}
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={onOpenVenue}
        style={({pressed}) => [styles.venueRow, pressed && styles.pressed]}>
        <Icon name="pin" size={s(13)} color={colors.emerald} />
        <Text style={styles.venueName} numberOfLines={1}>
          {venueName(entry.venueId)}
        </Text>
        <Icon name="chevron" size={s(12)} color={colors.textDim} />
      </Pressable>

      <Text style={styles.description} numberOfLines={3}>
        {entry.description}
      </Text>

      {entry.status !== 'done' ? (
        <View style={styles.startsIn}>
          <Icon name="clock" size={s(13)} color={colors.textMuted} />
          <Text style={styles.startsInText}>
            {entry.status === 'now'
              ? 'In progress right now'
              : `Starts ${formatRelativeMinutes(entry.startAt - now)}`}
          </Text>
        </View>
      ) : null}

      <ReminderControl
        title={entry.title}
        time={entry.time}
        enabled={reminderEnabled}
        minutesBefore={reminderMinutes}
        onToggle={onToggleReminder}
        onSelectMinutes={onSelectMinutes}
        disabled={finished}
      />
    </GlassCard>
  );
};

export const MiniEventCard = React.memo(MiniEventCardComponent);

const styles = StyleSheet.create({
  card: {
    minHeight: s(230),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: s(10),
  },
  timeBlock: {
    gap: s(2),
  },
  time: {
    color: colors.text,
    fontSize: typography.h1,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  duration: {
    color: colors.textDim,
    fontSize: typography.caption,
  },
  badges: {
    alignItems: 'flex-end',
    gap: s(5),
  },
  title: {
    marginTop: s(12),
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '800',
  },
  dim: {
    color: colors.textDim,
  },
  venueRow: {
    marginTop: s(8),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    alignSelf: 'flex-start',
    paddingRight: s(4),
  },
  pressed: {
    opacity: 0.6,
  },
  venueName: {
    color: colors.emeraldSoft,
    fontSize: typography.bodySm,
    fontWeight: '700',
    maxWidth: s(200),
  },
  description: {
    marginTop: s(9),
    color: colors.textMuted,
    fontSize: typography.bodySm,
    lineHeight: typography.bodySm * 1.5,
  },
  startsIn: {
    marginTop: s(11),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    alignSelf: 'flex-start',
    paddingHorizontal: s(10),
    paddingVertical: s(6),
    borderRadius: layout.pill,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  startsInText: {
    color: colors.textSoft,
    fontSize: typography.caption,
    fontWeight: '600',
  },
});
