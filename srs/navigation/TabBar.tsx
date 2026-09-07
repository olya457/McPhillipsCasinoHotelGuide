import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {colors, gradients, layout, s, typography} from '../theme';
import {Icon, type IconName} from '../components/Icon';
import type {TabParamList} from './types';

const meta: Record<keyof TabParamList, {icon: IconName; label: string}> = {
  Tonight: {icon: 'tonight', label: 'Tonight'},
  Events: {icon: 'events', label: 'Events'},
  SeatBooking: {icon: 'seat', label: 'Seats'},
  Gallery: {icon: 'gallery', label: 'Gallery'},
  Venues: {icon: 'venues', label: 'Venues'},
};

export const TabBar = ({state, navigation}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[...gradients.tabBar]}
      style={[styles.root, {paddingBottom: Math.max(insets.bottom, s(8))}]}>
      <View style={styles.inner}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const config = meta[route.name as keyof TabParamList];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{selected: focused}}
              accessibilityLabel={config.label}
              onPress={onPress}
              style={styles.item}>
              {focused ? (
                <LinearGradient
                  colors={['rgba(47,212,111,0.22)', 'rgba(47,212,111,0.02)']}
                  style={styles.activeGlow}
                />
              ) : null}
              <Icon
                name={config.icon}
                size={s(21)}
                color={focused ? colors.emerald : colors.textDim}
                strokeWidth={focused ? 1.9 : 1.5}
              />
              <Text
                numberOfLines={1}
                style={[styles.label, focused && styles.labelActive]}>
                {config.label}
              </Text>
              <View style={[styles.dot, !focused && styles.dotIdle]} />
            </Pressable>
          );
        })}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    borderTopWidth: 1,
    borderTopColor: colors.borderNeutral,
    paddingTop: s(9),
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(8),
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: s(4),
    paddingVertical: s(4),
    borderRadius: layout.radiusMd,
    overflow: 'hidden',
  },
  activeGlow: {
    position: 'absolute',
    top: 0,
    left: s(8),
    right: s(8),
    height: '100%',
    borderRadius: layout.radiusMd,
  },
  label: {
    color: colors.textDim,
    fontSize: typography.micro,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  labelActive: {
    color: colors.emeraldSoft,
    fontWeight: '800',
  },
  dot: {
    width: s(4),
    height: s(4),
    borderRadius: s(2),
    backgroundColor: colors.emerald,
  },
  dotIdle: {
    backgroundColor: 'transparent',
  },
});
