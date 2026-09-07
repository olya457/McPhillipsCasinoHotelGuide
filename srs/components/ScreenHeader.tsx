import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, layout, s, typography} from '../theme';
import {GradientText} from './GradientText';
import {Icon, type IconName} from './Icon';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actionIcon?: IconName;
  onAction?: () => void;
  compact?: boolean;
}

export const ScreenHeader = ({
  title,
  subtitle,
  onBack,
  actionIcon,
  onAction,
  compact = false,
}: ScreenHeaderProps) => (
  <View style={[styles.root, compact && styles.compact]}>
    <View style={styles.side}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={layout.hitSlop}
          onPress={onBack}
          style={({pressed}) => [styles.circle, pressed && styles.pressed]}>
          <Icon name="back" size={s(20)} color={colors.textSoft} />
        </Pressable>
      ) : (
        <View style={styles.circlePlaceholder} />
      )}
    </View>

    <View style={styles.center}>
      <GradientText numberOfLines={1} style={styles.title}>
        {title}
      </GradientText>
      {subtitle ? (
        <Text numberOfLines={1} style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>

    <View style={styles.side}>
      {actionIcon ? (
        <Pressable
          accessibilityRole="button"
          hitSlop={layout.hitSlop}
          onPress={onAction}
          style={({pressed}) => [styles.circle, pressed && styles.pressed]}>
          <Icon name={actionIcon} size={s(20)} color={colors.emerald} />
        </Pressable>
      ) : (
        <View style={styles.circlePlaceholder} />
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.gutter,
    paddingTop: s(8),
    paddingBottom: s(12),
    gap: s(10),
  },
  compact: {
    paddingBottom: s(6),
  },
  side: {
    width: s(40),
    alignItems: 'center',
  },
  circle: {
    width: s(38),
    height: s(38),
    borderRadius: s(19),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  circlePlaceholder: {
    width: s(38),
    height: s(38),
  },
  pressed: {
    opacity: 0.6,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.h2,
    fontWeight: '800',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: s(2),
    fontSize: typography.caption,
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
});
