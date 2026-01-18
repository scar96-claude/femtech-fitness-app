import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export function Logo({ size = 'md', variant = 'dark' }: LogoProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { container: 48, text: 24 };
      case 'md':
        return { container: 72, text: 36 };
      case 'lg':
        return { container: 96, text: 48 };
      default:
        return { container: 72, text: 36 };
    }
  };

  const sizeStyles = getSizeStyles();
  const isLight = variant === 'light';

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeStyles.container,
          height: sizeStyles.container,
          backgroundColor: isLight ? 'rgba(255, 255, 255, 0.2)' : COLORS.primary[500],
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: sizeStyles.text,
            color: isLight ? COLORS.white : COLORS.white,
          },
        ]}
      >
        F
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});
