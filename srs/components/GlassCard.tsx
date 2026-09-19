import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, layout} from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  highlighted?: boolean;
  tone?: 'default' | 'emerald' | 'gold' | 'danger';
}

const toneColors: Record<string, readonly string[]> = {
  default: ['rgba(50,32,71,0.92)', 'rgba(33,18,51,0.92)'],
  emerald: ['rgba(47,212,111,0.16)', 'rgba(33,18,51,0.9)'],
  gold: ['rgba(231,206,142,0.14)', 'rgba(33,18,51,0.9)'],
  danger: ['rgba(229,87,78,0.14)', 'rgba(33,18,51,0.9)'],
};

const toneBorders: Record<string, string> = {
  default: colors.borderNeutral,
  emerald: colors.borderStrong,
  gold: 'rgba(231,206,142,0.32)',
  danger: 'rgba(229,87,78,0.32)',
};

export const GlassCard = ({
  children,
  onPress,
  style,
  padded = true,
  highlighted = false,
  tone = 'default',
}: GlassCardProps) => {
  const body = (
    <LinearGradient
      colors={[...toneColors[tone]]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[
        styles.card,
        {borderColor: highlighted ? colors.borderStrong : toneBorders[tone]},
        highlighted && styles.highlighted,
        padded && styles.padded,
        style,
      ]}>
      {children}
    </LinearGradient>
  );

  if (!onPress) {
    return body;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [styles.pressable, pressed && styles.pressed]}>
      {body}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: layout.radiusLg,
  },
  pressed: {
    opacity: 0.86,
    transform: [{scale: 0.995}],
  },
  card: {
    borderRadius: layout.radiusLg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  padded: {
    padding: layout.gutter - 2,
  },
  highlighted: {
    borderWidth: 1.4,
  },
});

export const CardDivider = () => <View style={dividerStyles.divider} />;

const dividerStyles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.borderNeutral,
    marginVertical: layout.gap,
  },
});
