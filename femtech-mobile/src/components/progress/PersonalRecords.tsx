import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Trophy, TrendingUp } from 'lucide-react-native';
import { PersonalRecord } from '@/types';
import { COLORS } from '@/constants/colors';

interface PersonalRecordsProps {
  records: PersonalRecord[];
  onRecordPress?: (record: PersonalRecord) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export function PersonalRecords({ records, onRecordPress }: PersonalRecordsProps) {
  if (records.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Personal Records</Text>
        <View style={styles.emptyCard}>
          <Trophy size={32} color={COLORS.neutral[300]} />
          <Text style={styles.emptyText}>
            Complete workouts to start tracking PRs
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Personal Records</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {records.slice(0, 5).map((record) => (
          <TouchableOpacity
            key={record.exerciseId}
            onPress={() => onRecordPress?.(record)}
            activeOpacity={0.7}
            style={styles.recordCard}
          >
            <View style={styles.prBadge}>
              <Trophy size={18} color="#ffffff" />
              <Text style={styles.prText}>PR</Text>
            </View>

            <Text style={styles.exerciseName} numberOfLines={1}>
              {record.exerciseName}
            </Text>

            <Text style={styles.weight}>{record.weight} kg</Text>
            <Text style={styles.reps}>× {record.reps} reps</Text>

            {record.previousRecord && (
              <View style={styles.improvementRow}>
                <TrendingUp size={14} color="#ffffff" />
                <Text style={styles.improvementText}>
                  +{record.weight - record.previousRecord.weight} kg
                </Text>
              </View>
            )}

            <Text style={styles.dateText}>{formatDate(record.date)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  wrapper: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.neutral[900],
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary[500],
  },
  emptyCard: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.neutral[500],
    marginTop: 8,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  recordCard: {
    backgroundColor: '#f59e0b',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 160,
  },
  prBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  prText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  exerciseName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  weight: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  reps: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  improvementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  improvementText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginLeft: 4,
  },
  dateText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 8,
  },
});
