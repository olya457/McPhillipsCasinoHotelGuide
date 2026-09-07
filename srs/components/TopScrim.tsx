import React from 'react';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {s} from '../theme';

export const TopScrim = () => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      pointerEvents="none"
      colors={['rgba(6,9,7,0.92)', 'rgba(6,9,7,0.55)', 'rgba(6,9,7,0)']}
      style={[styles.scrim, {height: insets.top + s(14)}]}
    />
  );
};

const styles = StyleSheet.create({
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
});
