import React from 'react';
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients } from '../theme';
import { ContentReveal } from './ContentReveal';

interface ScreenContainerProps {
  children: React.ReactNode;
  background?: ImageSourcePropType;
  overlay?: readonly string[];
  edges?: { top?: boolean; bottom?: boolean };
  style?: StyleProp<ViewStyle>;
}

export const ScreenContainer = ({
  children,
  background,
  overlay = ['rgba(6,9,7,0.6)', 'rgba(6,9,7,0.94)', colors.bg],
  edges = { top: true, bottom: false },
  style,
}: ScreenContainerProps) => {
  const insets = useSafeAreaInsets();

  const content = (
    <ContentReveal
      distance={10}
      style={[
        styles.content,
        {
          paddingTop: edges.top ? insets.top : 0,
          paddingBottom: edges.bottom ? insets.bottom : 0,
        },
        style,
      ]}
    >
      {children}
    </ContentReveal>
  );

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {background ? (
        <ImageBackground
          source={background}
          style={styles.image}
          resizeMode="cover"
        >
          <LinearGradient colors={[...overlay]} style={styles.fill}>
            {content}
          </LinearGradient>
        </ImageBackground>
      ) : (
        <LinearGradient
          colors={[...gradients.dark, colors.bg]}
          style={styles.fill}
        >
          {content}
        </LinearGradient>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  image: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
