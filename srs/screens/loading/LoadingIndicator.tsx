import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet } from 'react-native';

export const LoadingIndicator = () => {
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let active = true;
    let preferenceChanged = false;
    let animation: Animated.CompositeAnimation | undefined;
    const updateAnimation = (reduceMotion: boolean) => {
      if (!active) {
        return;
      }
      animation?.stop();
      progress.setValue(reduceMotion ? 0 : 1);
      if (reduceMotion) {
        return;
      }
      const timing = (toValue: number, reverse: boolean) =>
        Animated.timing(progress, {
          toValue,
          duration: 1000,
          easing: reverse
            ? Easing.out(Easing.bezier(0.25, 0.1, 0.25, 1))
            : Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
          isInteraction: false,
        });
      animation = Animated.loop(
        Animated.sequence([timing(0, true), timing(1, false)]),
      );
      animation.start();
    };
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      reducedMotion => {
        preferenceChanged = true;
        updateAnimation(reducedMotion);
      },
    );
    AccessibilityInfo.isReduceMotionEnabled().then(
      reducedMotion => {
        if (!preferenceChanged) {
          updateAnimation(reducedMotion);
        }
      },
      () => updateAnimation(true),
    );
    return () => {
      active = false;
      animation?.stop();
      subscription.remove();
    };
  }, [progress]);

  return (
    <Animated.View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      accessibilityState={{ busy: true }}
      style={[
        styles.square,
        {
          transform: [
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.3],
              }),
            },
            {
              rotate: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  square: {
    width: 48,
    height: 48,
    backgroundColor: '#B7F34D',
  },
});
