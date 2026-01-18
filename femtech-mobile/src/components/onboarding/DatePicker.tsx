import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from 'react-native';
import { Calendar } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label: string;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  maximumDate,
  minimumDate,
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempYear, setTempYear] = useState(
    value?.getFullYear() || new Date().getFullYear() - 30
  );
  const [tempMonth, setTempMonth] = useState(
    value?.getMonth() || 0
  );
  const [tempDay, setTempDay] = useState(value?.getDate() || 1);

  const formatDate = (date: Date): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleConfirm = () => {
    const newDate = new Date(tempYear, tempMonth, tempDay);
    onChange(newDate);
    setShowPicker(false);
  };

  const years = [];
  const maxYear = maximumDate?.getFullYear() || new Date().getFullYear();
  const minYear = minimumDate?.getFullYear() || 1940;
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y);
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const days = [];
  const daysInMonth = getDaysInMonth(tempYear, tempMonth);
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.inputButton}
      >
        <Calendar size={20} color={COLORS.neutral[500]} />
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {value ? formatDate(value) : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerRow}>
              {/* Month Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Month</Text>
                <View style={styles.scrollContainer}>
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      onPress={() => setTempMonth(index)}
                      style={[
                        styles.pickerItem,
                        tempMonth === index && styles.pickerItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          tempMonth === index && styles.pickerItemTextSelected,
                        ]}
                      >
                        {month.slice(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Day Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Day</Text>
                <View style={styles.scrollContainer}>
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      onPress={() => setTempDay(day)}
                      style={[
                        styles.pickerItem,
                        tempDay === day && styles.pickerItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          tempDay === day && styles.pickerItemTextSelected,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Year Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Year</Text>
                <View style={styles.scrollContainer}>
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      onPress={() => setTempYear(year)}
                      style={[
                        styles.pickerItem,
                        tempYear === year && styles.pickerItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          tempYear === year && styles.pickerItemTextSelected,
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.neutral[700],
    fontWeight: '500',
    marginBottom: 8,
    fontSize: 14,
  },
  inputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.neutral[100],
  },
  inputText: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.neutral[900],
  },
  placeholder: {
    color: COLORS.neutral[400],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.neutral[900],
  },
  cancelText: {
    fontSize: 16,
    color: COLORS.neutral[500],
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary[500],
  },
  pickerRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 12,
    color: COLORS.neutral[500],
    marginBottom: 8,
  },
  scrollContainer: {
    maxHeight: 200,
  },
  pickerItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  pickerItemSelected: {
    backgroundColor: COLORS.primary[100],
  },
  pickerItemText: {
    fontSize: 16,
    color: COLORS.neutral[600],
    textAlign: 'center',
  },
  pickerItemTextSelected: {
    color: COLORS.primary[700],
    fontWeight: '600',
  },
});
