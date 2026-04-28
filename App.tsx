import {
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  useFonts,
} from '@expo-google-fonts/sora';
import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BottomTabBar, type TabItem } from './src/components/BottomTabBar';
import { TopBar } from './src/components/TopBar';
import { SegmentedControl } from './src/components/SegmentedControl';
import { colors, fontFamily, neutral, spacing } from './src/theme';

import { GlobeMap, type GlobeMapHandle } from './src/features/map/GlobeMap';
import { FestBanner } from './src/features/explore/FestBanner';
import { EventDiscovery } from './src/features/explore/EventDiscovery';
import { CampusSpaces } from './src/features/explore/CampusSpaces';
import { ACTIVE_FEST, campusSpaces } from './src/features/explore/mockExploreData';
import { InsightsPanel } from './src/features/insights/InsightsPanel';
import { SplatViewerScreen } from './src/features/splats/SplatViewerScreen';
import { getSplatSceneById } from './src/features/splats/splatScenes';

import { TECHKRITI_EVENTS, type FestDay, type TechKritiEvent } from './src/data/techkritiEvents';
import { getEventsForDay, getLiveEvents } from './src/data/eventHelpers';

import { PlannerScreen } from './src/screens/PlannerScreen';
import { CampusAIScreen } from './src/screens/CampusAIScreen';
import { GroupsScreen } from './src/screens/GroupsScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';


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

// Sheet height as a fraction of the content area (map + sheet)
const SHEET_COLLAPSED_RATIO = 0.42;
const SHEET_EXPANDED_RATIO = 0.70;

