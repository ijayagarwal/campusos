import {
  Atmosphere,
  Camera,
  FillExtrusionLayer,
  MapView,
  MarkerView,
  type Camera as MapboxCameraRef,
} from '@rnmapbox/maps';
import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '../../theme';
import type { TechKritiEvent } from '../../data/techkritiEvents';
import { groupEventsByVenue, type VenueGroup } from '../../data/eventHelpers';
import {
  getLastKnownLiveLocation,
  requestForegroundLocationAccess,
  startLiveLocationWatch,
} from '../location/locationService';
import { CAMPUS_CENTER } from './mockData';
import {
  MAPBOX_PUBLIC_TOKEN,
  globeStyleURL,
  initialCameraSettings,
  campusCameraSettings,
  buildingExtrusionLayerStyle,
  globeAtmosphereStyle,
  startupFlightCameraStops,
} from './mapStyles';
import { ActivityMarker } from './ActivityMarker';
import type { LiveLocation } from './types';

export type GlobeMapHandle = {
  flyTo: (coordinate: [number, number], zoom?: number) => void;
};

type GlobeMapProps = {
  events?: TechKritiEvent[];
  selectedEventId?: string | null;
};

const STARTUP_FLIGHT_LEAD_MS = 450;

export const GlobeMap = forwardRef<GlobeMapHandle, GlobeMapProps>(
  function GlobeMap({ events = [], selectedEventId }, ref) {
    const cameraRef = useRef<MapboxCameraRef>(null);
    const hasPlayedStartupFlightRef = useRef(false);
    const startupFlightTimeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
    const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [startupFlightStatus, setStartupFlightStatus] = useState<
      'idle' | 'queued' | 'running' | 'complete'
    >('idle');

    // Group events by venue for markers
    const venueGroups = events.length > 0 ? groupEventsByVenue(events) : [];

    // Find the venue of the selected event
    const selectedEvent = selectedEventId
      ? events.find((e) => e.id === selectedEventId)
      : null;
    const selectedVenueId = selectedEvent?.venueId ?? null;

    useImperativeHandle(ref, () => ({
      flyTo(coordinate: [number, number], zoom = 17) {
        completeStartupFlight();
        focusCamera(coordinate, zoom);
      },
    }));

    function clearStartupFlightTimers() {
      startupFlightTimeoutsRef.current.forEach((id) => clearTimeout(id));
      startupFlightTimeoutsRef.current = [];
    }

    function completeStartupFlight() {
      clearStartupFlightTimers();
      hasPlayedStartupFlightRef.current = true;
      setStartupFlightStatus('complete');
    }

    useEffect(() => {
      if (Platform.OS === 'web') return;

      let isMounted = true;
      let subscription: { remove: () => void } | null = null;

      async function prepareLocation() {
        try {
          const access = await requestForegroundLocationAccess();
          if (!isMounted || !access.granted || !access.servicesEnabled) return;

          const lastKnown = await getLastKnownLiveLocation('me');
          if (!isMounted) return;
          if (lastKnown) setLiveLocation(lastKnown);

          subscription = await startLiveLocationWatch(
            'me',
            (next) => setLiveLocation(next),
            () => {},
          );
        } catch {
          // Location not critical
        }
      }

      void prepareLocation();
      return () => {
        isMounted = false;
        subscription?.remove();
        clearStartupFlightTimers();
      };
    }, []);

    function scheduleTimeout(cb: () => void, delay: number) {
      const id = setTimeout(cb, delay);
      startupFlightTimeoutsRef.current.push(id);
    }

    function runStartupFlight() {
      if (!cameraRef.current) {
        scheduleTimeout(runStartupFlight, 220);
        return;
      }
      const [regional, campus] = startupFlightCameraStops;
      setStartupFlightStatus('running');
      cameraRef.current.setCamera({
        centerCoordinate: regional.centerCoordinate,
        zoomLevel: regional.zoomLevel,
        pitch: regional.pitch,
        heading: regional.heading,
        animationMode: regional.animationMode,
        animationDuration: regional.animationDuration,
      });
      scheduleTimeout(() => {
        cameraRef.current?.setCamera({
          centerCoordinate: campus.centerCoordinate,
          zoomLevel: campus.zoomLevel,
          pitch: campus.pitch,
          heading: campus.heading,
          animationMode: campus.animationMode,
          animationDuration: campus.animationDuration,
        });
      }, regional.animationDuration - 120);
      scheduleTimeout(() => {
        setStartupFlightStatus('complete');
      }, regional.animationDuration + campus.animationDuration);
    }

    useEffect(() => {
      if (!isMapLoaded || hasPlayedStartupFlightRef.current) return;
      hasPlayedStartupFlightRef.current = true;
      setStartupFlightStatus('queued');
      scheduleTimeout(runStartupFlight, STARTUP_FLIGHT_LEAD_MS);
      return () => clearStartupFlightTimers();
    }, [isMapLoaded]);

    function focusCamera(coordinate: [number, number], zoomLevel = campusCameraSettings.zoomLevel) {
      cameraRef.current?.setCamera({
        centerCoordinate: coordinate,
        zoomLevel,
        pitch: campusCameraSettings.pitch,
        heading: campusCameraSettings.heading,
        animationMode: 'flyTo',
        animationDuration: 1200,
      });
    }

    function handleLocatePress() {
      completeStartupFlight();
      if (liveLocation) {
        focusCamera([liveLocation.coordinate.longitude, liveLocation.coordinate.latitude], 15.8);
      } else {
        focusCamera(CAMPUS_CENTER, campusCameraSettings.zoomLevel);
      }
    }

    if (!MAPBOX_PUBLIC_TOKEN) {
      return (
        <View style={localStyles.fallbackContainer}>
          <View style={localStyles.fallbackIcon}>
            <Text style={{ fontSize: 28 }}>🗺️</Text>
          </View>
          <Text style={localStyles.fallbackTitle}>Map unavailable</Text>
          <Text style={localStyles.fallbackBody}>
            Add your Mapbox token to <Text style={{ fontWeight: '700' }}>.env</Text> to enable the interactive campus map.
          </Text>
          <View style={localStyles.fallbackCode}>
            <Text style={localStyles.fallbackCodeText}>EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN=pk.…</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={StyleSheet.absoluteFill}>
        <MapView
          style={StyleSheet.absoluteFill}
          styleURL={globeStyleURL}
          projection="globe"
          compassEnabled={false}
          scaleBarEnabled={false}
          rotateEnabled
          pitchEnabled
          logoEnabled
          attributionEnabled
          logoPosition={{ left: 18, bottom: 18 }}
          attributionPosition={{ right: 18, bottom: 18 }}
          onDidFinishLoadingMap={() => setIsMapLoaded(true)}
          onDidFinishLoadingStyle={() => setIsMapLoaded(true)}
        >
          <Atmosphere style={globeAtmosphereStyle} />
          <Camera
            ref={cameraRef}
            defaultSettings={initialCameraSettings}
            minZoomLevel={0}
            maxZoomLevel={20}
          />
          <FillExtrusionLayer
            id="iitk-buildings-3d"
            sourceID="composite"
            sourceLayerID="building"
            filter={['==', ['get', 'extrude'], 'true']}
            minZoomLevel={15}
            maxZoomLevel={22}
            style={buildingExtrusionLayerStyle}
          />

          {/* User location puck */}
          {liveLocation ? (
            <MarkerView
              coordinate={[liveLocation.coordinate.longitude, liveLocation.coordinate.latitude]}
              anchor={{ x: 0.5, y: 0.5 }}
              allowOverlap
              allowOverlapWithPuck
              isSelected={false}
            >
              <View style={localStyles.userPuckOuter}>
                <View style={localStyles.userPuckInner} />
              </View>
            </MarkerView>
          ) : null}

          {/* Activity zone markers — one per venue */}
          {venueGroups.map((group) => (
            <MarkerView
              key={group.venueId}
              coordinate={group.coordinate}
              anchor={{ x: 0.5, y: 0.5 }}
              allowOverlap
              allowOverlapWithPuck
              isSelected={false}
            >
              <ActivityMarker
                venue={group.venue}
                eventCount={group.eventCount}
                color={group.primaryColor}
                isLive={group.hasLiveEvent}
                isSelected={group.venueId === selectedVenueId}
              />
            </MarkerView>
          ))}
        </MapView>

        {!isMapLoaded ? (
          <View style={localStyles.loadingOverlay}>
            <ActivityIndicator color={colors.foreground} />
            <Text style={localStyles.loadingText}>Loading globe...</Text>
          </View>
        ) : null}

        <Pressable style={localStyles.locateButton} onPress={handleLocatePress}>
          <Ionicons name="locate-outline" size={20} color={colors.foreground} />
        </Pressable>
      </View>
    );
  },
);

const localStyles = StyleSheet.create({
  fallbackContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
    backgroundColor: '#f0f4f8',
  },
  fallbackIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  fallbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
  },
  fallbackBody: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  fallbackCode: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 4,
  },
  fallbackCodeText: {
    fontSize: 11,
    color: '#94a3b8',
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(250, 250, 250, 0.28)',
  },
  loadingText: {
    fontSize: 12,
    color: colors.foreground,
  },
  userPuckOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(24, 24, 27, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPuckInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.foreground,
    borderWidth: 2,
    borderColor: colors.card,
  },
  locateButton: {
    position: 'absolute',
    right: 18,
    bottom: 200,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(244, 244, 245, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
