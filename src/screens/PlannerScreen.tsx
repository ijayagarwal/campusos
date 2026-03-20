import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { accent, colors, fontFamily, neutral, radius, spacing, typography } from '../theme';
import type { TechKritiEvent, FestDay } from '../data/techkritiEvents';
import { FEST_DAYS } from '../data/techkritiEvents';

type PlannerScreenProps = {
  events: TechKritiEvent[];
  plannedIds: Set<string>;
  onRemove: (eventId: string) => void;
};

export function PlannerScreen({ events, plannedIds, onRemove }: PlannerScreenProps) {
  const plannedEvents = events.filter((e) => plannedIds.has(e.id));

  if (plannedEvents.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Ionicons name="calendar-outline" size={32} color={colors.muted} />
        </View>
        <Text style={styles.emptyTitle}>No events planned yet</Text>
        <Text style={styles.emptySubtitle}>
          Browse Events on the Explore tab and tap "Add to Planner" to build your schedule.
        </Text>
      </View>
    );
  }

  // Group by day
  const grouped = new Map<FestDay, TechKritiEvent[]>();
  for (const day of FEST_DAYS) {
    const dayEvents = plannedEvents.filter((e) => e.day === day);
    if (dayEvents.length > 0) {
      // Sort by start time
      dayEvents.sort((a, b) => a.startTime.localeCompare(b.startTime));
      grouped.set(day, dayEvents);
    }
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Your Schedule</Text>
      <Text style={styles.subtitle}>
        {plannedEvents.length} event{plannedEvents.length !== 1 ? 's' : ''} planned
      </Text>

      {Array.from(grouped).map(([day, dayEvents]) => (
        <View key={day} style={styles.daySection}>
          <Text style={styles.dayLabel}>{day}</Text>
          {dayEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={[styles.eventAccent, { backgroundColor: event.accentColor }]} />
              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  <View style={[styles.catBadge, { backgroundColor: event.accentColor + '15' }]}>
                    <Text style={[styles.catText, { color: event.accentColor }]}>
                      {event.category}
                    </Text>
                  </View>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => onRemove(event.id)}
                  >
                    <Ionicons name="close-circle" size={18} color={neutral[300]} />
                  </Pressable>
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventMeta}>
                  <Ionicons name="time-outline" size={13} color={neutral[400]} />
                  <Text style={styles.metaText}>{event.startTime} – {event.endTime}</Text>
                  <Ionicons name="location-outline" size={13} color={neutral[400]} />
                  <Text style={styles.metaText}>{event.venue}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: colors.background,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: neutral[150],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.foreground,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.mutedForeground,
  },
  daySection: {
    gap: spacing.md,
  },
  dayLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  eventAccent: {
    width: 4,
  },
  eventContent: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  catText: {
    fontFamily: fontFamily.semibold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  removeButton: {
    padding: 4,
  },
  eventTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    color: colors.foreground,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
  },
  metaText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: neutral[500],
    marginRight: spacing.sm,
  },
});
