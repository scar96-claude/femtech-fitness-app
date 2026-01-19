import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface SettingsRowProps {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  isDestructive?: boolean;
  showDivider?: boolean;
}

export function SettingsRow({
  icon,
  label,
  value,
  onPress,
  isSwitch,
  switchValue,
  onSwitchChange,
  isDestructive,
  showDivider = true,
}: SettingsRowProps) {
  const content = (
    <View style={[styles.container, showDivider && styles.borderBottom]}>
      {icon && (
        <View style={styles.iconBox}>
          {icon}
        </View>
      )}

      <Text
        style={[
          styles.label,
          isDestructive && styles.destructiveLabel,
        ]}
      >
        {label}
      </Text>

      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#e5e5e5', true: '#bae0fd' }}
          thumbColor={switchValue ? COLORS.primary[500] : '#ffffff'}
        />
      ) : (
        <View style={styles.rightContent}>
          {value && (
            <Text style={styles.valueText}>{value}</Text>
          )}
          {onPress && (
            <ChevronRight size={20} color={COLORS.neutral[300]} />
          )}
        </View>
      )}
    </View>
  );

  if (onPress && !isSwitch) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  iconBox: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: COLORS.neutral[900],
  },
  destructiveLabel: {
    color: COLORS.error,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    color: COLORS.neutral[500],
    marginRight: 8,
  },
});
