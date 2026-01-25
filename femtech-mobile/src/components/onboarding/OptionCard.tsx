import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { impactLight, impactMedium, notificationSuccess, selectionChanged } from '@/utils/haptics';
import { COLORS } from '@/constants/colors';

interface OptionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}

export function OptionCard({
  title,
  description,
  icon,
  selected,
  onSelect,
}: OptionCardProps) {
  const handlePress = () => {
    impactLight();
    onSelect();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.container, selected && styles.containerSelected]}
    >
      <View style={styles.content}>
        {icon && (
          <View style={[styles.iconBox, selected && styles.iconBoxSelected]}>
            {icon}
          </View>
        )}

        <View style={styles.textContainer}>
          <Text style={[styles.title, selected && styles.titleSelected]}>
            {title}
          </Text>

          {description && (
            <Text
              style={[styles.description, selected && styles.descriptionSelected]}
            >
              {description}
            </Text>
          )}
        </View>

        {selected && (
          <View style={styles.checkCircle}>
            <Check size={16} color={COLORS.white} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
    backgroundColor: COLORS.white,
    marginBottom: 12,
  },
  containerSelected: {
    borderColor: COLORS.primary[500],
    backgroundColor: COLORS.primary[50],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.neutral[100],
    marginRight: 16,
  },
  iconBoxSelected: {
    backgroundColor: COLORS.primary[100],
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.neutral[900],
  },
  titleSelected: {
    color: COLORS.primary[700],
  },
  description: {
    fontSize: 14,
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  descriptionSelected: {
    color: COLORS.primary[600],
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
