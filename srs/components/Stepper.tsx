import React from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {colors, layout, s, typography} from '../theme';
import {Icon} from './Icon';

interface StepperProps {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  hint?: string;
  placeholder?: string;
}

export const Stepper = ({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  hint,
  placeholder = '0',
}: StepperProps) => {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  return (
    <View style={styles.root}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Decrease"
          onPress={() => onChange(clamp(value - 1))}
          style={({pressed}) => [styles.button, pressed && styles.pressed]}>
          <Icon name="close" size={s(14)} color={colors.textSoft} />
        </Pressable>
        <TextInput
          value={value ? `${value}` : ''}
          onChangeText={text => {
            const digits = text.replace(/[^0-9]/g, '');
            onChange(digits ? clamp(Number(digits)) : 0);
          }}
          keyboardType="number-pad"
          placeholder={placeholder}
          placeholderTextColor={colors.textDim}
          selectionColor={colors.emerald}
          maxLength={3}
          style={styles.input}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Increase"
          onPress={() => onChange(clamp(value + 1))}
          style={({pressed}) => [styles.button, pressed && styles.pressed]}>
          <Icon name="plus" size={s(16)} color={colors.emerald} />
        </Pressable>
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    gap: s(7),
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.micro,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  button: {
    width: layout.inputHeight,
    height: layout.inputHeight,
    borderRadius: layout.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  pressed: {
    opacity: 0.6,
  },
  input: {
    flex: 1,
    height: layout.inputHeight,
    borderRadius: layout.radiusMd,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    textAlign: 'center',
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '700',
    padding: 0,
  },
  hint: {
    color: colors.textDim,
    fontSize: typography.caption,
  },
});
