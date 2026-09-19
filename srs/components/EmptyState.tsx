import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, layout, s, typography} from '../theme';
import {Icon, type IconName} from './Icon';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  message: string;
  children?: React.ReactNode;
}

export const EmptyState = ({
  icon,
  title,
  message,
  children,
}: EmptyStateProps) => (
  <View style={styles.root}>
    <LinearGradient
      colors={['rgba(47,212,111,0.16)', 'rgba(33,18,51,0.7)']}
      style={styles.badge}>
      <Icon name={icon} size={s(26)} color={colors.emerald} />
    </LinearGradient>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    {children ? <View style={styles.actions}>{children}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    paddingVertical: s(28),
    paddingHorizontal: layout.gutter,
  },
  badge: {
    width: s(62),
    height: s(62),
    borderRadius: s(31),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  title: {
    marginTop: s(14),
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    marginTop: s(6),
    color: colors.textMuted,
    fontSize: typography.bodySm,
    lineHeight: typography.bodySm * 1.5,
    textAlign: 'center',
    maxWidth: s(280),
  },
  actions: {
    marginTop: s(18),
    alignSelf: 'stretch',
    paddingHorizontal: s(20),
  },
});
