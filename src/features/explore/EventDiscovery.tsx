import { Ionicons } from '@expo/vector-icons';
import { FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { accent, colors, fontFamily, neutral, radius, spacing } from '../../theme';
import type { FestDay, TechKritiEvent } from '../../data/techkritiEvents';
import { FEST_DAYS } from '../../data/techkritiEvents';
import { getEventTimeLabel, estimateAttendees } from '../../data/eventHelpers';

// Re-export for backwards compat
export type CampusEvent = TechKritiEvent;

type EventDiscoveryProps = {
  events: TechKritiEvent[];
  selectedDay: FestDay | 'Live';
  onDayChange: (day: FestDay | 'Live') => void;
  onEventPress?: (event: TechKritiEvent) => void;
  onAddToPlanner?: (eventId: string) => void;
  plannedIds?: Set<string>;
};

const DAY_FILTERS: Array<FestDay | 'Live'> = ['Live', ...FEST_DAYS];

export function EventDiscovery({
  events,
  selectedDay,
  onDayChange,
  onEventPress,
  onAddToPlanner,
  plannedIds,
}: EventDiscoveryProps) {
  return (
    <View style={styles.container}>
      {/* Day filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayFilters}
      >
        {DAY_FILTERS.map((day) => {
          const isActive = day === selectedDay;
          return (
            <Pressable
              key={day}
              style={[styles.dayPill, isActive && styles.dayPillActive]}
              onPress={() => onDayChange(day)}
            >
              {day === 'Live' && <View style={styles.liveDotSmall} />}
              <Text style={[styles.dayPillText, isActive && styles.dayPillTextActive]}>
                {day === 'Live' ? 'Live Now' : day}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {selectedDay === 'Live' && <View style={styles.liveDot} />}
          <Text style={styles.headerTitle}>
            {selectedDay === 'Live' ? 'Happening Now' : selectedDay}
          </Text>
        </View>
        <Text style={styles.headerCount}>{events.length} events</Text>
      </View>

      {/* Event cards */}
      {events.length > 0 ? (
        <FlatList
          data={events}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={onEventPress}
              onAddToPlanner={onAddToPlanner}
              isPlanned={plannedIds?.has(item.id) ?? false}
            />
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {selectedDay === 'Live' ? 'No events live right now' : 'No events on this day'}
          </Text>
        </View>
      )}
    </View>
  );
}

function EventCard({
  event,
  onPress,
  onAddToPlanner,
  isPlanned,
}: {
  event: TechKritiEvent;
  onPress?: (event: TechKritiEvent) => void;
  onAddToPlanner?: (eventId: string) => void;
  isPlanned: boolean;
}) {
  const timeLabel = getEventTimeLabel(event);
  const attendees = estimateAttendees(event);

  return (
    <Pressable
      style={[
        styles.card,
        {
          borderColor: event.accentColor + '28',
          shadowColor: event.accentColor,
        },
      ]}
      onPress={() => onPress?.(event)}
    >
      <View style={[styles.accentStrip, { backgroundColor: event.accentColor }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <View style={[styles.categoryBadge, { backgroundColor: event.accentColor + '15' }]}>
            <Text style={[styles.category, { color: event.accentColor }]}>{event.category}</Text>
          </View>
          <Text style={styles.time}>{timeLabel}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        <View style={styles.cardBottom}>
          <View style={styles.venueRow}>
            <Ionicons name="location-outline" size={12} color={neutral[400]} />
            <Text style={styles.venue} numberOfLines={1}>{event.venue}</Text>
          </View>
          <View style={styles.attendeeRow}>
            <Ionicons name="people-outline" size={12} color={neutral[400]} />
            <Text style={styles.attendees}>{attendees}</Text>
          </View>
        </View>

        {/* Add to planner */}
        <Pressable
          style={[styles.plannerButton, isPlanned && styles.plannerButtonActive]}
          onPress={() => onAddToPlanner?.(event.id)}
        >
          <Ionicons
            name={isPlanned ? 'checkmark-circle' : 'add-circle-outline'}
            size={14}
            color={isPlanned ? accent.green.DEFAULT : neutral[400]}
          />
          <Text style={[styles.plannerButtonText, isPlanned && styles.plannerButtonTextActive]}>
            {isPlanned ? 'In Planner' : 'Add to Planner'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  dayFilters: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  dayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: neutral[200],
  },
  dayPillActive: {
    backgroundColor: colors.foreground,
  },
  dayPillText: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: colors.mutedForeground,
  },
  dayPillTextActive: {
    color: colors.inverseForeground,
  },
  liveDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: accent.green.DEFAULT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: accent.green.DEFAULT,
  },
  headerTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    color: colors.foreground,
  },
  headerCount: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: neutral[500],
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },
  card: {
    width: 220,
    backgroundColor: '#ffffff',
    borderRadius: radius.lg,
    flexDirection: 'row',
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  accentStrip: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
    gap: 5,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  category: {
    fontFamily: fontFamily.semibold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  time: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: colors.foreground,
  },
  title: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.foreground,
    lineHeight: 19,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  venue: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: neutral[500],
    flex: 1,
  },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attendees: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: neutral[500],
  },
  plannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: 3,
    marginTop: 2,
  },
  plannerButtonActive: {},
  plannerButtonText: {
    fontFamily: fontFamily.regular,
    fontSize: 10,
    color: neutral[400],
  },
  plannerButtonTextActive: {
    color: accent.green.DEFAULT,
    fontFamily: fontFamily.semibold,
  },
  emptyState: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: neutral[400],
  },
});
