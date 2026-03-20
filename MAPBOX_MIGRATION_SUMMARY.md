# CampusOS Globe Migration Summary

## Completed

### Dependency and runtime migration
- Removed `react-native-maps`.
- Added `@rnmapbox/maps`.
- Added `expo-location`.
- Added `expo-dev-client`.
- Added `react-native-webview`.
- Added `@types/geojson` and `@types/node`.

### Package scripts
- Updated `package.json` so the default start path uses the Expo dev client:
  - `start`: `expo start --dev-client`
  - `android`: `expo run:android`
  - `ios`: `expo run:ios`

### Expo config migration
- Removed `app.json`.
- Added `app.config.ts`.
- Config now:
  - keeps the existing app metadata and assets
  - enables `expo-font`
  - enables `@rnmapbox/maps`
  - enables `expo-location`
  - sets iOS foreground location permission text to:
    - `Allow CampusOS to show your current location on the globe.`
  - disables background location flags for the first release
  - supports both:
    - `EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN`
    - `RNMAPBOX_DOWNLOADS_TOKEN`
  - forwards `RNMAPBOX_DOWNLOADS_TOKEN` to `RNMAPBOX_MAPS_DOWNLOAD_TOKEN` for Mapbox native downloads
  - pins the native Mapbox SDK version to `11.13.4` in the config plugin

### TypeScript config
- Updated `tsconfig.json` to include Node types so `app.config.ts` can type-check cleanly.

## New feature modules

### Map feature model
Added:
- `src/features/map/types.ts`
- `src/features/map/mockData.ts`
- `src/features/map/mapStyles.ts`

This provides:
- typed POI and area models
- typed live-location model
- GeoJSON feature adapters for POIs and areas
- mock campus POIs and areas
- Mapbox layer style tokens
- Mapbox public token bootstrap via `Mapbox.setAccessToken(...)`

### Location service
Added:
- `src/features/location/locationService.ts`

This provides:
- foreground permission request
- last-known location fetch
- foreground live GPS watch via `watchPositionAsync`
- normalization into the app-owned `LiveLocation` shape

### Splat scaffolding
Added:
- `src/features/splats/types.ts`
- `src/features/splats/splatScenes.ts`
- `src/features/splats/SplatViewerScreen.tsx`

This provides:
- typed splat scene contracts
- a sample splat scene entry
- a WebView-backed detail screen shell
- support for a future Spark viewer URL through `EXPO_PUBLIC_SPARK_VIEWER_URL`
- fallback HTML/error/loading states when no Spark page is configured yet

## Existing files adjusted

### Map styling cleanup
Updated:
- `src/styles/homeStyles.ts`

Changes:
- removed the `react-native-maps` type import
- removed the old grayscale Google-style map styling array
- preserved the rest of the UI shell styles for reuse with the new globe screen

### Globe map wiring
Added:
- `src/features/map/GlobeMap.tsx`

Updated:
- `App.tsx`

This now provides:
- a Mapbox globe-backed map tab inside the existing Explore shell
- campus POI and area rendering through the new GeoJSON adapters
- selected POI focus state with camera recentering
- live foreground location watch and a locate action
- globe projection enabled on the map surface
- a startup fly-in from a world view to IIT Kanpur Outreach Auditorium
- splat POI wiring from the map focus card into `SplatViewerScreen`
- the existing app shell and bottom nav without adding React Navigation

## Not finished yet

The main migration wiring is in place and type-check passes.

Still pending:
- run the new Mapbox screen in an iOS or Android dev client to verify native runtime behavior
- validate that globe projection and the startup fly-in feel correct on-device at native frame rate
- validate env var injection for:
  - `EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN`
  - `RNMAPBOX_DOWNLOADS_TOKEN` or `RNMAPBOX_MAPS_DOWNLOAD_TOKEN`
- replace the sample splat URL and optional Spark viewer URL with real project values
- decide whether a web-safe fallback is needed for the map tab

## Expected env vars

- `EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN`
- `RNMAPBOX_DOWNLOADS_TOKEN` or `RNMAPBOX_MAPS_DOWNLOAD_TOKEN`
- optional later: `EXPO_PUBLIC_SPARK_VIEWER_URL`

## Suggested next step

Resume by running the native app and validating:
- the map token and native SDK download token are both picked up
- the globe tab loads correctly in the Expo dev client
- POI selection, location recentering, and the splat overlay behave correctly on device
