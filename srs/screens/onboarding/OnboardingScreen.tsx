import React, {useCallback, useRef, useState} from 'react';
import {
  Animated,
  FlatList,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {GradientButton, GradientText} from '../../components';
import {colors, layout, s, screenWidth, typography, vs} from '../../theme';
import {useAppState} from '../../store/AppStateContext';
import type {RootStackParamList} from '../../navigation/types';
import {onboardingSlides, type OnboardingSlide} from './slides';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const DOT_WIDTH = s(26);
const DOT_MIN_SCALE = 7 / 26;

export const OnboardingScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();
  const {completeOnboarding} = useAppState();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  const isLast = index === onboardingSlides.length - 1;

  const finish = useCallback(() => {
    completeOnboarding();
    navigation.replace('Main');
  }, [completeOnboarding, navigation]);

  const goNext = useCallback(() => {
    if (isLast) {
      finish();
      return;
    }
    listRef.current?.scrollToOffset({
      offset: (index + 1) * screenWidth,
      animated: true,
    });
  }, [finish, index, isLast]);

  const onMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(
        event.nativeEvent.contentOffset.x / screenWidth,
      );
      setIndex(next);
    },
    [],
  );

  const renderItem = useCallback(
    ({item}: {item: OnboardingSlide}) => (
      <ImageBackground
        source={item.image}
        style={styles.slide}
        resizeMode="cover">
        <LinearGradient
          colors={[
            'rgba(6,9,7,0.35)',
            'rgba(6,9,7,0.62)',
            'rgba(6,9,7,0.97)',
          ]}
          locations={[0, 0.45, 0.86]}
          style={styles.slideOverlay}
        />
      </ImageBackground>
    ),
    [],
  );

  const current = onboardingSlides[index];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Animated.FlatList
        ref={listRef}
        data={onboardingSlides}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.topBar, {paddingTop: insets.top + s(10)}]}>
        {!isLast ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={layout.hitSlop}
            onPress={finish}
            style={({pressed}) => [styles.skip, pressed && styles.pressed]}>
            <Text style={styles.skipLabel}>Skip</Text>
          </Pressable>
        ) : (
          <View style={styles.skipPlaceholder} />
        )}
      </View>

      <View style={[styles.footer, {paddingBottom: insets.bottom + vs(20)}]}>
        <View style={styles.textBlock}>
          <Text style={styles.eyebrow}>{current.eyebrow}</Text>
          <GradientText style={styles.title}>{current.title}</GradientText>
          <Text style={styles.description}>{current.description}</Text>
        </View>

        <View style={styles.dots}>
          {onboardingSlides.map((slide, dotIndex) => {
            const inputRange = [
              (dotIndex - 1) * screenWidth,
              dotIndex * screenWidth,
              (dotIndex + 1) * screenWidth,
            ];
            const scaleX = scrollX.interpolate({
              inputRange,
              outputRange: [DOT_MIN_SCALE, 1, DOT_MIN_SCALE],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.32, 1, 0.32],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={slide.id}
                style={[styles.dot, {opacity, transform: [{scaleX}]}]}
              />
            );
          })}
        </View>

        <GradientButton
          label={isLast ? 'Enter the complex' : 'Continue'}
          iconRight={isLast ? undefined : 'chevron'}
          onPress={goNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'flex-end',
  },
  slide: {
    width: screenWidth,
    height: '100%',
  },
  slideOverlay: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    alignItems: 'flex-end',
    paddingHorizontal: layout.gutter,
  },
  skip: {
    paddingHorizontal: s(14),
    paddingVertical: s(7),
    borderRadius: layout.pill,
    backgroundColor: 'rgba(6,9,7,0.5)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  skipPlaceholder: {
    height: s(32),
  },
  pressed: {
    opacity: 0.6,
  },
  skipLabel: {
    color: colors.textSoft,
    fontSize: typography.bodySm,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: layout.gutter,
    gap: vs(18),
  },
  textBlock: {
    gap: s(8),
  },
  eyebrow: {
    color: colors.emerald,
    fontSize: typography.micro,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  title: {
    fontSize: typography.display,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  description: {
    color: colors.textSoft,
    fontSize: typography.body,
    lineHeight: typography.body * 1.55,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(2),
  },
  dot: {
    width: DOT_WIDTH,
    height: s(7),
    borderRadius: s(4),
    backgroundColor: colors.emerald,
  },
});
