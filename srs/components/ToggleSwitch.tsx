import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, gradients, s} from '../theme';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (next: boolean) => void;
  accessibilityLabel?: string;
}

const TRACK_WIDTH = s(50);
const TRACK_HEIGHT = s(28);
const KNOB = s(22);

export const ToggleSwitch = ({
  value,
  onValueChange,
  accessibilityLabel,
}: ToggleSwitchProps) => {
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [progress, value]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [s(3), TRACK_WIDTH - KNOB - s(3)],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{checked: value}}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      onPress={() => onValueChange(!value)}>
      <View style={styles.track}>
        {value ? (
          <LinearGradient
            colors={[...gradients.primaryFlat]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.trackFill}
          />
        ) : null}
        <Animated.View style={[styles.knob, {transform: [{translateX}]}]} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  trackFill: {
    ...StyleSheet.absoluteFill,
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: colors.white,
  },
});
