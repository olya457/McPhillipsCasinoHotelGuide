import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {brand} from '../../assets/images';
import {colors, layout, s, typography, vs} from '../../theme';
import {useAppState} from '../../store/AppStateContext';
import type {RootStackParamList} from '../../navigation/types';
import {loaderHtml} from './loaderHtml';

type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

const SPLASH_DURATION = 4000;

export const LoadingScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();
  const {hydrated, onboardingDone} = useAppState();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.86)).current;
  const captionOpacity = useRef(new Animated.Value(0)).current;
  const elapsed = useRef(false);
  const navigated = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 42,
        useNativeDriver: true,
      }),
      Animated.timing(captionOpacity, {
        toValue: 1,
        delay: 500,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, [captionOpacity, logoOpacity, logoScale]);

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
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(6,9,7,0.55)', 'rgba(6,9,7,0.4)', 'rgba(6,9,7,0.96)']}
          style={styles.overlay}>
          <View style={[styles.body, {paddingTop: insets.top + vs(40)}]}>
            <Animated.View
              style={[
                styles.logoWrapper,
                {opacity: logoOpacity, transform: [{scale: logoScale}]},
              ]}>
              <Image
                source={brand.logo}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>

            <Animated.View style={{opacity: captionOpacity}}>
              <Text style={styles.title}>McPhillips Station</Text>
              <View style={styles.divider} />
              <Text style={styles.caption}>Casino · Hotel · Guide</Text>
            </Animated.View>
          </View>

          <View style={[styles.loaderZone, {paddingBottom: insets.bottom + vs(34)}]}>
            <View style={styles.webViewFrame}>
              <WebView
                source={{html: loaderHtml}}
                originWhitelist={['*']}
                style={styles.webView}
                containerStyle={styles.webViewContainer}
                scrollEnabled={false}
                overScrollMode="never"
                bounces={false}
                javaScriptEnabled={false}
                setSupportMultipleWindows={false}
                androidLayerType="hardware"
                opaque={false}
                backgroundColor="transparent"
                pointerEvents="none"
              />
            </View>
            <Text style={styles.loaderLabel}>Preparing tonight’s programme</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
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
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  body: {
    alignItems: 'center',
    paddingHorizontal: layout.gutter,
  },
  logoWrapper: {
    width: s(190),
    height: s(190),
    borderRadius: s(95),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: 'rgba(6,9,7,0.4)',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    marginTop: vs(26),
    color: colors.text,
    fontSize: typography.display,
    fontWeight: '800',
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  divider: {
    alignSelf: 'center',
    marginTop: s(12),
    width: s(56),
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.emerald,
  },
  caption: {
    marginTop: s(12),
    color: colors.textMuted,
    fontSize: typography.bodySm,
    letterSpacing: 3.2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  loaderZone: {
    alignItems: 'center',
  },
  webViewFrame: {
    width: s(96),
    height: s(96),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  webView: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  webViewContainer: {
    backgroundColor: 'transparent',
  },
  loaderLabel: {
    marginTop: s(6),
    color: colors.textDim,
    fontSize: typography.caption,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
});
