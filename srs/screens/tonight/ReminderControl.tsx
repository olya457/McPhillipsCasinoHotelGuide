import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {FilterChip, Icon, ToggleSwitch} from '../../components';
import {reminderOptions} from '../../data/tonight';
import {colors, layout, s, typography} from '../../theme';
import {shiftTime} from '../../utils/date';

interface ReminderControlProps {
  title: string;
  time: string;
  enabled: boolean;
  minutesBefore: number;
  onToggle: (next: boolean) => void;
  onSelectMinutes: (minutes: number) => void;
  disabled?: boolean;
}

export const ReminderControl = ({
  title,
  time,
  enabled,
  minutesBefore,
  onToggle,
  onSelectMinutes,
  disabled = false,
}: ReminderControlProps) => (
  <View style={styles.root}>
    <View style={styles.row}>
      <View style={styles.labelRow}>
        <Icon
          name="bell"
          size={s(15)}
          color={enabled ? colors.emerald : colors.textDim}
        />
        <Text style={[styles.label, enabled && styles.labelActive]}>
          {disabled ? 'Act already finished' : 'Remind me'}
        </Text>
      </View>
      <ToggleSwitch
        value={enabled}
        onValueChange={onToggle}
        accessibilityLabel={`Reminder for ${title}`}
      />
    </View>

    {enabled ? (
      <View style={styles.expanded}>
        <Text style={styles.hint}>Notify me before the start</Text>
        <View style={styles.options}>
          {reminderOptions.map(option => (
            <FilterChip
              key={option}
              compact
              label={`${option} min`}
              active={option === minutesBefore}
              onPress={() => onSelectMinutes(option)}
            />
          ))}
        </View>
        <View style={styles.summary}>
          <Icon name="clock" size={s(13)} color={colors.gold} />
          <Text style={styles.summaryText}>
            Reminder at {shiftTime(time, minutesBefore)} · start {time}
          </Text>
        </View>
      </View>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  root: {
    marginTop: s(12),
    paddingTop: s(12),
    borderTopWidth: 1,
    borderTopColor: colors.borderNeutral,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: s(10),
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(7),
    flex: 1,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.text,
  },
  expanded: {
    marginTop: s(12),
    gap: s(9),
  },
  hint: {
    color: colors.textDim,
    fontSize: typography.caption,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingVertical: s(8),
    paddingHorizontal: s(11),
    borderRadius: layout.radiusSm,
    backgroundColor: 'rgba(231,206,142,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(231,206,142,0.25)',
  },
  summaryText: {
    color: colors.gold,
    fontSize: typography.caption,
    fontWeight: '600',
    flex: 1,
  },
});
