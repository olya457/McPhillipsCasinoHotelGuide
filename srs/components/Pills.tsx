import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, gradients, layout, s, typography} from '../theme';
import {Icon, type IconName} from './Icon';

interface TagPillProps {
  label: string;
  tone?: 'emerald' | 'gold' | 'neutral' | 'danger' | 'warning';
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}

const tagTones = {
  emerald: {
    bg: 'rgba(47,212,111,0.14)',
    border: 'rgba(47,212,111,0.35)',
    text: colors.emeraldSoft,
  },
  gold: {
    bg: 'rgba(231,206,142,0.14)',
    border: 'rgba(231,206,142,0.34)',
    text: colors.gold,
  },
  neutral: {
    bg: 'rgba(255,255,255,0.06)',
    border: colors.borderNeutral,
    text: colors.textMuted,
  },
  danger: {
    bg: 'rgba(229,87,78,0.14)',
    border: 'rgba(229,87,78,0.34)',
    text: '#F09A93',
  },
  warning: {
    bg: 'rgba(232,163,61,0.14)',
    border: 'rgba(232,163,61,0.34)',
    text: '#F0BE72',
  },
};

export const TagPill = ({
  label,
  tone = 'neutral',
  icon,
  style,
}: TagPillProps) => {
  const palette = tagTones[tone];
  return (
    <View
      style={[
        styles.tag,
        {backgroundColor: palette.bg, borderColor: palette.border},
        style,
      ]}>
      {icon ? <Icon name={icon} size={s(12)} color={palette.text} /> : null}
      <Text style={[styles.tagLabel, {color: palette.text}]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  compact?: boolean;
}

export const FilterChip = ({
  label,
  active,
  onPress,
  compact = false,
}: FilterChipProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{selected: active}}
    onPress={onPress}
    style={({pressed}) => [styles.chipWrapper, pressed && styles.chipPressed]}>
    {active ? (
      <LinearGradient
        colors={[...gradients.primaryFlat]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.chip, compact && styles.chipCompact]}>
        <Text style={[styles.chipLabelActive, compact && styles.chipLabelSm]}>
          {label}
        </Text>
      </LinearGradient>
    ) : (
      <View style={[styles.chip, styles.chipIdle, compact && styles.chipCompact]}>
        <Text style={[styles.chipLabel, compact && styles.chipLabelSm]}>
          {label}
        </Text>
      </View>
    )}
  </Pressable>
);

interface SegmentedProps {
  options: {key: string; label: string}[];
  value: string;
  onChange: (key: string) => void;
}

export const Segmented = ({options, value, onChange}: SegmentedProps) => (
  <View style={styles.segmented}>
    {options.map(option => {
      const active = option.key === value;
      return (
        <Pressable
          key={option.key}
          accessibilityRole="tab"
          accessibilityState={{selected: active}}
          onPress={() => onChange(option.key)}
          style={styles.segmentItem}>
          {active ? (
            <LinearGradient
              colors={[...gradients.primaryFlat]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.segmentActive}>
              <Text style={styles.segmentLabelActive} numberOfLines={1}>
                {option.label}
              </Text>
            </LinearGradient>
          ) : (
            <View style={styles.segmentIdle}>
              <Text style={styles.segmentLabel} numberOfLines={1}>
                {option.label}
              </Text>
            </View>
          )}
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    paddingHorizontal: s(9),
    paddingVertical: s(4),
    borderRadius: layout.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  tagLabel: {
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  chipWrapper: {
    borderRadius: layout.pill,
    overflow: 'hidden',
  },
  chipPressed: {
    opacity: 0.75,
  },
  chip: {
    paddingHorizontal: s(14),
    paddingVertical: s(9),
    borderRadius: layout.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipCompact: {
    paddingHorizontal: s(11),
    paddingVertical: s(7),
  },
  chipIdle: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  chipLabel: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    fontWeight: '600',
  },
  chipLabelSm: {
    fontSize: typography.caption,
  },
  chipLabelActive: {
    color: '#04170C',
    fontSize: typography.bodySm,
    fontWeight: '800',
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: layout.pill,
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    padding: s(4),
    gap: s(4),
  },
  segmentItem: {
    flex: 1,
  },
  segmentActive: {
    paddingVertical: s(10),
    borderRadius: layout.pill,
    alignItems: 'center',
    overflow: 'hidden',
  },
  segmentIdle: {
    paddingVertical: s(10),
    borderRadius: layout.pill,
    alignItems: 'center',
  },
  segmentLabel: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    fontWeight: '600',
  },
  segmentLabelActive: {
    color: '#04170C',
    fontSize: typography.bodySm,
    fontWeight: '800',
  },
});
