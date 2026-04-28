import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { accent, colors, fontFamily, neutral, radius, spacing, typography } from '../theme';

const groupData = [
  {
    title: 'Product circle',
    members: 12,
    status: 'Fast replies',
    lastMsg: 'Anyone up for the design sprint tomorrow?',
    time: '2m ago',
    accent: accent.blue,
    icon: 'bulb-outline' as const,
    unread: 3,
  },
  {
    title: 'Film club',
    members: 28,
    status: 'Screening tomorrow',
    lastMsg: 'Doors open at 7 PM at SAC Auditorium.',
    time: '15m ago',
    accent: accent.rose,
    icon: 'film-outline' as const,
    unread: 0,
  },
  {
    title: 'Hack squad',
    members: 8,
    status: 'Build sprint live',
    lastMsg: 'PR open for the auth module, need review!',
    time: '1h ago',
    accent: accent.green,
    icon: 'code-slash-outline' as const,
    unread: 7,
  },
];

export function GroupsScreen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeader}>
        <Text style={styles.title}>Groups</Text>
        <Pressable style={({ hovered }: any) => [styles.newBtn, hovered && styles.newBtnHovered]}>
          <Ionicons name="add" size={16} color={colors.inverseForeground} />
          <Text style={styles.newBtnText}>New</Text>
        </Pressable>
      </View>
      <Text style={styles.subtitle}>Your campus circles</Text>

      <View style={styles.list}>
        {groupData.map((group) => (
          <Pressable
            key={group.title}
            style={({ hovered }: any) => [styles.card, hovered && styles.cardHovered]}
          >
            <View style={[styles.avatar, { backgroundColor: group.accent.muted }]}>
              <Ionicons name={group.icon} size={18} color={group.accent.DEFAULT} />
            </View>

            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{group.title}</Text>
                <Text style={styles.cardTime}>{group.time}</Text>
              </View>
              <View style={styles.cardMid}>
                <View style={[styles.statusBadge, { backgroundColor: group.accent.muted }]}>
                  <Text style={[styles.statusText, { color: group.accent.DEFAULT }]}>
                    {group.status}
                  </Text>
                </View>
                {group.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{group.unread}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.lastMsg} numberOfLines={1}>{group.lastMsg}</Text>
              <Text style={styles.members}>{group.members} members</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.discoverSection}>
        <Text style={styles.discoverTitle}>Discover groups</Text>
        <Text style={styles.discoverSubtitle}>Find circles matching your interests</Text>
        <Pressable style={({ hovered }: any) => [styles.discoverBtn, hovered && styles.discoverBtnHovered]}>
          <Ionicons name="search-outline" size={15} color={colors.foreground} />
          <Text style={styles.discoverBtnText}>Browse all groups</Text>
        </Pressable>
      </View>
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
    paddingBottom: spacing['3xl'],
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.h2,
    color: colors.foreground,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.foreground,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  newBtnHovered: {
    backgroundColor: neutral[800],
  },
  newBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.inverseForeground,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.mutedForeground,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  list: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: neutral[200],
  },
  cardHovered: {
    backgroundColor: neutral[150],
    borderColor: neutral[300],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    color: colors.foreground,
  },
  cardTime: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: neutral[400],
  },
  cardMid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontFamily: fontFamily.semibold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  unreadBadge: {
    backgroundColor: colors.foreground,
    borderRadius: radius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    color: colors.inverseForeground,
  },
  lastMsg: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.mutedForeground,
    lineHeight: 17,
  },
  members: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: neutral[400],
  },
  discoverSection: {
    backgroundColor: neutral[100],
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: neutral[200],
    marginTop: spacing.sm,
    alignItems: 'flex-start',
  },
  discoverTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    color: colors.foreground,
  },
  discoverSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.mutedForeground,
  },
  discoverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: neutral[300],
    marginTop: spacing.xs,
  },
  discoverBtnHovered: {
    backgroundColor: neutral[150],
  },
  discoverBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.foreground,
  },
});
