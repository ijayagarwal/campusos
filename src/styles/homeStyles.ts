import { StyleSheet } from 'react-native';

import { colors, fontFamily, neutral, radius, spacing, typography } from '../theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: 18,
    paddingBottom: 22,
  },
  headerRow: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.mutedForeground,
    marginBottom: 6,
  },
  title: {
    ...typography.h1,
    color: colors.foreground,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 26,
    backgroundColor: colors.card,
    padding: 5,
    marginBottom: spacing.lg,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: radius.md,
  },
  segmentButtonActive: {
    backgroundColor: colors.foreground,
  },
  segmentText: {
    ...typography.label,
    color: colors.mutedForeground,
  },
  segmentTextActive: {
    color: colors.inverseForeground,
  },
  contentArea: {
    flex: 1,
    minHeight: 0,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statsCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: 18,
    paddingHorizontal: spacing.lg,
  },
  statsCardMuted: {
    backgroundColor: neutral[200],
  },
  statValue: {
    ...typography.h2,
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.mutedForeground,
  },
  mapShell: {
    flex: 1,
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
  mapOverlayTop: {
    position: 'absolute',
    top: 18,
    left: 18,
    borderRadius: radius.full,
    backgroundColor: colors.foreground,
    paddingHorizontal: spacing.sm + 6,
    paddingVertical: 9,
  },
  mapOverlayText: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    color: colors.inverseForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  friendStack: {
    position: 'absolute',
    top: 18,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendOverlap: {
    marginLeft: -10,
  },
  friendInitial: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    color: colors.foreground,
  },
  mapLabel: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: 18,
  },
  labelPositionOne: {
    bottom: 124,
    left: spacing.lg,
  },
  labelPositionTwo: {
    top: 104,
    right: 18,
  },
  labelPositionThree: {
    top: 188,
    left: 26,
  },
  mapLabelIcon: {
    width: 28,
    height: 28,
    borderRadius: spacing.sm + 6,
    backgroundColor: colors.inverseForeground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapLabelTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.foreground,
    marginBottom: 2,
  },
  mapLabelSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: neutral[800],
  },
  focusCard: {
    position: 'absolute',
    bottom: 30,
    left: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.foreground,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 6,
  },
  focusBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: neutral[300],
    marginRight: spacing.md,
  },
  focusTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.inverseForeground,
    marginBottom: 2,
  },
  focusSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: neutral[300],
  },
  locateButton: {
    position: 'absolute',
    right: 18,
    bottom: 22,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageScroll: {
    flex: 1,
  },
  pageScrollContent: {
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  pageTitle: {
    ...typography.h2,
    color: colors.foreground,
  },
  pageSubtitle: {
    ...typography.bodySmall,
    color: colors.mutedForeground,
    marginBottom: spacing.xs,
  },
  pageMiniTitle: {
    ...typography.label,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  listCard: {
    borderRadius: radius.xl,
    padding: 18,
  },
  listCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  listCardTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.foreground,
  },
  listCardMeta: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: neutral[600],
  },
  listCardBody: {
    ...typography.bodySmall,
    color: neutral[600],
  },
  metaAccent: {
    color: neutral[600],
    marginTop: 10,
  },
  gridCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metricCard: {
    width: '47%',
    borderRadius: 26,
    padding: 18,
    minHeight: 128,
    justifyContent: 'space-between',
  },
  metricValue: {
    ...typography.metric,
    color: colors.foreground,
  },
  metricLabel: {
    ...typography.bodySmall,
    color: neutral[600],
    lineHeight: 18,
  },
  featureCard: {
    borderRadius: radius.xl,
    padding: 18,
  },
  featureCopy: {
    ...typography.bodySmall,
    color: neutral[600],
  },
  insightHero: {
    backgroundColor: colors.foreground,
    borderRadius: radius['2xl'],
    padding: 22,
    marginBottom: 2,
  },
  insightHeroValue: {
    fontFamily: fontFamily.bold,
    fontSize: 34,
    color: colors.inverseForeground,
    marginBottom: spacing.sm,
  },
  insightHeroTitle: {
    ...typography.body,
    color: neutral[300],
  },
  preferenceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  preferenceChip: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 6,
    paddingVertical: 10,
  },
  preferenceText: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: colors.foreground,
  },
  toneClay: {
    backgroundColor: '#d09a74',
  },
  toneSand: {
    backgroundColor: '#dcc6a7',
  },
  toneOlive: {
    backgroundColor: '#a9b18a',
  },
  toneInk: {
    backgroundColor: colors.foreground,
  },
  toneLight: {
    backgroundColor: colors.card,
  },
  inverseText: {
    color: colors.inverseForeground,
  },
  inverseSubtext: {
    color: neutral[300],
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 30,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    marginTop: spacing.lg,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 22,
  },
  navItemActive: {
    backgroundColor: neutral[200],
  },
  navLabel: {
    ...typography.navLabel,
    color: colors.muted,
    marginTop: 6,
  },
  navLabelActive: {
    color: colors.foreground,
    fontFamily: fontFamily.semibold,
  },
});
