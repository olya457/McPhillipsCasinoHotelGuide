import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, gradients, layout, s, typography} from '../theme';
import {Icon, type IconName} from './Icon';

type Variant = 'primary' | 'gold' | 'outline' | 'ghost' | 'danger';
type Size = 'lg' | 'md' | 'sm';

interface GradientButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const heightBySize: Record<Size, number> = {
  lg: layout.buttonHeight,
  md: layout.buttonHeight - s(8),
  sm: layout.buttonHeight - s(16),
};

const fontBySize: Record<Size, number> = {
  lg: typography.h3,
  md: typography.body,
  sm: typography.bodySm,
};

const gradientByVariant: Record<Variant, readonly string[]> = {
  primary: gradients.primary,
  gold: gradients.gold,
  danger: gradients.danger,
  outline: ['rgba(47,212,111,0.12)', 'rgba(11,18,14,0.6)'],
  ghost: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)'],
};

const textColorByVariant: Record<Variant, string> = {
  primary: '#04170C',
  gold: '#241A05',
  danger: '#2A0906',
  outline: colors.emerald,
  ghost: colors.textSoft,
};

export const GradientButton = ({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  iconRight,
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
}: GradientButtonProps) => {
  const isFlat = variant === 'outline' || variant === 'ghost';
  const textColor = textColorByVariant[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{disabled: inactive}}
      onPress={inactive ? undefined : onPress}
      style={({pressed}) => [
        styles.wrapper,
        fullWidth && styles.fullWidth,
        {height: heightBySize[size]},
        pressed && !inactive && styles.pressed,
        inactive && styles.disabled,
        style,
      ]}>
      <LinearGradient
        colors={[...gradientByVariant[variant]]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[
          styles.gradient,
          isFlat && styles.flatBorder,
          variant === 'ghost' && styles.ghostBorder,
        ]}>
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <View style={styles.content}>
            {icon ? (
              <Icon name={icon} size={fontBySize[size] + s(4)} color={textColor} />
            ) : null}
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                {color: textColor, fontSize: fontBySize[size]},
              ]}>
              {label}
            </Text>
            {iconRight ? (
              <Icon
                name={iconRight}
                size={fontBySize[size] + s(2)}
                color={textColor}
              />
            ) : null}
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: layout.pill,
    overflow: 'hidden',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  pressed: {
    transform: [{scale: 0.98}],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.42,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(20),
    borderRadius: layout.pill,
    overflow: 'hidden',
  },
  flatBorder: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  ghostBorder: {
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
