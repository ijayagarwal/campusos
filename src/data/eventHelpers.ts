import type { FestDay, TechKritiEvent } from './techkritiEvents';

/**
 * Parse "HH:MM" to minutes since midnight.
 */
function parseTime(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Check if an event is currently live.
 * Handles midnight crossover: if endTime <= startTime, the event spans midnight.
 */
export function isEventLive(event: TechKritiEvent, now: Date = new Date()): boolean {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const start = parseTime(event.startTime);
  const end = parseTime(event.endTime);

  if (end > start) {
    // Normal case: e.g. 09:00–17:00
    return currentMinutes >= start && currentMinutes < end;
  } else {
    // Midnight crossover: e.g. 23:00–00:00 or 23:00–03:00
    return currentMinutes >= start || currentMinutes < end;
  }
}

/**
 * Get display time string for an event relative to now.
 */
export function getEventTimeLabel(event: TechKritiEvent, now: Date = new Date()): string {
  if (isEventLive(event, now)) {
    return 'Now';
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const start = parseTime(event.startTime);
  let diff = start - currentMinutes;
  if (diff < 0) diff += 24 * 60; // next day

  if (diff <= 60) {
    return `In ${diff} min`;
  }

  return event.startTime;
}

/**
 * Filter events by day.
 */
export function getEventsForDay(events: TechKritiEvent[], day: FestDay): TechKritiEvent[] {
  return events.filter((e) => e.day === day);
}

/**
 * Get currently live events.
 */
export function getLiveEvents(events: TechKritiEvent[], now: Date = new Date()): TechKritiEvent[] {
  return events.filter((e) => isEventLive(e, now));
}

/**
 * Group events by venueId. Returns a map of venueId → events at that venue.
 */
export type VenueGroup = {
  venueId: string;
  venue: string;
  coordinate: [number, number];
  events: TechKritiEvent[];
  hasLiveEvent: boolean;
  primaryColor: string;
  eventCount: number;
};

export function groupEventsByVenue(events: TechKritiEvent[], now: Date = new Date()): VenueGroup[] {
  const map = new Map<string, TechKritiEvent[]>();

  for (const event of events) {
    const existing = map.get(event.venueId) ?? [];
    existing.push(event);
    map.set(event.venueId, existing);
  }

  const groups: VenueGroup[] = [];

  for (const [venueId, venueEvents] of map) {
    const liveEvents = venueEvents.filter((e) => isEventLive(e, now));
    const hasLive = liveEvents.length > 0;
    const primaryEvent = hasLive ? liveEvents[0] : venueEvents[0];

    groups.push({
      venueId,
      venue: primaryEvent.venue,
      coordinate: primaryEvent.coordinate,
      events: venueEvents,
      hasLiveEvent: hasLive,
      primaryColor: primaryEvent.accentColor,
      eventCount: venueEvents.length,
    });
  }

  return groups;
}

/**
 * Generate mock attendee count based on category and time.
 */
export function estimateAttendees(event: TechKritiEvent): number {
  const base: Record<string, number> = {
    Ceremony: 300,
    Show: 200,
    Competition: 80,
    Talk: 120,
  };
  const b = base[event.category] ?? 100;
  // Simple deterministic variation from event id
  const hash = event.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return b + (hash % 80) - 40;
}
