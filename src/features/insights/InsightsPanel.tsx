import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { accent, colors, fontFamily, neutral, radius, spacing, typography } from '../../theme';

export function InsightsPanel() {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Day Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryEyebrow}>Your {dayName}</Text>
        <Text style={styles.summaryDate}>{dateStr}</Text>

        <View style={styles.statRow}>
          <StatPill label="3 classes" color={accent.blue.muted} textColor={accent.blue.DEFAULT} />
          <StatPill label="4,200 steps" color={accent.green.muted} textColor={accent.green.DEFAULT} />
          <StatPill label="5 places" color={accent.violet.muted} textColor={accent.violet.DEFAULT} />
        </View>

        <Text style={styles.summaryText}>
          Busier than your average {dayName.toLowerCase()}. You covered more ground today.
        </Text>
      </View>

      {/* Cognitive Load */}
      <View style={styles.loadCard}>
        <View style={styles.loadHeader}>
          <Text style={styles.loadTitle}>Cognitive Load</Text>
          <View style={styles.loadBadge}>
            <Text style={styles.loadBadgeText}>Moderate</Text>
          </View>
        </View>

        <View style={styles.loadBarTrack}>
          <View style={[styles.loadBarFill, { width: '62%' }]} />
        </View>

        <Text style={styles.loadDescription}>
          Based on schedule density, transitions between locations, and activity patterns.
        </Text>
      </View>

      {/* Behavior Analytics */}
      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>Peak Hours</Text>
        <Text style={styles.analyticsBody}>
          You're most active between 2-4 PM on campus. This aligns with your post-lunch routine.
        </Text>
      </View>

      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>Favorite Zone</Text>
        <Text style={styles.analyticsBody}>
          Library area — 12 visits this week. You spend an average of 2.5 hours per session.
        </Text>
      </View>

      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>Social Window</Text>
        <Text style={styles.analyticsBody}>
          Best meetup time: 5:30 - 6:30 PM. Highest overlap with your circles during this window.
        </Text>
      </View>
    </ScrollView>
  );
}

function StatPill({
  label,
  color,
  textColor,
}: {
  label: string;
  color: string;
  textColor: string;
}) {
  return (
    <View style={[styles.statPill, { backgroundColor: color }]}>
      <Text style={[styles.statPillText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.sm,
    gap: spacing.md,
    paddingBottom: spacing['3xl'],
  },
  summaryCard: {
    backgroundColor: colors.foreground,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
  },
  summaryEyebrow: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: neutral[400],
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },
  summaryDate: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    color: colors.inverseForeground,
    letterSpacing: -1,
    marginBottom: spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statPill: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statPillText: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
  },
  summaryText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: neutral[400],
    lineHeight: 20,
  },
  loadCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  loadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  loadTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.foreground,
  },
  loadBadge: {
    backgroundColor: accent.yellow.muted,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  loadBadgeText: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    color: accent.yellow.DEFAULT,
  },
  loadBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: neutral[200],
    marginBottom: spacing.md,
  },
  loadBarFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: accent.yellow.DEFAULT,
  },
  loadDescription: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.mutedForeground,
    lineHeight: 18,
  },
  analyticsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  analyticsTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    color: colors.foreground,
  },
  analyticsBody: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.mutedForeground,
    lineHeight: 20,
  },
});
