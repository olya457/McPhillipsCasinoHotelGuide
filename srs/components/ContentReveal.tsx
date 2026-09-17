import React, { useCallback, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

interface ContentRevealProps {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
}

export const ContentReveal = ({
  children,
  delay = 0,
  distance = 16,
  style,
}: ContentRevealProps) => {
  const progress = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      let active = true;
      let preferenceChanged = false;
      let animation: Animated.CompositeAnimation | undefined;
      const showImmediately = () => {
        animation?.stop();
        progress.setValue(1);
      };
      const subscription = AccessibilityInfo.addEventListener(
        'reduceMotionChanged',
        () => {
          preferenceChanged = true;
          showImmediately();
        },
      );

      AccessibilityInfo.isReduceMotionEnabled().then(
        reducedMotion => {
          if (!active || preferenceChanged) {
            return;
          }
          if (reducedMotion) {
            showImmediately();
            return;
          }
          progress.setValue(0);
          animation = Animated.timing(progress, {
            toValue: 1,
            duration: 420,
            delay: Math.min(Math.max(delay, 0), 240),
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
            isInteraction: false,
          });
          animation.start();
        },
        () => {
          if (active) {
            showImmediately();
          }
        },
      );

      return () => {
        active = false;
        subscription.remove();
        showImmediately();
      };
    }, [delay, progress]),
  );

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [distance, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
