import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { accent, colors, fontFamily, neutral, radius, spacing } from '../../theme';
import type { FestDay, TechKritiEvent } from '../../data/techkritiEvents';
import { FEST_DAYS } from '../../data/techkritiEvents';
import { getEventTimeLabel, estimateAttendees } from '../../data/eventHelpers';

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
              style={({ hovered }: any) => [
                styles.dayPill,
                isActive && styles.dayPillActive,
                !isActive && hovered && styles.dayPillHovered,
              ]}
              onPress={() => onDayChange(day)}
            >
              {day === 'Live' && (
                <View style={[styles.liveDotSmall, isActive && styles.liveDotSmallActive]} />
              )}
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
        <View style={styles.countChip}>
          <Text style={styles.headerCount}>{events.length} events</Text>
        </View>
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
          <Ionicons name="calendar-outline" size={28} color={neutral[300]} />
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
      style={({ hovered }: any) => [
        styles.card,
        { borderColor: event.accentColor + '30', shadowColor: event.accentColor },
        hovered && styles.cardHovered,
      ]}
      onPress={() => onPress?.(event)}
    >
      <View style={[styles.accentStrip, { backgroundColor: event.accentColor }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <View style={[styles.categoryBadge, { backgroundColor: event.accentColor + '18' }]}>
            <Text style={[styles.category, { color: event.accentColor }]}>{event.category}</Text>
          </View>
          <Text style={styles.time}>{timeLabel}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        <View style={styles.cardMeta}>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={11} color={neutral[400]} />
            <Text style={styles.metaText} numberOfLines={1}>{event.venue}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="people-outline" size={11} color={neutral[400]} />
            <Text style={styles.metaText}>{attendees}</Text>
          </View>
        </View>

        <Pressable
          style={({ hovered }: any) => [
            styles.plannerButton,
            isPlanned && styles.plannerButtonActive,
            hovered && !isPlanned && styles.plannerButtonHovered,
          ]}
          onPress={() => onAddToPlanner?.(event.id)}
        >
          <Ionicons
            name={isPlanned ? 'checkmark-circle' : 'add-circle-outline'}
            size={13}
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
    paddingBottom: spacing.sm,
  },
  dayFilters: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  dayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: neutral[150],
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayPillHovered: {
    backgroundColor: neutral[200],
  },
  dayPillActive: {
    backgroundColor: colors.foreground,
    borderColor: colors.foreground,
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
    backgroundColor: neutral[400],
  },
  liveDotSmallActive: {
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
  countChip: {
    backgroundColor: neutral[150],
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
  },
  headerCount: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    color: colors.mutedForeground,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  card: {
    width: 230,
    backgroundColor: '#ffffff',
    borderRadius: radius.lg,
    flexDirection: 'row',
    overflow: 'visible',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
  },
  cardHovered: {
    shadowOpacity: 0.18,
    shadowRadius: 20,
  },
  accentStrip: {
    width: 4,
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
    gap: 6,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  category: {
    fontFamily: fontFamily.semibold,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  time: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    color: colors.mutedForeground,
  },
  title: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.foreground,
    lineHeight: 20,
  },
  cardMeta: {
    gap: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: neutral[500],
    flex: 1,
  },
  plannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radius.full,
    marginTop: 2,
    backgroundColor: neutral[100],
  },
  plannerButtonHovered: {
    backgroundColor: neutral[200],
  },
  plannerButtonActive: {
    backgroundColor: accent.green.muted,
  },
  plannerButtonText: {
    fontFamily: fontFamily.semibold,
    fontSize: 10,
    color: neutral[500],
  },
  plannerButtonTextActive: {
    color: accent.green.DEFAULT,
  },
  emptyState: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: neutral[400],
  },
});
