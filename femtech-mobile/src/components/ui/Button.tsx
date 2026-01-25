import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native';
import { impactLight } from '@/utils/haptics';
import { COLORS } from '@/constants/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  onPress,
  style,
  ...props
}: ButtonProps) {
  const handlePress = (e: unknown) => {
    impactLight();
    onPress?.(e as never);
  };

  const getBackgroundColor = () => {
    if (disabled || loading) {
      switch (variant) {
        case 'primary':
          return `${COLORS.primary[500]}80`;
        case 'secondary':
          return `${COLORS.secondary[500]}80`;
        default:
          return 'transparent';
      }
    }
    switch (variant) {
      case 'primary':
        return COLORS.primary[500];
      case 'secondary':
        return COLORS.secondary[500];
      default:
        return 'transparent';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return COLORS.white;
      case 'outline':
      case 'ghost':
        return COLORS.primary[500];
      default:
        return COLORS.white;
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'sm':
        return 40;
      case 'md':
        return 48;
      case 'lg':
        return 56;
      default:
        return 48;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return 14;
      case 'md':
        return 16;
      case 'lg':
        return 18;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        {
          backgroundColor: getBackgroundColor(),
          height: getHeight(),
          width: fullWidth ? '100%' : 'auto',
          borderWidth: variant === 'outline' ? 2 : 0,
          borderColor: variant === 'outline' ? COLORS.primary[500] : 'transparent',
        },
        style,
      ]}
      disabled={disabled || loading}
      onPress={handlePress}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary[500] : COLORS.white}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: getFontSize(),
            },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
  },
  text: {
    fontWeight: '600',
  },
});
