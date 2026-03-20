import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { accent, colors, fontFamily, neutral, radius, spacing, typography } from '../theme';

const groupData = [
  { title: 'Product circle', members: 12, status: 'Fast replies', accent: accent.blue },
  { title: 'Film club', members: 28, status: 'Screening tomorrow', accent: accent.rose },
  { title: 'Hack squad', members: 8, status: 'Build sprint live', accent: accent.green },
];

export function GroupsScreen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Your Groups</Text>
      <Text style={styles.subtitle}>
        Stay connected with your campus circles.
      </Text>

      {groupData.map((group) => (
        <Pressable key={group.title} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{group.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: group.accent.muted }]}>
              <Text style={[styles.statusText, { color: group.accent.DEFAULT }]}>
                {group.status}
              </Text>
            </View>
          </View>
          <Text style={styles.members}>{group.members} active members</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.foreground,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.mutedForeground,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.foreground,
  },
  statusBadge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  statusText: {
    fontFamily: fontFamily.semibold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  members: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.mutedForeground,
  },
});
