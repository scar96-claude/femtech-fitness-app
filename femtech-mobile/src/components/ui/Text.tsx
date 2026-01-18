import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'neutral' | 'error' | 'success' | 'white';
  children: React.ReactNode;
}

export function Text({
  variant = 'body',
  color = 'neutral',
  style,
  children,
  ...props
}: TextProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return styles.h1;
      case 'h2':
        return styles.h2;
      case 'h3':
        return styles.h3;
      case 'body':
        return styles.body;
      case 'caption':
        return styles.caption;
      case 'label':
        return styles.label;
      default:
        return styles.body;
    }
  };

  const getColorValue = () => {
    switch (color) {
      case 'primary':
        return COLORS.primary[500];
      case 'secondary':
        return COLORS.secondary[500];
      case 'neutral':
        return COLORS.neutral[900];
      case 'error':
        return COLORS.error;
      case 'success':
        return COLORS.success;
      case 'white':
        return COLORS.white;
      default:
        return COLORS.neutral[900];
    }
  };

  return (
    <RNText
      style={[getVariantStyles(), { color: getColorValue() }, style]}
      {...props}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
