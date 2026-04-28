import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { accent, colors, fontFamily, neutral, radius, spacing, typography } from '../theme';

const mockLeaders = [
  { rank: 1, name: 'Priya Sharma', points: 2840, dept: 'CSE', badge: 'trophy', color: '#f59e0b' },
  { rank: 2, name: 'Rahul Gupta', points: 2310, dept: 'EE', badge: 'medal', color: neutral[500] },
  { rank: 3, name: 'Ananya Iyer', points: 1990, dept: 'ME', badge: 'ribbon', color: '#cd7c47' },
  { rank: 4, name: 'Karan Mehta', points: 1750, dept: 'Civil', badge: null, color: neutral[400] },
  { rank: 5, name: 'Sneha Patel', points: 1620, dept: 'Chem', badge: null, color: neutral[400] },
];

export function LeaderboardScreen() {
  const top3 = mockLeaders.slice(0, 3);
  const rest = mockLeaders.slice(3);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Leaderboard</Text>
      <Text style={styles.subtitle}>TechKriti 2026 · Campus Rankings</Text>

      {/* Podium */}
      <View style={styles.podium}>
        {/* 2nd */}
        <View style={[styles.podiumCol, { marginTop: 28 }]}>
          <View style={[styles.podiumAvatar, { borderColor: neutral[400] }]}>
            <Text style={styles.podiumEmoji}>🥈</Text>
          </View>
          <Text style={styles.podiumName} numberOfLines={1}>{top3[1].name.split(' ')[0]}</Text>
          <Text style={styles.podiumPts}>{top3[1].points}</Text>
          <View style={[styles.podiumBase, { backgroundColor: neutral[300], height: 56 }]}>
            <Text style={styles.podiumRankLabel}>2</Text>
          </View>
        </View>

        {/* 1st */}
        <View style={styles.podiumCol}>
          <View style={styles.crownWrap}>
            <Ionicons name="trophy" size={20} color="#f59e0b" />
          </View>
          <View style={[styles.podiumAvatar, { borderColor: '#f59e0b', width: 60, height: 60, borderRadius: 30 }]}>
            <Text style={[styles.podiumEmoji, { fontSize: 24 }]}>🥇</Text>
          </View>
          <Text style={[styles.podiumName, { fontSize: 14 }]} numberOfLines={1}>{top3[0].name.split(' ')[0]}</Text>
          <Text style={[styles.podiumPts, { fontFamily: fontFamily.bold, fontSize: 16 }]}>{top3[0].points}</Text>
          <View style={[styles.podiumBase, { backgroundColor: '#f59e0b', height: 80 }]}>
            <Text style={[styles.podiumRankLabel, { color: '#fff' }]}>1</Text>
          </View>
        </View>

        {/* 3rd */}
        <View style={[styles.podiumCol, { marginTop: 44 }]}>
          <View style={[styles.podiumAvatar, { borderColor: '#cd7c47' }]}>
            <Text style={styles.podiumEmoji}>🥉</Text>
          </View>
          <Text style={styles.podiumName} numberOfLines={1}>{top3[2].name.split(' ')[0]}</Text>
          <Text style={styles.podiumPts}>{top3[2].points}</Text>
          <View style={[styles.podiumBase, { backgroundColor: '#cd7c47', height: 40 }]}>
            <Text style={[styles.podiumRankLabel, { color: '#fff' }]}>3</Text>
          </View>
        </View>
      </View>

      {/* Rest of list */}
      <View style={styles.listSection}>
        {rest.map((user) => (
          <View key={user.rank} style={styles.listRow}>
            <Text style={styles.listRank}>#{user.rank}</Text>
            <View style={styles.listAvatar}>
              <Text style={styles.listAvatarText}>{user.name.charAt(0)}</Text>
            </View>
            <View style={styles.listInfo}>
              <Text style={styles.listName}>{user.name}</Text>
              <Text style={styles.listDept}>{user.dept}</Text>
            </View>
            <Text style={styles.listPts}>{user.points} pts</Text>
          </View>
        ))}
      </View>

      {/* Coming soon banner */}
      <View style={styles.comingSoon}>
        <View style={styles.comingSoonIcon}>
          <Ionicons name="sparkles-outline" size={20} color={accent.violet.DEFAULT} />
        </View>
        <View style={styles.comingSoonText}>
          <Text style={styles.comingSoonTitle}>Full rankings coming soon</Text>
          <Text style={styles.comingSoonBody}>Complete challenges to earn points and climb the board.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.xl, paddingBottom: spacing['3xl'] },
  title: { ...typography.h2, color: colors.foreground },
  subtitle: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.mutedForeground, marginTop: -spacing.md },

  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  podiumCol: {
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  crownWrap: { marginBottom: 4 },
  podiumAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  podiumEmoji: { fontSize: 20 },
  podiumName: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: colors.foreground,
    textAlign: 'center',
  },
  podiumPts: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.mutedForeground,
  },
  podiumBase: {
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: spacing.xs,
  },
  podiumRankLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.inverseForeground,
  },

  listSection: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: neutral[200],
    overflow: 'hidden',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: neutral[200],
  },
  listRank: {
    fontFamily: fontFamily.bold,
    fontSize: 13,
    color: neutral[400],
    width: 24,
  },
  listAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  listAvatarText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.foreground,
  },
  listInfo: { flex: 1 },
  listName: { fontFamily: fontFamily.semibold, fontSize: 14, color: colors.foreground },
  listDept: { fontFamily: fontFamily.regular, fontSize: 11, color: neutral[400] },
  listPts: { fontFamily: fontFamily.semibold, fontSize: 13, color: colors.mutedForeground },

  comingSoon: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: accent.violet.muted,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'flex-start',
  },
  comingSoonIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  comingSoonText: { flex: 1, gap: 3 },
  comingSoonTitle: { fontFamily: fontFamily.semibold, fontSize: 14, color: accent.violet.DEFAULT },
  comingSoonBody: { fontFamily: fontFamily.regular, fontSize: 12, color: accent.violet.DEFAULT, lineHeight: 18, opacity: 0.8 },
});
