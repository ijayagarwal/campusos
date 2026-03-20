# CampusOS — Agent Guide

## What is this?

React Native (Expo 54) campus discovery app for IIT Kanpur. Features a 3D Mapbox globe, real-time TechKriti festival event discovery, venue activity markers, event planner, and a personal insights dashboard.

## Tech Stack

- **React Native 0.81 + Expo 54** — cross-platform (iOS/Android/Web)
- **TypeScript 5.9** (strict mode)
- **@rnmapbox/maps 10.2** — 3D globe, building extrusions, MarkerView overlays
- **expo-location** — foreground GPS tracking
- **react-native-webview** — embedded 3D splat scene viewer
- **Sora** font (via @expo-google-fonts)
- **No state library** — React hooks in App.tsx, prop drilling

## Directory Structure

```
App.tsx                          ← App shell: tabs, state, animations
src/
  theme/
    tokens.ts                    ← Design tokens (colors, typography, spacing, radius)
    index.ts                     ← Barrel export
  components/
    TopBar.tsx                   ← Header: logo + 3-dot menu
    BottomTabBar.tsx              ← 5-tab navigation with bounce animations
    SegmentedControl.tsx          ← Reusable pill toggle (Explore/Insights)
  data/
    techkritiEvents.ts            ← 54 real events, types, category→color mapping
    venueCoordinates.ts           ← 22 venue→[lng,lat] lookups
    eventHelpers.ts               ← isEventLive(), groupByVenue(), filtering
  features/
    map/
      GlobeMap.tsx                ← Mapbox globe, forwardRef with flyTo(), venue markers
      ActivityMarker.tsx          ← Pulsing circle + venue label for map
      mapStyles.ts                ← Mapbox layer styles, camera presets
      mockData.ts                 ← POI/area GeoJSON fixtures
      types.ts                    ← Map type definitions
    explore/
      EventDiscovery.tsx          ← Day filter + horizontal event cards + planner button
      CampusSpaces.tsx            ← Venue occupancy cards
      FestBanner.tsx              ← "TechKriti 2026" pulsing live pill
      mockExploreData.ts          ← Re-exports + campus spaces mock data
    insights/
      InsightsPanel.tsx           ← Day summary, cognitive load, behavior cards
    location/
      locationService.ts          ← expo-location wrapper (permissions, watch)
    splats/
      SplatViewerScreen.tsx       ← Full-screen WebView 3D viewer modal
      splatScenes.ts              ← Scene catalog (Outreach Auditorium, Library)
      types.ts                    ← SplatScene type
  screens/
    PlannerScreen.tsx             ← Planned events grouped by day
    CampusAIScreen.tsx            ← Placeholder
    GroupsScreen.tsx              ← Mock social groups
    LeaderboardScreen.tsx         ← Placeholder
  styles/
    homeStyles.ts                 ← Legacy (migrated to tokens, can be deleted)
```

## App State (all in App.tsx)

| State | Type | Purpose |
|-------|------|---------|
| `activeTab` | `AppTab` | Current bottom tab |
| `activeMode` | `'explore' \| 'insights'` | Toggle within Explore tab |
| `sheetView` | `'events' \| 'spaces'` | Bottom sheet content |
| `sheetExpanded` | `boolean` | Bottom sheet height |
| `selectedDay` | `FestDay \| 'Live'` | Event day filter |
| `selectedEventId` | `string \| null` | Highlighted event → map fly-to |
| `plannedIds` | `Set<string>` | Events added to planner |
| `activeSplatSceneId` | `string \| null` | Open 3D scene modal |

## Key Data Flows

**Event tap → Map fly-to:**
```
EventDiscovery.onEventPress(event)
  → App.handleEventPress: setSelectedEventId + globeMapRef.flyTo(coordinate)
    → GlobeMap receives selectedEventId → ActivityMarker highlights venue
    → Camera animates to venue (1200ms flyTo)
```

**Planner toggle:**
```
EventCard "Add to Planner" press
  → App.togglePlanner(id) → plannedIds Set add/remove
  → PlannerScreen receives updated plannedIds → re-renders grouped list
```

**Day filter → Map + Cards:**
```
EventDiscovery day pill press
  → App.setSelectedDay
  → filteredEvents = getEventsForDay(events, day) or getLiveEvents(events)
  → GlobeMap.events = mapEvents → venue markers update
  → EventDiscovery.events = filteredEvents → cards update
```

## Map Architecture

- `GlobeMap` uses `forwardRef` + `useImperativeHandle` to expose `flyTo(coordinate, zoom?)`
- Events are grouped by venue via `groupEventsByVenue()` → one `MarkerView` per venue
- Each `ActivityMarker` shows: accent-colored circle, event count, venue label
- Live events get a pulsing ring animation; static events show at 55% opacity
- Startup flight: 2-stage camera animation (global → India → campus), ~6 seconds

## Animation Patterns

All animations use `Animated` API with `useNativeDriver: true`:

| Animation | Technique | Duration |
|-----------|-----------|----------|
| Tab switch | Fade out + slide, then fade in + spring | 100ms + 180ms |
| Insights overlay | Spring slide from bottom | ~400ms |
| Bottom sheet Events↔Spaces | Directional translateX + opacity | 120ms + 200ms |
| Tab bar icon bounce | Scale 0.85 → spring to 1.0 | ~200ms |
| Segmented pill bounce | Scale 0.93 → spring to 1.0 | ~200ms |
| Activity marker pulse | Scale loop 1→2, opacity 0.35→0 | 2.8s cycle |
| Fest banner dot pulse | Scale loop 1→1.6 | 2.4s cycle |
| Sheet expand/collapse | LayoutAnimation scaleY | 300ms |

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN` | Yes | Mapbox GL access |
| `RNMAPBOX_MAPS_DOWNLOAD_TOKEN` | No | Mapbox offline tiles |
| `EXPO_PUBLIC_SPARK_VIEWER_URL` | No | 3D splat viewer base URL |

## Adding a New Screen

1. Create `src/screens/MyScreen.tsx`
2. Import tokens: `import { colors, fontFamily, spacing } from '../theme'`
3. Add tab entry in `TAB_ITEMS` array in App.tsx
4. Add case in `renderScreen()` switch
5. Add `AppTab` union type member

## Adding a New Feature to Explore Tab

1. Create component in `src/features/yourFeature/`
2. Import and render in the explore section of App.tsx (between `<GlobeMap />` and bottom sheet)
3. Use `position: 'absolute'` + `zIndex` for map overlays
4. For map interaction, use `globeMapRef.current.flyTo()`

## Common Gotchas

- **Mapbox on web**: Web export fails due to `mapbox-gl` CSS import. Target iOS/Android via `npx expo start --dev-client`
- **Shadows**: Removed by user preference. Use accent-colored `shadowColor` only on event cards for glow effect
- **Location on web**: Skipped via `Platform.OS === 'web'` guard
- **homeStyles.ts**: Legacy file, fully migrated to tokens. Can be deleted once all imports removed
- **Midnight events**: `isEventLive()` handles endTime < startTime (e.g., 23:00–03:00)