export default function App() {
  const [fontsLoaded] = useFonts({ Sora_400Regular, Sora_600SemiBold, Sora_700Bold });
  const [activeTab, setActiveTab] = useState<AppTab>('explore');
  const [activeMode, setActiveMode] = useState<'explore' | 'insights'>('explore');
  const [sheetView, setSheetView] = useState<'events' | 'spaces'>('events');
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [selectedDay, setSelectedDay] = useState<FestDay | 'Live'>('Live');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [plannedIds, setPlannedIds] = useState<Set<string>>(new Set());
  const [activeSplatSceneId, setActiveSplatSceneId] = useState<string | null>(null);

  const globeMapRef = useRef<GlobeMapHandle>(null);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentTranslateY = useRef(new Animated.Value(0)).current;
  const insightsSlide = useRef(new Animated.Value(0)).current;
  const sheetContentOpacity = useRef(new Animated.Value(1)).current;
  const sheetContentTranslateX = useRef(new Animated.Value(0)).current;

  const activeSplatScene = activeSplatSceneId ? getSplatSceneById(activeSplatSceneId) ?? null : null;

  const filteredEvents = useMemo(() => {
    if (selectedDay === 'Live') return getLiveEvents(TECHKRITI_EVENTS);
    return getEventsForDay(TECHKRITI_EVENTS, selectedDay);
  }, [selectedDay]);

  const mapEvents = useMemo(() => {
    if (selectedDay === 'Live') return getLiveEvents(TECHKRITI_EVENTS);
    return getEventsForDay(TECHKRITI_EVENTS, selectedDay);
  }, [selectedDay]);

  if (!fontsLoaded) return null;

  const isExploreTab = activeTab === 'explore';
  const showInsights = isExploreTab && activeMode === 'insights';
  const sheetRatio = sheetExpanded ? SHEET_EXPANDED_RATIO : SHEET_COLLAPSED_RATIO;

  function togglePlanner(eventId: string) {
    setPlannedIds((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  }

  function handleEventPress(event: TechKritiEvent) {
    setSelectedEventId(event.id);
    globeMapRef.current?.flyTo(event.coordinate, 17);
  }

  function animateContentSwitch(callback: () => void) {
    Animated.parallel([
      Animated.timing(contentOpacity, { toValue: 0, duration: 100, useNativeDriver: false }),
      Animated.timing(contentTranslateY, { toValue: 8, duration: 100, useNativeDriver: false }),
    ]).start(() => {
      callback();
      contentTranslateY.setValue(-8);
      Animated.parallel([
        Animated.timing(contentOpacity, { toValue: 1, duration: 180, useNativeDriver: false }),
        Animated.spring(contentTranslateY, { toValue: 0, friction: 8, tension: 200, useNativeDriver: false }),
      ]).start();
    });
  }

  function handleModeChange(mode: string) {
    const nextMode = mode as 'explore' | 'insights';
    if (nextMode === activeMode) return;
    if (nextMode === 'insights') {
      setActiveMode(nextMode);
      Animated.spring(insightsSlide, { toValue: 1, friction: 10, tension: 65, useNativeDriver: false }).start();
    } else {
      Animated.timing(insightsSlide, { toValue: 0, duration: 220, useNativeDriver: false }).start(() => {
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
    Animated.parallel([
      Animated.timing(sheetContentOpacity, { toValue: 0, duration: 120, useNativeDriver: false }),
      Animated.timing(sheetContentTranslateX, { toValue: goingRight ? -20 : 20, duration: 120, useNativeDriver: false }),
    ]).start(() => {
      setSheetView(view);
      sheetContentTranslateX.setValue(goingRight ? 20 : -20);
      Animated.parallel([
        Animated.timing(sheetContentOpacity, { toValue: 1, duration: 200, useNativeDriver: false }),
        Animated.spring(sheetContentTranslateX, { toValue: 0, friction: 10, tension: 180, useNativeDriver: false }),
      ]).start();
    });
  }

  function renderScreen() {
    switch (activeTab) {
      case 'planner': return <PlannerScreen events={TECHKRITI_EVENTS} plannedIds={plannedIds} onRemove={togglePlanner} />;
      case 'campus-ai': return <CampusAIScreen />;
      case 'groups': return <GroupsScreen />;
      case 'leaderboard': return <LeaderboardScreen />;
      default: return null;
    }
  }

  const insightsTranslateY = insightsSlide.interpolate({ inputRange: [0, 1], outputRange: [600, 0] });

  return (
    <View style={styles.root}>
      <TopBar />

      {isExploreTab ? (
        // Explore tab: map on top, sheet on bottom — both in normal flow (not absolute)
        <View style={styles.exploreBody}>
          {/* Map area — flex grows to fill whatever the sheet doesn't take */}
          <View style={{ flex: 1 - sheetRatio, minHeight: 80 }}>
            <GlobeMap ref={globeMapRef} events={mapEvents} selectedEventId={selectedEventId} />

            {/* Floating controls over the map */}
            <View style={styles.mapControls}>
              <FestBanner
                festName={ACTIVE_FEST.name}
                onPress={() => {
                  setSheetView('events');
                  if (!sheetExpanded) setSheetExpanded(true);
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

            {/* Insights slide-up */}
            <Animated.View
              style={[styles.insightsOverlay, { transform: [{ translateY: insightsTranslateY }], opacity: insightsSlide }]}
              pointerEvents={showInsights ? 'auto' : 'none'}
            >
              <InsightsPanel />
            </Animated.View>
          </View>

          {/* Bottom sheet — fixed flex ratio, always scrollable */}
          {!showInsights && (
            <View style={{ flex: sheetRatio }}>
              <View style={styles.sheet}>
                {/* Drag handle */}
                <Pressable style={styles.handleArea} onPress={() => setSheetExpanded((v) => !v)}>
                  <View style={styles.handle} />
                </Pressable>

                {/* Tab switcher */}
                <View style={styles.sheetHeader}>
                  <View style={styles.tabGroup}>
                    {(['events', 'spaces'] as const).map((v) => (
                      <Pressable
                        key={v}
                        style={[styles.tab, sheetView === v && styles.tabActive]}
                        onPress={() => handleSheetViewChange(v)}
                      >
                        <Text style={[styles.tabText, sheetView === v && styles.tabTextActive]}>
                          {v === 'events' ? 'Events' : 'Spaces'}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <Pressable
                    style={styles.expandBtn}
                    onPress={() => setSheetExpanded((v) => !v)}
                  >
                    <Text style={styles.expandBtnText}>{sheetExpanded ? '↓ Less' : '↑ More'}</Text>
                  </Pressable>
                </View>

                {/* Scrollable content */}
                <ScrollView
                  style={styles.sheetScroll}
                  contentContainerStyle={styles.sheetScrollContent}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                >
                  <Animated.View style={{ opacity: sheetContentOpacity, transform: [{ translateX: sheetContentTranslateX }] }}>
                    {sheetView === 'events' ? (
                      <EventDiscovery
                        events={filteredEvents}
                        selectedDay={selectedDay}
                        onDayChange={setSelectedDay}
                        onEventPress={handleEventPress}
                        onAddToPlanner={togglePlanner}
                        plannedIds={plannedIds}
                      />
                    ) : (
                      <CampusSpaces spaces={campusSpaces} />
                    )}
                  </Animated.View>
                </ScrollView>
              </View>
            </View>
          )}
        </View>
      ) : (
        <Animated.View style={[styles.fill, { opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }]}>
          {renderScreen()}
        </Animated.View>
      )}

      <BottomTabBar items={TAB_ITEMS} activeKey={activeTab} onSelect={handleTabSelect} />

      {activeSplatScene ? (
        <SplatViewerScreen scene={activeSplatScene} onClose={() => setActiveSplatSceneId(null)} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fill: { flex: 1 },

  // Explore layout — column flex so map + sheet share the space
  exploreBody: {
    flex: 1,
    flexDirection: 'column',
  },

  // Floating controls sitting above the map
  mapControls: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  modeToggleWrapper: { flex: 1, maxWidth: 200 },

  // Insights full-overlay (sits above the map view)
  insightsOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(250,250,250,0.97)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 8,
  },

  // Bottom sheet
  sheet: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: neutral[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: neutral[300],
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  tabGroup: {
    flexDirection: 'row',
    backgroundColor: neutral[150],
    borderRadius: 12,
    padding: 3,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 7,
    borderRadius: 10,
    cursor: 'pointer',
  } as any,
  tabActive: {
    backgroundColor: colors.foreground,
  },
  tabText: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.mutedForeground,
    userSelect: 'none',
  } as any,
  tabTextActive: {
    color: colors.inverseForeground,
  },
  expandBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: neutral[150],
    cursor: 'pointer',
  } as any,
  expandBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    color: colors.mutedForeground,
    userSelect: 'none',
  } as any,
  sheetScroll: {
    flex: 1,
  },
  sheetScrollContent: {
    paddingBottom: spacing.xl,
  },
});
