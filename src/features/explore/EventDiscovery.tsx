import { Ionicons } from '@expo/vector-icons';
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { accent, colors, fontFamily, neutral, radius, spacing } from '../../theme';

export type CampusEvent = {
  id: string;
  title: string;
  time: string;
  venue: string;
  category: string;
  attendees: number;
  accentColor: string;
  coordinate?: [number, number];
};

type EventDiscoveryProps = {
  events: CampusEvent[];
  onEventPress?: (event: CampusEvent) => void;
};

export function EventDiscovery({ events, onEventPress }: EventDiscoveryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.liveDot} />
          <Text style={styles.headerTitle}>Happening Now</Text>
        </View>
        <Text style={styles.headerCount}>{events.length} events</Text>
      </View>

      <FlatList
        data={events}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard event={item} onPress={onEventPress} />
        )}
      />
    </View>
  );
}

function EventCard({
  event,
  onPress,
}: {
  event: CampusEvent;
  onPress?: (event: CampusEvent) => void;
}) {
  return (
    <Pressable
      style={[
        styles.card,
        {
          borderColor: event.accentColor + '28',
          // Accent-colored blurred glow (iOS shadow / Android elevation)
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
          <Text style={styles.time}>{event.time}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        <View style={styles.cardBottom}>
          <View style={styles.venueRow}>
            <Ionicons name="location-outline" size={12} color={neutral[400]} />
            <Text style={styles.venue}>{event.venue}</Text>
          </View>
          <View style={styles.attendeeRow}>
            <Ionicons name="people-outline" size={12} color={neutral[400]} />
            <Text style={styles.attendees}>{event.attendees}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
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
    // Glow blur — shadowColor is set inline per card
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
    gap: 6,
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
    marginTop: 2,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  venue: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: neutral[500],
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
});
