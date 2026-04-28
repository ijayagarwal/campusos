import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MapGL, {
  Layer,
  Marker,
  NavigationControl,
  type MapRef,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { colors } from '../../theme';
import type { TechKritiEvent } from '../../data/techkritiEvents';
import { groupEventsByVenue } from '../../data/eventHelpers';
import { CAMPUS_CENTER } from './mockData';
import { mapStyleURL, initialViewState, campusCameraSettings } from './mapStyles';
import { ActivityMarker } from './ActivityMarker';

export type GlobeMapHandle = {
  flyTo: (coordinate: [number, number], zoom?: number) => void;
};

type GlobeMapProps = {
  events?: TechKritiEvent[];
  selectedEventId?: string | null;
};

export const GlobeMap = forwardRef<GlobeMapHandle, GlobeMapProps>(
  function GlobeMap({ events = [], selectedEventId }, ref) {
    const mapRef = useRef<MapRef>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const venueGroups = events.length > 0 ? groupEventsByVenue(events) : [];
    const selectedEvent = selectedEventId ? events.find((e) => e.id === selectedEventId) : null;
    const selectedVenueId = selectedEvent?.venueId ?? null;

    useImperativeHandle(ref, () => ({
      flyTo(coordinate: [number, number], zoom = 17) {
        mapRef.current?.flyTo({
          center: coordinate,
          zoom,
          pitch: campusCameraSettings.pitch,
          duration: 1200,
        });
      },
    }));

    const handleLocate = useCallback(() => {
      mapRef.current?.flyTo({
        center: CAMPUS_CENTER,
        zoom: campusCameraSettings.zoom,
        pitch: campusCameraSettings.pitch,
        duration: 1000,
      });
    }, []);

    return (
      <View style={styles.container}>
        <MapGL
          ref={mapRef}
          mapStyle={mapStyleURL}
          initialViewState={initialViewState}
          style={{ width: '100%', height: '100%' }}
          onLoad={() => setIsLoaded(true)}
          attributionControl={false}
        >
          {/* 3-D buildings layer (works on MapTiler Streets-v2) */}
          {isLoaded && (
            <Layer
              id="3d-buildings"
              type="fill-extrusion"
              source="openmaptiles"
              source-layer="building"
              minzoom={14}
              paint={
                {
                  'fill-extrusion-color': '#d4d4d8',
                  'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 0],
                  'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
                  'fill-extrusion-opacity': 0.7,
                } as any
              }
            />
          )}

          {/* Navigation control (zoom +/-) */}
          <NavigationControl position="top-right" showCompass={false} />

          {/* Event venue markers */}
          {venueGroups.map((group) => (
            <Marker
              key={group.venueId}
              longitude={group.coordinate[0]}
              latitude={group.coordinate[1]}
              anchor="center"
            >
              <ActivityMarker
                venue={group.venue}
                eventCount={group.eventCount}
                color={group.primaryColor}
                isLive={group.hasLiveEvent}
                isSelected={group.venueId === selectedVenueId}
              />
            </Marker>
          ))}
        </MapGL>

        {/* Locate button */}
        <Pressable
          style={({ hovered }: any) => [localStyles.locateButton, hovered && localStyles.locateButtonHovered]}
          onPress={handleLocate}
        >
          <Ionicons name="locate-outline" size={20} color={colors.foreground} />
        </Pressable>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});

const localStyles = StyleSheet.create({
  locateButton: {
    position: 'absolute',
    right: 18,
    bottom: 80,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(250, 250, 250, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e4e4e7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    cursor: 'pointer',
  } as any,
  locateButtonHovered: {
    backgroundColor: '#f4f4f5',
  },
});
