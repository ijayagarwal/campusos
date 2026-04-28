import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { accent, colors, fontFamily, neutral, radius, spacing } from '../../theme';

export type CampusSpace = {
  id: string;
  name: string;
  type: string;
  occupancy: 'low' | 'medium' | 'high';
  coordinate?: [number, number];
};

const OCCUPANCY_CONFIG = {
  low: { color: accent.green.DEFAULT, bg: accent.green.muted, label: 'Available', icon: 'checkmark-circle-outline' as const },
  medium: { color: accent.yellow.DEFAULT, bg: accent.yellow.muted, label: 'Moderate', icon: 'time-outline' as const },
  high: { color: accent.red.DEFAULT, bg: accent.red.muted, label: 'Busy', icon: 'alert-circle-outline' as const },
} as const;

const TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Library: 'library-outline',
  Cafe: 'cafe-outline',
  Lab: 'flask-outline',
  Gym: 'fitness-outline',
  Hall: 'business-outline',
  Ground: 'leaf-outline',
  Auditorium: 'musical-notes-outline',
};

type CampusSpacesProps = {
  spaces: CampusSpace[];
  onSpacePress?: (space: CampusSpace) => void;
};

export function CampusSpaces({ spaces, onSpacePress }: CampusSpacesProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campus Spaces</Text>
        <View style={styles.countChip}>
          <Text style={styles.headerCount}>{spaces.length} open</Text>
        </View>
      </View>

      <FlatList
        data={spaces}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const occ = OCCUPANCY_CONFIG[item.occupancy];
          const typeIcon = TYPE_ICONS[item.type] ?? 'location-outline';
          return (
            <Pressable
              style={({ hovered }: any) => [styles.card, hovered && styles.cardHovered]}
              onPress={() => onSpacePress?.(item)}
            >
              <View style={styles.cardIconRow}>
                <View style={styles.typeIcon}>
                  <Ionicons name={typeIcon} size={16} color={colors.foreground} />
                </View>
                <View style={[styles.occBadge, { backgroundColor: occ.bg }]}>
                  <View style={[styles.occDot, { backgroundColor: occ.color }]} />
                  <Text style={[styles.occLabel, { color: occ.color }]}>{occ.label}</Text>
                </View>
              </View>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <View style={styles.typeRow}>
                <Text style={styles.typeText}>{item.type}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
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
    paddingBottom: spacing.sm,
  },
  card: {
    width: 170,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: neutral[200],
  },
  cardHovered: {
    backgroundColor: neutral[150],
    borderColor: neutral[300],
  },
  cardIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  occBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  occDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  occLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: 10,
  },
  name: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.foreground,
    lineHeight: 18,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.mutedForeground,
  },
});
