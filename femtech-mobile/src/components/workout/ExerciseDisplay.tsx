import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Dumbbell } from 'lucide-react-native';
import { ActiveWorkoutExercise } from '@/types';
import { COLORS } from '@/constants/colors';

interface ExerciseDisplayProps {
  exercise: ActiveWorkoutExercise;
}

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = width * 0.6;

export function ExerciseDisplay({ exercise }: ExerciseDisplayProps) {
  const hasImage = exercise.thumbnailUrl && exercise.thumbnailUrl.length > 0;

  return (
    <View style={styles.container}>
      {/* Video/Image Container */}
      <View style={styles.mediaContainer}>
        {hasImage ? (
          <Image
            source={{ uri: exercise.thumbnailUrl }}
            style={styles.media}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholder}>
            <Dumbbell size={64} color={COLORS.neutral[600]} />
            <Text style={styles.placeholderText}>No demo available</Text>
          </View>
        )}
      </View>

      {/* Exercise Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>

        <View style={styles.tagsRow}>
          <View style={styles.primaryTag}>
            <Text style={styles.primaryTagText}>{exercise.sets} sets</Text>
          </View>

          <View style={styles.primaryTag}>
            <Text style={styles.primaryTagText}>{exercise.reps} reps</Text>
          </View>

          <View style={styles.secondaryTag}>
            <Text style={styles.secondaryTagText}>RPE {exercise.targetRpe}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  mediaContainer: {
    backgroundColor: COLORS.neutral[900],
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: 16,
    height: VIDEO_HEIGHT,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: COLORS.neutral[500],
    marginTop: 16,
  },
  infoContainer: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryTag: {
    backgroundColor: COLORS.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  primaryTagText: {
    color: COLORS.primary[700],
    fontWeight: '500',
  },
  secondaryTag: {
    backgroundColor: COLORS.neutral[100],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  secondaryTagText: {
    color: COLORS.neutral[600],
    fontWeight: '500',
  },
});
