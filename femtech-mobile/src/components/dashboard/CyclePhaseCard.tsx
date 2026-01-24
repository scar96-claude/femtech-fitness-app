import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { CyclePhaseInfo } from '@/types';
import { COLORS } from '@/constants/colors';

interface CyclePhaseCardProps {
  phase: CyclePhaseInfo;
  cycleDay: number;
  totalDays: number;
  daysUntilNextPhase: number;
}

export function CyclePhaseCard({
  phase,
  cycleDay,
  totalDays,
  daysUntilNextPhase,
}: CyclePhaseCardProps) {
  const progress = cycleDay / totalDays;
  const size = 140;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Cycle Ring */}
        <View style={styles.ringContainer}>
          <Svg width={size} height={size}>
            {/* Background circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e5e5e5"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={phase.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation={-90}
              origin={`${size / 2}, ${size / 2}`}
            />
          </Svg>

          {/* Center content */}
          <View style={styles.centerContent}>
            <Text style={styles.cycleDay}>{cycleDay}</Text>
            <Text style={styles.cycleDayLabel}>of {totalDays}</Text>
          </View>
        </View>

        {/* Phase Info */}
        <View style={styles.phaseInfo}>
          <View style={styles.phaseHeader}>
            <View
              style={[styles.phaseDot, { backgroundColor: phase.color }]}
            />
            <Text style={styles.phaseName}>{phase.displayName}</Text>
          </View>

          <Text style={styles.phaseDescription}>{phase.description}</Text>

          <View style={styles.tipCard}>
            <Text style={styles.tipText}>💡 {phase.workoutTip}</Text>
          </View>

          <Text style={styles.nextPhaseText}>
            {daysUntilNextPhase} days until next phase
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ringContainer: {
    position: 'relative',
    width: 140,
    height: 140,
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleDay: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
  },
  cycleDayLabel: {
    color: COLORS.neutral[500],
    fontSize: 14,
  },
  phaseInfo: {
    flex: 1,
    marginLeft: 24,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  phaseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  phaseName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.neutral[900],
  },
  phaseDescription: {
    color: COLORS.neutral[600],
    marginBottom: 12,
  },
  tipCard: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    padding: 12,
  },
  tipText: {
    color: COLORS.neutral[700],
    fontSize: 14,
    lineHeight: 20,
  },
  nextPhaseText: {
    color: COLORS.neutral[400],
    fontSize: 12,
    marginTop: 8,
  },
});
