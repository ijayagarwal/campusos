import { StatusBar } from 'expo-status-bar';
import {
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  useFonts,
} from '@expo-google-fonts/sora';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BottomTabBar, type TabItem } from './src/components/BottomTabBar';
import { TopBar } from './src/components/TopBar';
import { SegmentedControl } from './src/components/SegmentedControl';
import { accent, colors, fontFamily, neutral, radius, spacing } from './src/theme';

import { GlobeMap, type GlobeMapHandle } from './src/features/map/GlobeMap';
import { FestBanner } from './src/features/explore/FestBanner';
import { EventDiscovery } from './src/features/explore/EventDiscovery';
import { CampusSpaces } from './src/features/explore/CampusSpaces';
import { ACTIVE_FEST, campusSpaces } from './src/features/explore/mockExploreData';
import { InsightsPanel } from './src/features/insights/InsightsPanel';
import { SplatViewerScreen } from './src/features/splats/SplatViewerScreen';
import { getSplatSceneById } from './src/features/splats/splatScenes';

import { TECHKRITI_EVENTS, type FestDay, type TechKritiEvent } from './src/data/techkritiEvents';
import { getEventsForDay, getLiveEvents, estimateAttendees } from './src/data/eventHelpers';

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

  // Animations
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentTranslateY = useRef(new Animated.Value(0)).current;
  const insightsSlide = useRef(new Animated.Value(0)).current;
  const sheetContentOpacity = useRef(new Animated.Value(1)).current;
  const sheetContentTranslateX = useRef(new Animated.Value(0)).current;

  const activeSplatScene = activeSplatSceneId
    ? getSplatSceneById(activeSplatSceneId) ?? null
    : null;

  // Filter events by selected day
  const filteredEvents = useMemo(() => {
    if (selectedDay === 'Live') {
      return getLiveEvents(TECHKRITI_EVENTS);
    }
    return getEventsForDay(TECHKRITI_EVENTS, selectedDay);
  }, [selectedDay]);

  // Events to show on map (current day's events or live)
  const mapEvents = useMemo(() => {
    // Show all events for the selected day on map
    if (selectedDay === 'Live') {
      return getLiveEvents(TECHKRITI_EVENTS);
    }
    return getEventsForDay(TECHKRITI_EVENTS, selectedDay);
  }, [selectedDay]);

  if (!fontsLoaded) return null;

  const isExploreTab = activeTab === 'explore';
  const showInsights = isExploreTab && activeMode === 'insights';

  // ── Planner callbacks ──
  function togglePlanner(eventId: string) {
    setPlannedIds((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  }

  // ── Event press → fly to venue ──
  function handleEventPress(event: TechKritiEvent) {
    setSelectedEventId(event.id);
    globeMapRef.current?.flyTo(event.coordinate, 17);
  }

  // ── Animation helpers ──
  function animateContentSwitch(callback: () => void) {
    Animated.parallel([
      Animated.timing(contentOpacity, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.timing(contentTranslateY, { toValue: 8, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      callback();
      contentTranslateY.setValue(-8);
      Animated.parallel([
        Animated.timing(contentOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(contentTranslateY, { toValue: 0, friction: 8, tension: 200, useNativeDriver: true }),
      ]).start();
    });
  }

  function handleModeChange(mode: string) {
    const nextMode = mode as 'explore' | 'insights';
    if (nextMode === activeMode) return;
    if (nextMode === 'insights') {
      setActiveMode(nextMode);
      Animated.spring(insightsSlide, { toValue: 1, friction: 10, tension: 65, useNativeDriver: true }).start();
    } else {
      Animated.timing(insightsSlide, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => {
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
      Animated.timing(sheetContentOpacity, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(sheetContentTranslateX, { toValue: goingRight ? -20 : 20, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      setSheetView(view);
      sheetContentTranslateX.setValue(goingRight ? 20 : -20);
      Animated.parallel([
        Animated.timing(sheetContentOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(sheetContentTranslateX, { toValue: 0, friction: 10, tension: 180, useNativeDriver: true }),
      ]).start();
    });
  }

  function toggleSheetExpanded() {
    LayoutAnimation.configureNext(LayoutAnimation.create(300, 'easeInEaseOut', 'scaleY'));
    setSheetExpanded((prev) => !prev);
  }

  function renderScreen() {
    switch (activeTab) {
      case 'planner':
        return (
          <PlannerScreen
            events={TECHKRITI_EVENTS}
            plannedIds={plannedIds}
            onRemove={togglePlanner}
          />
        );
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

  const insightsTranslateY = insightsSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <View style={styles.rootContainer}>
      <StatusBar style="dark" />
      <TopBar />

      {isExploreTab ? (
        <View style={styles.fill}>
          <GlobeMap
            ref={globeMapRef}
            events={mapEvents}
            selectedEventId={selectedEventId}
          />

          {/* Second row: TechKriti + mode toggle */}
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
          {!showInsights && (
            <View style={[styles.discoveryPanel, sheetExpanded && styles.discoveryPanelExpanded]}>
              <View style={styles.discoveryContainer}>
                <Pressable style={styles.pullHandleArea} onPress={toggleSheetExpanded}>
                  <View style={styles.pullHandle} />
                </Pressable>

                <View style={styles.discoveryHeader}>
                  <View style={styles.miniTabGroup}>
                    <Pressable
                      style={[styles.miniTab, sheetView === 'events' && styles.miniTabActive]}
                      onPress={() => handleSheetViewChange('events')}
                    >
                      <Text style={[styles.miniTabText, sheetView === 'events' && styles.miniTabTextActive]}>
                        Events
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[styles.miniTab, sheetView === 'spaces' && styles.miniTabActive]}
                      onPress={() => handleSheetViewChange('spaces')}
                    >
                      <Text style={[styles.miniTabText, sheetView === 'spaces' && styles.miniTabTextActive]}>
                        Spaces
                      </Text>
                    </Pressable>
                  </View>
                </View>

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
              </View>
            </View>
          )}

          {/* Insights overlay */}
          <Animated.View
            style={[styles.insightsOverlay, { transform: [{ translateY: insightsTranslateY }], opacity: insightsSlide }]}
            pointerEvents={showInsights ? 'auto' : 'none'}
          >
            <InsightsPanel />
          </Animated.View>
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
  rootContainer: { flex: 1, backgroundColor: colors.background },
  fill: { flex: 1 },
  secondRow: {
    position: 'absolute', top: spacing.md, left: spacing.lg, right: spacing.lg,
    zIndex: 10, flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
  },
  modeToggleWrapper: { flex: 1, maxWidth: 180 },
  discoveryPanel: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, maxHeight: '45%' },
  discoveryPanelExpanded: { maxHeight: '72%' },
  discoveryContainer: {
    backgroundColor: 'rgba(250, 250, 250, 0.96)',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingBottom: spacing.md, gap: spacing.sm,
  },
  pullHandleArea: { alignItems: 'center', paddingTop: spacing.md, paddingBottom: spacing.xs },
  pullHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: neutral[300] },
  discoveryHeader: { paddingHorizontal: spacing.xl },
  miniTabGroup: {
    flexDirection: 'row', backgroundColor: neutral[200],
    borderRadius: 12, padding: 3, alignSelf: 'flex-start',
  },
  miniTab: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 10 },
  miniTabActive: { backgroundColor: colors.foreground },
  miniTabText: { fontFamily: fontFamily.semibold, fontSize: 13, color: colors.mutedForeground },
  miniTabTextActive: { color: colors.inverseForeground },
  insightsOverlay: {
    position: 'absolute', top: 56, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(250, 250, 250, 0.97)',
    borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 8,
  },
});
