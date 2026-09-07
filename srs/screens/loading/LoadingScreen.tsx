import React, {useEffect, useRef} from 'react';
import {ImageBackground, StatusBar, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {brand} from '../../assets/images';
import {colors} from '../../theme';
import {useAppState} from '../../store/AppStateContext';
import type {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

const SPLASH_DURATION = 4000;

export const LoadingScreen = ({navigation}: Props) => {
  const {hydrated, onboardingDone} = useAppState();
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
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={brand.splashBackground}
        style={styles.background}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  background: {
    flex: 1,
  },
});
