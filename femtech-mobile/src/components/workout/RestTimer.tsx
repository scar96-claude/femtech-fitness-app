import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useWorkoutStore } from '@/stores/workoutStore';
import { SkipForward, Volume2, VolumeX } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/constants/colors';

export function RestTimer() {
  const {
    restTimeRemaining,
    decrementRestTime,
    skipRest,
    finishRest,
    isPaused,
  } = useWorkoutStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const initialRestTime = useRef(restTimeRemaining);

  useEffect(() => {
    initialRestTime.current = restTimeRemaining;
  }, []);

  useEffect(() => {
    if (!isPaused && restTimeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        decrementRestTime();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, restTimeRemaining, decrementRestTime]);

  useEffect(() => {
    if (restTimeRemaining === 0) {
      finishRest();
      if (soundEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }

    // Warning haptic at 5 seconds
    if (restTimeRemaining === 5 && soundEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [restTimeRemaining, soundEnabled, finishRest]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    skipRest();
  };

  const getMessage = () => {
    if (restTimeRemaining > 30) return 'Catch your breath 😮‍💨';
    if (restTimeRemaining > 10) return 'Get ready for the next set 💪';
    return 'Almost time! 🔥';
  };

  // Calculate progress
  const progress = initialRestTime.current > 0
    ? restTimeRemaining / initialRestTime.current
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Timer Circle */}
        <View style={styles.timerContainer}>
          {/* Background Circle */}
          <View style={styles.backgroundCircle} />

          {/* Progress Circle - using opacity for simple progress indication */}
          <View
            style={[styles.progressCircle, { opacity: progress }]}
          />

          {/* Time Display */}
          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>{formatTime(restTimeRemaining)}</Text>
            <Text style={styles.timeLabel}>Rest Time</Text>
          </View>
        </View>

        {/* Message */}
        <Text style={styles.message}>{getMessage()}</Text>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => setSoundEnabled(!soundEnabled)}
            style={styles.soundButton}
          >
            {soundEnabled ? (
              <Volume2 size={20} color="#ffffff" />
            ) : (
              <VolumeX size={20} color={COLORS.neutral[500]} />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <SkipForward size={20} color="#ffffff" />
            <Text style={styles.skipText}>Skip Rest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(23, 23, 23, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  timerContainer: {
    position: 'relative',
    width: 192,
    height: 192,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundCircle: {
    position: 'absolute',
    width: 192,
    height: 192,
    borderRadius: 96,
    borderWidth: 8,
    borderColor: COLORS.neutral[700],
  },
  progressCircle: {
    position: 'absolute',
    width: 192,
    height: 192,
    borderRadius: 96,
    borderWidth: 8,
    borderColor: COLORS.primary[500],
  },
  timeDisplay: {
    alignItems: 'center',
  },
  timeText: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  timeLabel: {
    color: COLORS.neutral[400],
    marginTop: 8,
  },
  message: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 32,
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soundButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.neutral[800],
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[500],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  skipText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
});
