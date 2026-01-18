import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  secureTextEntry,
  style,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = secureTextEntry !== undefined;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            error ? styles.inputError : null,
            isFocused ? styles.inputFocused : null,
            style,
          ]}
          placeholderTextColor={COLORS.neutral[400]}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color={COLORS.neutral[500]} />
            ) : (
              <Eye size={20} color={COLORS.neutral[500]} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    color: COLORS.neutral[700],
    fontWeight: '500',
    marginBottom: 8,
    fontSize: 14,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.neutral[100],
    color: COLORS.neutral[900],
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputFocused: {
    borderColor: COLORS.primary[500],
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: COLORS.neutral[500],
    fontSize: 12,
    marginTop: 4,
  },
});
