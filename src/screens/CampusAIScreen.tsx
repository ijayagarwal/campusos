import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

import { accent, colors, fontFamily, neutral, radius, spacing, typography } from '../theme';

const suggestions = [
  { icon: 'calendar-outline' as const, text: 'What events are happening today?' },
  { icon: 'location-outline' as const, text: 'How do I get to Hall 5?' },
  { icon: 'time-outline' as const, text: 'When does the mess close tonight?' },
  { icon: 'people-outline' as const, text: 'Which groups can I join?' },
];

export function CampusAIScreen() {
  const [input, setInput] = useState('');

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.iconRing}>
            <View style={styles.iconInner}>
              <Ionicons name="sparkles" size={26} color={accent.violet.DEFAULT} />
            </View>
          </View>
          <Text style={styles.heroTitle}>Campus AI</Text>
          <Text style={styles.heroSubtitle}>
            Ask anything about IIT Kanpur — events, routes, schedules, food, or recommendations.
          </Text>
        </View>

        {/* Suggestion chips */}
        <View style={styles.suggestionsSection}>
          <Text style={styles.suggestionsLabel}>Try asking</Text>
          <View style={styles.suggestions}>
            {suggestions.map((s) => (
              <Pressable
                key={s.text}
                style={({ hovered }: any) => [styles.chip, hovered && styles.chipHovered]}
                onPress={() => setInput(s.text)}
              >
                <Ionicons name={s.icon} size={14} color={accent.violet.DEFAULT} />
                <Text style={styles.chipText}>{s.text}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Info cards */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Ionicons name="flash-outline" size={18} color={accent.blue.DEFAULT} />
            <Text style={styles.infoTitle}>Instant answers</Text>
            <Text style={styles.infoBody}>Real-time info about campus events, spaces, and schedules.</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="navigate-outline" size={18} color={accent.green.DEFAULT} />
            <Text style={styles.infoTitle}>Navigation help</Text>
            <Text style={styles.infoBody}>Directions to any building, hall, or facility on campus.</Text>
          </View>
        </View>

        <View style={styles.comingSoonNote}>
          <Ionicons name="construct-outline" size={14} color={neutral[400]} />
          <Text style={styles.comingSoonText}>Full AI chat launching soon — stay tuned!</Text>
        </View>
      </ScrollView>

      {/* Input bar */}
      <View style={styles.inputBar}>
        <View style={styles.inputWrap}>
          <Ionicons name="search-outline" size={16} color={neutral[400]} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Ask Campus AI anything..."
            placeholderTextColor={neutral[400]}
            value={input}
            onChangeText={setInput}
          />
          {input.length > 0 && (
            <Pressable style={styles.sendBtn} onPress={() => setInput('')}>
              <Ionicons name="arrow-up" size={14} color={colors.inverseForeground} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: {
    padding: spacing.xl,
    gap: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  iconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: accent.violet.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: accent.violet.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },

  suggestionsSection: { gap: spacing.md },
  suggestionsLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: neutral[400],
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  suggestions: { gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: accent.violet.muted,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    alignSelf: 'flex-start',
  },
  chipHovered: {
    backgroundColor: '#ddd6fe',
  },
  chipText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: accent.violet.DEFAULT,
  },

  infoGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: neutral[200],
  },
  infoTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.foreground,
  },
  infoBody: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.mutedForeground,
    lineHeight: 17,
  },

  comingSoonNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  comingSoonText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: neutral[400],
  },

  inputBar: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: neutral[200],
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: neutral[100],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: neutral[200],
    paddingHorizontal: spacing.md,
    height: 44,
  },
  inputIcon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.foreground,
    outlineStyle: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent',
  } as any,
  sendBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.foreground,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});
