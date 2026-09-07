import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {colors, layout, s, typography} from '../theme';

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  hint?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

export const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = 'default',
  maxLength,
  hint,
  error,
  style,
}: TextFieldProps) => (
  <View style={[styles.root, style]}>
    <Text style={styles.label}>{label}</Text>
    <View
      style={[
        styles.inputWrapper,
        multiline && styles.multilineWrapper,
        !!error && styles.errorBorder,
      ]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textDim}
        multiline={multiline}
        keyboardType={keyboardType}
        maxLength={maxLength}
        selectionColor={colors.emerald}
        style={[styles.input, multiline && styles.multilineInput]}
      />
    </View>
    {error ? (
      <Text style={styles.error}>{error}</Text>
    ) : hint ? (
      <Text style={styles.hint}>{hint}</Text>
    ) : null}
  </View>
);

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
  inputWrapper: {
    minHeight: layout.inputHeight,
    borderRadius: layout.radiusMd,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    justifyContent: 'center',
    paddingHorizontal: s(14),
  },
  multilineWrapper: {
    minHeight: layout.inputHeight * 1.9,
    paddingVertical: s(10),
  },
  errorBorder: {
    borderColor: 'rgba(229,87,78,0.55)',
  },
  input: {
    color: colors.text,
    fontSize: typography.body,
    padding: 0,
  },
  multilineInput: {
    minHeight: layout.inputHeight * 1.5,
    textAlignVertical: 'top',
  },
  hint: {
    color: colors.textDim,
    fontSize: typography.caption,
  },
  error: {
    color: '#F09A93',
    fontSize: typography.caption,
  },
});
