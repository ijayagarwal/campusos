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
  low: { color: accent.green.DEFAULT, label: 'Low' },
  medium: { color: accent.yellow.DEFAULT, label: 'Moderate' },
  high: { color: accent.red.DEFAULT, label: 'Busy' },
} as const;

type CampusSpacesProps = {
  spaces: CampusSpace[];
  onSpacePress?: (space: CampusSpace) => void;
};

export function CampusSpaces({ spaces, onSpacePress }: CampusSpacesProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campus Spaces</Text>
        <Text style={styles.headerCount}>{spaces.length} open</Text>
      </View>

      <FlatList
        data={spaces}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const occ = OCCUPANCY_CONFIG[item.occupancy];
          return (
            <Pressable
              style={styles.card}
              onPress={() => onSpacePress?.(item)}
            >
              <View style={styles.cardTop}>
                <View style={styles.typeTag}>
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>
                <View style={styles.occRow}>
                  <View style={[styles.occDot, { backgroundColor: occ.color }]} />
                  <Text style={styles.occLabel}>{occ.label}</Text>
                </View>
              </View>
              <Text style={styles.name}>{item.name}</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.foreground,
  },
  headerCount: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.muted,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  card: {
    width: 180,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeTag: {
    backgroundColor: neutral[200],
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  typeText: {
    fontFamily: fontFamily.semibold,
    fontSize: 10,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  occRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  occDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  occLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.muted,
  },
  name: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.foreground,
  },
});
