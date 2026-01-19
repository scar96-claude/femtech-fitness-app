import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Droplet, Calendar } from 'lucide-react-native';
import { CycleHistoryItem } from '@/types';
import { COLORS } from '@/constants/colors';

interface CycleHistoryProps {
  cycles: CycleHistoryItem[];
}

const formatMonthYear = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
};

export function CycleHistory({ cycles }: CycleHistoryProps) {
  if (cycles.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Cycle History</Text>
        <View style={styles.emptyCard}>
          <Droplet size={32} color={COLORS.neutral[300]} />
          <Text style={styles.emptyText}>
            Log your period to start tracking your cycle
          </Text>
        </View>
      </View>
    );
  }

  const avgCycleLength = Math.round(
    cycles.reduce((acc, c) => acc + c.cycleLength, 0) / cycles.length
  );

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.sectionTitle, { paddingHorizontal: 24 }]}>Cycle History</Text>

      <View style={styles.avgStatsRow}>
        <View style={styles.avgStatCard}>
          <Text style={styles.avgStatValue}>{avgCycleLength}</Text>
          <Text style={styles.avgStatLabel}>Avg Cycle Length</Text>
        </View>
        <View style={styles.avgStatCardPurple}>
          <Text style={styles.avgStatValuePurple}>{cycles.length}</Text>
          <Text style={styles.avgStatLabelPurple}>Cycles Tracked</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cycles.slice(0, 6).map((cycle) => (
          <View key={cycle.id} style={styles.cycleCard}>
            <View style={styles.cycleHeader}>
              <Calendar size={16} color="#ef4444" />
              <Text style={styles.cycleMonthText}>
                {formatMonthYear(cycle.periodStartDate)}
              </Text>
            </View>

            <Text style={styles.cycleDateRange}>
              {formatDateShort(cycle.periodStartDate)}
              {cycle.periodEndDate && (
                <Text style={styles.cycleDateRangeSuffix}>
                  {' '}- {formatDateShort(cycle.periodEndDate)}
                </Text>
              )}
            </Text>

            <Text style={styles.cycleLengthText}>
              {cycle.cycleLength} day cycle
            </Text>

            {cycle.symptoms && (
              <View style={styles.symptomsRow}>
                <Text style={styles.symptomsText}>
                  Energy: {cycle.symptoms.energy}/5
                </Text>
              </View>
            )}
          </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.neutral[900],
    marginBottom: 12,
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
  avgStatsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  avgStatCard: {
    flex: 1,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
  },
  avgStatValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc2626',
  },
  avgStatLabel: {
    fontSize: 12,
    color: '#ef4444',
  },
  avgStatCardPurple: {
    flex: 1,
    backgroundColor: '#ede9fe',
    borderRadius: 12,
    padding: 12,
    marginLeft: 8,
  },
  avgStatValuePurple: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7c3aed',
  },
  avgStatLabelPurple: {
    fontSize: 12,
    color: '#8b5cf6',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  cycleCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 160,
  },
  cycleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cycleMonthText: {
    fontSize: 12,
    color: COLORS.neutral[500],
    marginLeft: 4,
  },
  cycleDateRange: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.neutral[900],
  },
  cycleDateRangeSuffix: {
    fontWeight: 'normal',
    color: COLORS.neutral[500],
  },
  cycleLengthText: {
    fontSize: 14,
    color: COLORS.neutral[500],
    marginTop: 4,
  },
  symptomsRow: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
  },
  symptomsText: {
    fontSize: 12,
    color: COLORS.neutral[400],
  },
});
