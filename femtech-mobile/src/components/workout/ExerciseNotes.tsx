import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Info, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface ExerciseNotesProps {
  notes?: string;
  safetyNote?: string;
  movementPattern: string;
}

export function ExerciseNotes({
  notes,
  safetyNote,
  movementPattern,
}: ExerciseNotesProps) {
  const [expanded, setExpanded] = useState(false);

  if (!notes && !safetyNote) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <Info size={20} color={COLORS.primary[500]} />
          <Text style={styles.headerText}>Exercise Tips</Text>
        </View>
        {expanded ? (
          <ChevronUp size={20} color={COLORS.neutral[500]} />
        ) : (
          <ChevronDown size={20} color={COLORS.neutral[500]} />
        )}
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {/* Movement Pattern */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Movement Pattern</Text>
            <Text style={styles.sectionText}>{movementPattern}</Text>
          </View>

          {/* Notes */}
          {notes && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Tips</Text>
              <Text style={styles.sectionText}>{notes}</Text>
            </View>
          )}

          {/* Safety Note */}
          {safetyNote && (
            <View style={styles.safetyCard}>
              <AlertTriangle size={18} color="#d97706" />
              <Text style={styles.safetyText}>{safetyNote}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: COLORS.neutral[700],
    fontWeight: '500',
    marginLeft: 8,
  },
  content: {
    backgroundColor: COLORS.neutral[50],
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop: -8,
  },
  section: {
    marginBottom: 12,
  },
  sectionLabel: {
    color: COLORS.neutral[400],
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionText: {
    color: COLORS.neutral[700],
  },
  safetyCard: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 12,
  },
  safetyText: {
    color: '#d97706',
    marginLeft: 8,
    flex: 1,
  },
});
