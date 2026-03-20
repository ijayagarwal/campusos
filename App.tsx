import { StatusBar } from 'expo-status-bar';
import {
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  useFonts,
} from '@expo-google-fonts/sora';
import { useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  LayoutAnimation,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';

import { BottomTabBar, type TabItem } from './src/components/BottomTabBar';
import { TopBar } from './src/components/TopBar';
import { SegmentedControl } from './src/components/SegmentedControl';
import { accent, colors, fontFamily, neutral, radius, spacing } from './src/theme';

import { GlobeMap } from './src/features/map/GlobeMap';
import { FestBanner } from './src/features/explore/FestBanner';
import { EventDiscovery } from './src/features/explore/EventDiscovery';
import { CampusSpaces } from './src/features/explore/CampusSpaces';
import {
  ACTIVE_FEST,
  campusEvents,
  campusSpaces,
} from './src/features/explore/mockExploreData';
import { InsightsPanel } from './src/features/insights/InsightsPanel';
import { SplatViewerScreen } from './src/features/splats/SplatViewerScreen';
import { getSplatSceneById } from './src/features/splats/splatScenes';

import { PlannerScreen } from './src/screens/PlannerScreen';
import { CampusAIScreen } from './src/screens/CampusAIScreen';
import { GroupsScreen } from './src/screens/GroupsScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AppTab = 'explore' | 'planner' | 'campus-ai' | 'groups' | 'leaderboard';

const TAB_ITEMS: TabItem[] = [
  { key: 'explore', label: 'Explore', icon: 'compass-outline', activeIcon: 'compass' },
  { key: 'planner', label: 'Planner', icon: 'calendar-outline', activeIcon: 'calendar' },
  { key: 'campus-ai', label: 'Campus AI', icon: 'sparkles-outline', activeIcon: 'sparkles' },
  { key: 'groups', label: 'Groups', icon: 'people-outline', activeIcon: 'people' },
  { key: 'leaderboard', label: 'Board', icon: 'trophy-outline', activeIcon: 'trophy' },
];

const MODE_SEGMENTS = [
  { key: 'explore', label: 'Explore' },
  { key: 'insights', label: 'Insights' },
];

export default function App() {
  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
  });
  const [activeTab, setActiveTab] = useState<AppTab>('explore');
  const [activeMode, setActiveMode] = useState<'explore' | 'insights'>('explore');
  const [sheetView, setSheetView] = useState<'events' | 'spaces'>('events');
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [activeSplatSceneId, setActiveSplatSceneId] = useState<string | null>(null);

  // Animations
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentTranslateY = useRef(new Animated.Value(0)).current;
  const insightsSlide = useRef(new Animated.Value(0)).current;
  const sheetContentOpacity = useRef(new Animated.Value(1)).current;
  const sheetContentTranslateX = useRef(new Animated.Value(0)).current;

  const activeSplatScene = activeSplatSceneId
    ? getSplatSceneById(activeSplatSceneId) ?? null
    : null;

  if (!fontsLoaded) {
    return null;
  }

  const isExploreTab = activeTab === 'explore';
  const showInsights = isExploreTab && activeMode === 'insights';

  function animateContentSwitch(callback: () => void) {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      contentTranslateY.setValue(-8);
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(contentTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }

  function handleModeChange(mode: string) {
    const nextMode = mode as 'explore' | 'insights';
    if (nextMode === activeMode) return;

    if (nextMode === 'insights') {
      setActiveMode(nextMode);
      Animated.spring(insightsSlide, {
        toValue: 1,
        friction: 10,
        tension: 65,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(insightsSlide, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        setActiveMode(nextMode);
      });
    }
  }

  function handleTabSelect(key: string) {
    if (key === activeTab) return;

    animateContentSwitch(() => {
      setActiveTab(key as AppTab);
      if (key === 'explore') {
        setActiveMode('explore');
        insightsSlide.setValue(0);
      }
    });
  }

  function handleSheetViewChange(view: 'events' | 'spaces') {
    if (view === sheetView) return;

    const goingRight = view === 'spaces';

    // Slide out current content
    Animated.parallel([
      Animated.timing(sheetContentOpacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(sheetContentTranslateX, {
        toValue: goingRight ? -20 : 20,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSheetView(view);

      // Slide in new content from opposite direction
      sheetContentTranslateX.setValue(goingRight ? 20 : -20);
      Animated.parallel([
        Animated.timing(sheetContentOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(sheetContentTranslateX, {
          toValue: 0,
          friction: 10,
          tension: 180,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }

  function toggleSheetExpanded() {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(300, 'easeInEaseOut', 'scaleY'),
    );
    setSheetExpanded((prev) => !prev);
  }

  function renderScreen() {
    switch (activeTab) {
      case 'planner':
        return <PlannerScreen />;
      case 'campus-ai':
        return <CampusAIScreen />;
      case 'groups':
        return <GroupsScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      default:
        return null;
    }
  }

  // Insights overlay animated translateY
  const insightsTranslateY = insightsSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <View style={styles.rootContainer}>
      <StatusBar style="dark" />

      {/* ── Solid top bar ── */}
      <TopBar />

      {isExploreTab ? (
        // ── Explore: full-bleed map with overlays ──
        <View style={styles.fill}>
          <GlobeMap />

          {/* Second row: TechKriti (left) + Explore/Insights toggle */}
          <View style={styles.secondRow}>
            <FestBanner
              festName={ACTIVE_FEST.name}
              onPress={() => {
                setSheetView('events');
                if (!sheetExpanded) toggleSheetExpanded();
              }}
            />
            <View style={styles.modeToggleWrapper}>
              <SegmentedControl
                segments={MODE_SEGMENTS}
                activeKey={activeMode}
                onSelect={handleModeChange}
                compact
              />
            </View>
          </View>

          {/* Discovery bottom sheet */}
          <View style={[
            styles.discoveryPanel,
            sheetExpanded && styles.discoveryPanelExpanded,
          ]}>
            <View style={styles.discoveryContainer}>
              {/* Pull handle */}
              <Pressable style={styles.pullHandleArea} onPress={toggleSheetExpanded}>
                <View style={styles.pullHandle} />
              </Pressable>

              {/* Mini tab group: Events / Spaces */}
              <View style={styles.discoveryHeader}>
                <View style={styles.miniTabGroup}>
                  <Pressable
                    style={[
                      styles.miniTab,
                      sheetView === 'events' && styles.miniTabActive,
                    ]}
                    onPress={() => handleSheetViewChange('events')}
                  >
                    <Text
                      style={[
                        styles.miniTabText,
                        sheetView === 'events' && styles.miniTabTextActive,
                      ]}
                    >
                      Events
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.miniTab,
                      sheetView === 'spaces' && styles.miniTabActive,
                    ]}
                    onPress={() => handleSheetViewChange('spaces')}
                  >
                    <Text
                      style={[
                        styles.miniTabText,
                        sheetView === 'spaces' && styles.miniTabTextActive,
                      ]}
                    >
                      Spaces
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Content — animated on tab switch */}
              <Animated.View
                style={{
                  opacity: sheetContentOpacity,
                  transform: [{ translateX: sheetContentTranslateX }],
                }}
              >
                {sheetExpanded ? (
                  <ScrollView
                    style={styles.expandedScroll}
                    showsVerticalScrollIndicator={false}
                  >
                    {sheetView === 'events' ? (
                      <ExpandedEvents events={campusEvents} />
                    ) : (
                      <CampusSpaces spaces={campusSpaces} />
                    )}
                  </ScrollView>
                ) : (
                  <>
                    {sheetView === 'events' ? (
                      <EventDiscovery events={campusEvents} />
                    ) : (
                      <CampusSpaces spaces={campusSpaces} />
                    )}
                  </>
                )}
              </Animated.View>
            </View>
          </View>

          {/* Insights overlay (animated slide-up) */}
          <Animated.View
            style={[
              styles.insightsOverlay,
              {
                transform: [{ translateY: insightsTranslateY }],
                opacity: insightsSlide,
              },
            ]}
            pointerEvents={showInsights ? 'auto' : 'none'}
          >
            <InsightsPanel />
          </Animated.View>
        </View>
      ) : (
        // ── Other tabs: animated content ──
        <Animated.View
          style={[
            styles.fill,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}
        >
          {renderScreen()}
        </Animated.View>
      )}

      {/* ── Solid bottom tab bar ── */}
      <BottomTabBar
        items={TAB_ITEMS}
        activeKey={activeTab}
        onSelect={handleTabSelect}
      />

      {activeSplatScene ? (
        <SplatViewerScreen
          scene={activeSplatScene}
          onClose={() => setActiveSplatSceneId(null)}
        />
      ) : null}
    </View>
  );
}

// ── Expanded event list (vertical, with more details) ──

import { Ionicons } from '@expo/vector-icons';
import type { CampusEvent } from './src/features/explore/EventDiscovery';

function ExpandedEvents({ events }: { events: CampusEvent[] }) {
  return (
    <View style={styles.expandedList}>
      {events.map((event) => (
        <Pressable key={event.id} style={styles.expandedCard}>
          <View style={[styles.expandedAccent, { backgroundColor: event.accentColor }]} />
          <View style={styles.expandedContent}>
            <View style={styles.expandedTop}>
              <View style={[styles.expandedCategoryBadge, { backgroundColor: event.accentColor + '18' }]}>
                <Text style={[styles.expandedCategory, { color: event.accentColor }]}>
                  {event.category}
                </Text>
              </View>
              <Text style={styles.expandedTime}>{event.time}</Text>
            </View>
            <Text style={styles.expandedTitle}>{event.title}</Text>
            <View style={styles.expandedMeta}>
              <View style={styles.expandedMetaItem}>
                <Ionicons name="location-outline" size={13} color={neutral[400]} />
                <Text style={styles.expandedMetaText}>{event.venue}</Text>
              </View>
              <View style={styles.expandedMetaItem}>
                <Ionicons name="people-outline" size={13} color={neutral[400]} />
                <Text style={styles.expandedMetaText}>{event.attendees} attending</Text>
              </View>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fill: {
    flex: 1,
  },

  // ── Second row: TechKriti (left) + mode toggle ──
  secondRow: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  modeToggleWrapper: {
    flex: 1,
    maxWidth: 180,
  },

  // ── Discovery bottom sheet ──
  discoveryPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    maxHeight: '40%',
  },
  discoveryPanelExpanded: {
    maxHeight: '70%',
  },
  discoveryContainer: {
    backgroundColor: 'rgba(250, 250, 250, 0.96)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  pullHandleArea: {
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  pullHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: neutral[300],
  },
  discoveryHeader: {
    paddingHorizontal: spacing.xl,
  },
  miniTabGroup: {
    flexDirection: 'row',
    backgroundColor: neutral[200],
    borderRadius: 12,
    padding: 3,
    alignSelf: 'flex-start',
  },
  miniTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 10,
  },
  miniTabActive: {
    backgroundColor: colors.foreground,
  },
  miniTabText: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.mutedForeground,
  },
  miniTabTextActive: {
    color: colors.inverseForeground,
  },

  // ── Expanded scroll ──
  expandedScroll: {
    flex: 1,
  },
  expandedList: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  expandedCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  expandedAccent: {
    width: 5,
  },
  expandedContent: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  expandedTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandedCategoryBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  expandedCategory: {
    fontFamily: fontFamily.semibold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  expandedTime: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.foreground,
  },
  expandedTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.foreground,
    lineHeight: 22,
  },
  expandedMeta: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  expandedMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  expandedMetaText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: neutral[500],
  },

  // ── Insights overlay ──
  insightsOverlay: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(250, 250, 250, 0.97)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 8,
  },
});
