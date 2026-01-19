import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Lock } from 'lucide-react-native';
import { Achievement } from '@/types';
import { COLORS } from '@/constants/colors';

interface AchievementBadgesProps {
  achievements: Achievement[];
}

const ACHIEVEMENT_ICONS: Record<string, string> = {
  first_workout: '🏋️',
  week_streak: '🔥',
  month_streak: '💪',
  pr_breaker: '🏆',
  early_bird: '🌅',
  consistency: '📈',
  bone_builder: '🦴',
  strength_gains: '💥',
};

export function AchievementBadges({ achievements }: AchievementBadgesProps) {
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <Text style={styles.countText}>{unlockedCount}/{achievements.length}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {achievements.map((achievement) => {
          const isUnlocked = !!achievement.unlockedAt;

          return (
            <TouchableOpacity
              key={achievement.id}
              activeOpacity={0.7}
              style={[
                styles.achievementCard,
                { backgroundColor: isUnlocked ? '#fef3c7' : COLORS.neutral[100] }
              ]}
            >
              <View style={[
                styles.iconCircle,
                { backgroundColor: isUnlocked ? '#fde68a' : COLORS.neutral[200] }
              ]}>
                {isUnlocked ? (
                  <Text style={styles.iconEmoji}>
                    {ACHIEVEMENT_ICONS[achievement.icon] || '🏅'}
                  </Text>
                ) : (
                  <Lock size={24} color={COLORS.neutral[400]} />
                )}
              </View>

              <Text
                style={[
                  styles.achievementTitle,
                  { color: isUnlocked ? COLORS.neutral[900] : COLORS.neutral[400] }
                ]}
                numberOfLines={2}
              >
                {achievement.title}
              </Text>

              {!isUnlocked && achievement.progress !== undefined && achievement.target !== undefined && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${(achievement.progress / achievement.target) * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {achievement.progress}/{achievement.target}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  countText: {
    fontSize: 14,
    color: COLORS.neutral[500],
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  achievementCard: {
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 128,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconEmoji: {
    fontSize: 32,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.neutral[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary[400],
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.neutral[400],
    textAlign: 'center',
    marginTop: 4,
  },
});
