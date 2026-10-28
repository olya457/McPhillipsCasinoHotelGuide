import React, { useEffect, useRef } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoadingIndicator } from './LoadingIndicator';
import { colors, gradients, font, layout } from '../../theme';
import { useAppState } from '../../store/AppStateContext';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

const SPLASH_DURATION = 4000;

export const LoadingScreen = ({ navigation }: Props) => {
  const { hydrated, onboardingDone } = useAppState();
  const insets = useSafeAreaInsets();
  const elapsed = useRef(false);
  const navigated = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      elapsed.current = true;
      if (hydrated && !navigated.current) {
        navigated.current = true;
        navigation.replace(onboardingDone ? 'Main' : 'Onboarding');
      }
    }, SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, [hydrated, navigation, onboardingDone]);

  useEffect(() => {
    if (elapsed.current && hydrated && !navigated.current) {
      navigated.current = true;
      navigation.replace(onboardingDone ? 'Main' : 'Onboarding');
    }
  }, [hydrated, navigation, onboardingDone]);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={[...gradients.dark, colors.bg]}
        style={styles.background}
      >
        <Text accessibilityRole="header" style={styles.title}>Find Your Stay</Text>
      </LinearGradient>
      <View
        pointerEvents="none"
        style={[styles.loader, { bottom: insets.bottom + 40 }]}
      >
        <LoadingIndicator />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.gutter,
  },
  title: {
    color: colors.text,
    fontSize: font(42),
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
});
