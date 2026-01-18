import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  children: React.ReactNode;
}

export function Card({
  children,
  variant = 'default',
  style,
  ...props
}: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return styles.elevated;
      case 'outlined':
        return styles.outlined;
      default:
        return styles.default;
    }
  };

  return (
    <View style={[styles.base, getVariantStyles(), style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    padding: 16,
  },
  default: {
    backgroundColor: COLORS.white,
  },
  elevated: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  outlined: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
});
