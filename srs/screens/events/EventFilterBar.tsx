import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Icon} from '../../components';
import {colors, layout, s, typography} from '../../theme';

export interface FilterGroup {
  key: 'category' | 'date' | 'format';
  label: string;
  options: string[];
  value: string | null;
}

interface EventFilterBarProps {
  groups: FilterGroup[];
  onOpen: (key: FilterGroup['key']) => void;
  onReset: () => void;
  activeCount: number;
}

export const EventFilterBar = ({
  groups,
  onOpen,
  onReset,
  activeCount,
}: EventFilterBarProps) => (
  <View style={styles.root}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {groups.map(group => {
        const active = group.value != null;
        return (
          <Pressable
            key={group.key}
            accessibilityRole="button"
            accessibilityState={{selected: active}}
            onPress={() => onOpen(group.key)}
            style={({pressed}) => [
              styles.button,
              active && styles.buttonActive,
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.label, active && styles.labelActive]}>
              {group.value ?? group.label}
            </Text>
            <Icon
              name="chevron"
              size={s(11)}
              color={active ? colors.emerald : colors.textDim}
            />
          </Pressable>
        );
      })}
      {activeCount > 0 ? (
        <Pressable
          accessibilityRole="button"
          onPress={onReset}
          style={({pressed}) => [styles.reset, pressed && styles.pressed]}>
          <Icon name="close" size={s(12)} color={colors.textSoft} />
          <Text style={styles.resetLabel}>Reset</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  root: {
    marginHorizontal: -layout.gutter,
  },
  row: {
    flexDirection: 'row',
    gap: s(8),
    paddingHorizontal: layout.gutter,
    paddingVertical: s(2),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(7),
    paddingHorizontal: s(14),
    paddingVertical: s(10),
    borderRadius: layout.pill,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  buttonActive: {
    backgroundColor: 'rgba(47,212,111,0.12)',
    borderColor: colors.borderStrong,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.emeraldSoft,
    fontWeight: '800',
  },
  reset: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingHorizontal: s(13),
    paddingVertical: s(10),
    borderRadius: layout.pill,
    borderWidth: 1,
    borderColor: 'rgba(229,87,78,0.3)',
    backgroundColor: 'rgba(229,87,78,0.1)',
  },
  resetLabel: {
    color: colors.textSoft,
    fontSize: typography.bodySm,
    fontWeight: '700',
  },
});
