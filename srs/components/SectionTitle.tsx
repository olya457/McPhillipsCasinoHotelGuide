import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, layout, s, typography} from '../theme';
import {Icon} from './Icon';

interface SectionTitleProps {
  title: string;
  caption?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionTitle = ({
  title,
  caption,
  actionLabel,
  onAction,
}: SectionTitleProps) => (
  <View style={styles.root}>
    <View style={styles.textBlock}>
      <View style={styles.titleRow}>
        <View style={styles.accent} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
    {actionLabel ? (
      <Pressable
        accessibilityRole="button"
        hitSlop={layout.hitSlop}
        onPress={onAction}
        style={({pressed}) => [styles.action, pressed && styles.pressed]}>
        <Text style={styles.actionLabel}>{actionLabel}</Text>
        <Icon name="chevron" size={s(13)} color={colors.emerald} />
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: s(10),
  },
  textBlock: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(9),
  },
  accent: {
    width: s(3),
    height: typography.h3,
    borderRadius: s(2),
    backgroundColor: colors.emerald,
  },
  title: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  caption: {
    marginTop: s(4),
    marginLeft: s(12),
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  actionLabel: {
    color: colors.emerald,
    fontSize: typography.bodySm,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.6,
  },
});
