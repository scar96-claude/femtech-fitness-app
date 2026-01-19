import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, Dumbbell, Flame } from 'lucide-react-native';
import { WorkoutHistoryItem } from '@/types';
import { COLORS } from '@/constants/colors';

interface WorkoutHistoryCardProps {
  workout: WorkoutHistoryItem;
  onPress?: () => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
};

export function WorkoutHistoryCard({ workout, onPress }: WorkoutHistoryCardProps) {
  const phaseColors: Record<string, { bg: string; text: string }> = {
    menstrual: { bg: '#fee2e2', text: '#b91c1c' },
    follicular: { bg: '#dcfce7', text: '#15803d' },
    ovulatory: { bg: '#fef3c7', text: '#b45309' },
    luteal: { bg: '#ede9fe', text: '#7c3aed' },
  };

  const phaseStyle = workout.phase ? phaseColors[workout.phase] : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.container}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{workout.name}</Text>
          <Text style={styles.date}>{formatDate(workout.date)}</Text>
        </View>

        {phaseStyle && (
          <View style={[styles.phaseBadge, { backgroundColor: phaseStyle.bg }]}>
            <Text style={[styles.phaseText, { color: phaseStyle.text }]}>
              {workout.phase}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Clock size={16} color={COLORS.neutral[500]} />
          <Text style={styles.statText}>{workout.duration} min</Text>
        </View>

        <View style={styles.stat}>
          <Dumbbell size={16} color={COLORS.neutral[500]} />
          <Text style={styles.statText}>{workout.totalSets} sets</Text>
        </View>

        <View style={styles.stat}>
          <Flame size={16} color={COLORS.neutral[500]} />
          <Text style={styles.statText}>RPE {workout.avgRpe.toFixed(1)}</Text>
        </View>
      </View>

      {workout.totalWeight > 0 && (
        <View style={styles.volumeRow}>
          <Text style={styles.volumeLabel}>
            Total volume: <Text style={styles.volumeValue}>{Math.round(workout.totalWeight).toLocaleString()} kg</Text>
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.neutral[900],
  },
  date: {
    fontSize: 14,
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  phaseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  phaseText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  statsRow: {
    flexDirection: 'row',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: COLORS.neutral[600],
    marginLeft: 4,
  },
  volumeRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
  },
  volumeLabel: {
    fontSize: 14,
    color: COLORS.neutral[500],
  },
  volumeValue: {
    fontWeight: '600',
    color: COLORS.neutral[700],
  },
});
