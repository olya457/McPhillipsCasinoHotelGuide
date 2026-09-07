import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import {gradients} from '../theme';

interface GradientTextProps {
  children: string;
  style?: StyleProp<TextStyle>;
  colors?: readonly string[];
  numberOfLines?: number;
}

export const GradientText = ({
  children,
  style,
  colors = gradients.gold,
  numberOfLines,
}: GradientTextProps) => (
  <MaskedView
    maskElement={
      <View style={styles.maskWrapper}>
        <Text numberOfLines={numberOfLines} style={[style, styles.maskText]}>
          {children}
        </Text>
      </View>
    }>
    <LinearGradient
      colors={[...colors]}
      start={{x: 0, y: 0.2}}
      end={{x: 1, y: 0.9}}>
      <Text numberOfLines={numberOfLines} style={[style, styles.hiddenText]}>
        {children}
      </Text>
    </LinearGradient>
  </MaskedView>
);

const styles = StyleSheet.create({
  maskWrapper: {
    backgroundColor: 'transparent',
  },
  maskText: {
    backgroundColor: 'transparent',
  },
  hiddenText: {
    opacity: 0,
  },
});
