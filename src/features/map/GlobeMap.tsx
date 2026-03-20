import {
  Atmosphere,
  Camera,
  FillExtrusionLayer,
  MapView,
  MarkerView,
  type Camera as MapboxCameraRef,
} from '@rnmapbox/maps';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, neutral, radius } from '../../theme';
import {
  getLastKnownLiveLocation,
  requestForegroundLocationAccess,
  startLiveLocationWatch,
} from '../location/locationService';
import {
  CAMPUS_CENTER,
} from './mockData';
import {
  MAPBOX_PUBLIC_TOKEN,
  globeStyleURL,
  initialCameraSettings,
  campusCameraSettings,
  buildingExtrusionLayerStyle,
  globeAtmosphereStyle,
  startupFlightCameraStops,
} from './mapStyles';
import type { LiveLocation } from './types';

type GlobeMapProps = {
  onLocatePress?: () => void;
  onEventMarkerPress?: (eventId: string) => void;
};

const STARTUP_FLIGHT_LEAD_MS = 450;

export function GlobeMap({ onLocatePress, onEventMarkerPress }: GlobeMapProps) {
  const cameraRef = useRef<MapboxCameraRef>(null);
  const hasPlayedStartupFlightRef = useRef(false);
  const startupFlightTimeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [startupFlightStatus, setStartupFlightStatus] = useState<
    'idle' | 'queued' | 'running' | 'complete'
  >('idle');

  function clearStartupFlightTimers() {
    startupFlightTimeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    startupFlightTimeoutsRef.current = [];
  }

  function completeStartupFlight() {
    clearStartupFlightTimers();
    hasPlayedStartupFlightRef.current = true;
    setStartupFlightStatus('complete');
  }

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    let isMounted = true;
    let subscription: { remove: () => void } | null = null;

    async function prepareLocation() {
      try {
        const access = await requestForegroundLocationAccess();

        if (!isMounted) {
          return;
        }

        if (!access.granted || !access.servicesEnabled) {
          return;
        }

        const lastKnown = await getLastKnownLiveLocation('me');

        if (!isMounted) {
          return;
        }

        if (lastKnown) {
          setLiveLocation(lastKnown);
        }

        subscription = await startLiveLocationWatch(
          'me',
          (nextLocation) => {
            setLiveLocation(nextLocation);
          },
          () => {},
        );
      } catch {
        // Location not critical for map display
      }
    }

    void prepareLocation();

    return () => {
      isMounted = false;
      subscription?.remove();
      clearStartupFlightTimers();
    };
  }, []);

  function scheduleStartupTimeout(callback: () => void, delay: number) {
    const timeoutId = setTimeout(callback, delay);
    startupFlightTimeoutsRef.current.push(timeoutId);
  }

  function runStartupFlight() {
    if (!cameraRef.current) {
      scheduleStartupTimeout(runStartupFlight, 220);
      return;
    }

    const [regionalStop, campusStop] = startupFlightCameraStops;

    setStartupFlightStatus('running');
    cameraRef.current?.setCamera({
      centerCoordinate: regionalStop.centerCoordinate,
      zoomLevel: regionalStop.zoomLevel,
      pitch: regionalStop.pitch,
      heading: regionalStop.heading,
      animationMode: regionalStop.animationMode,
      animationDuration: regionalStop.animationDuration,
    });

    scheduleStartupTimeout(() => {
      cameraRef.current?.setCamera({
        centerCoordinate: campusStop.centerCoordinate,
        zoomLevel: campusStop.zoomLevel,
        pitch: campusStop.pitch,
        heading: campusStop.heading,
        animationMode: campusStop.animationMode,
        animationDuration: campusStop.animationDuration,
      });
    }, regionalStop.animationDuration - 120);

    scheduleStartupTimeout(() => {
      setStartupFlightStatus('complete');
    }, regionalStop.animationDuration + campusStop.animationDuration);
  }

  useEffect(() => {
    if (!isMapLoaded || hasPlayedStartupFlightRef.current) {
      return;
    }

    hasPlayedStartupFlightRef.current = true;
    setStartupFlightStatus('queued');

    scheduleStartupTimeout(runStartupFlight, STARTUP_FLIGHT_LEAD_MS);

    return () => {
      clearStartupFlightTimers();
    };
  }, [isMapLoaded]);

  function focusCamera(
    coordinate: [number, number],
    zoomLevel = campusCameraSettings.zoomLevel,
  ) {
    cameraRef.current?.setCamera({
      centerCoordinate: coordinate,
      zoomLevel,
      pitch: campusCameraSettings.pitch,
      heading: campusCameraSettings.heading,
      animationMode: 'flyTo',
      animationDuration: 900,
    });
  }

  function handleLocatePress() {
    completeStartupFlight();
    if (liveLocation) {
      focusCamera(
        [liveLocation.coordinate.longitude, liveLocation.coordinate.latitude],
        15.8,
      );
    } else {
      focusCamera(CAMPUS_CENTER, campusCameraSettings.zoomLevel);
    }
    onLocatePress?.();
  }

  if (!MAPBOX_PUBLIC_TOKEN) {
    return (
      <View style={localStyles.fallbackContainer}>
        <Text style={localStyles.fallbackTitle}>Mapbox token missing</Text>
        <Text style={localStyles.fallbackBody}>
          Set EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN before launching the dev client.
        </Text>
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

        {liveLocation ? (
          <MarkerView
            coordinate={[
              liveLocation.coordinate.longitude,
              liveLocation.coordinate.latitude,
            ]}
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
      </MapView>

      {!isMapLoaded ? (
        <View style={localStyles.loadingOverlay}>
          <ActivityIndicator color={colors.foreground} />
          <Text style={localStyles.loadingText}>Loading globe...</Text>
        </View>
      ) : null}

      {/* Locate button */}
      <Pressable style={localStyles.locateButton} onPress={handleLocatePress}>
        <Ionicons name="locate-outline" size={20} color={colors.foreground} />
      </Pressable>
    </View>
  );
}

const localStyles = StyleSheet.create({
  fallbackContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: colors.background,
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 10,
  },
  fallbackBody: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.mutedForeground,
    textAlign: 'center',
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
