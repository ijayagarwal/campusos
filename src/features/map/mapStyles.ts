import Mapbox, {
  type AtmosphereLayerStyle,
  type CircleLayerStyle,
  type FillExtrusionLayerStyle,
  type FillLayerStyle,
  type LineLayerStyle,
  type SymbolLayerStyle,
} from '@rnmapbox/maps';

import { colors, neutral } from '../../theme';
import { CAMPUS_CENTER } from './mockData';
import type { MapAccent } from './types';

export const MAPBOX_PUBLIC_TOKEN = (
  process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN ?? ''
).trim();

if (MAPBOX_PUBLIC_TOKEN) {
  void Mapbox.setAccessToken(MAPBOX_PUBLIC_TOKEN);
}

export const globeStyleURL = Mapbox.StyleURL.Street;

export const accentPalette: Record<MapAccent, string> = {
  clay: '#d09a74',
  sand: '#dcc6a7',
  olive: '#a9b18a',
  ink: colors.foreground,
};

export const accentForegroundPalette: Record<MapAccent, string> = {
  clay: colors.foreground,
  sand: colors.foreground,
  olive: colors.foreground,
  ink: colors.inverseForeground,
};

export const initialCameraSettings = {
  centerCoordinate: [0, 20] as [number, number],
  zoomLevel: 0.9,
  pitch: 0,
  heading: 0,
};

export const campusCameraSettings = {
  centerCoordinate: CAMPUS_CENTER,
  zoomLevel: 16.2,
  pitch: 52,
  heading: 0,
};

export const startupFlightCameraStops = [
  {
    centerCoordinate: [78.9629, 22.5] as [number, number],
    zoomLevel: 3.8,
    pitch: 0,
    heading: 0,
    animationMode: 'flyTo' as const,
    animationDuration: 2600,
  },
  {
    centerCoordinate: CAMPUS_CENTER,
    zoomLevel: campusCameraSettings.zoomLevel,
    pitch: campusCameraSettings.pitch,
    heading: campusCameraSettings.heading,
    animationMode: 'flyTo' as const,
    animationDuration: 3400,
  },
] as const;

export const globeAtmosphereStyle: AtmosphereLayerStyle = {
  color: 'rgba(255, 255, 255, 0)',
  highColor: 'rgba(255, 255, 255, 0)',
  spaceColor: colors.background,
  horizonBlend: 0.01,
  range: [0.5, 10],
  starIntensity: 0,
};

export const buildingExtrusionLayerStyle: FillExtrusionLayerStyle = {
  fillExtrusionColor: [
    'interpolate',
    ['linear'],
    ['coalesce', ['get', 'height'], 0],
    0,
    neutral[200],
    20,
    neutral[300],
    60,
    neutral[400],
  ],
  fillExtrusionHeight: ['coalesce', ['get', 'height'], 0],
  fillExtrusionBase: ['coalesce', ['get', 'min_height'], 0],
  fillExtrusionOpacity: 0.82,
  fillExtrusionAmbientOcclusionIntensity: 0.32,
};

export const poiCircleLayerStyle: CircleLayerStyle = {
  circleColor: [
    'match',
    ['get', 'accent'],
    'clay',
    accentPalette.clay,
    'sand',
    accentPalette.sand,
    'olive',
    accentPalette.olive,
    accentPalette.ink,
  ],
  circleStrokeColor: colors.foreground,
  circleStrokeWidth: 1.8,
  circleRadius: [
    'case',
    ['==', ['get', 'kind'], 'splat-poi'],
    8,
    6.5,
  ],
  circleOpacity: 0.92,
};

export const selectedPoiCircleLayerStyle: CircleLayerStyle = {
  circleColor: colors.card,
  circleStrokeColor: colors.foreground,
  circleStrokeWidth: 3,
  circleRadius: 12,
  circleOpacity: 0.96,
};

export const poiLabelLayerStyle: SymbolLayerStyle = {
  textField: ['get', 'title'],
  textSize: 11,
  textColor: colors.foreground,
  textHaloColor: colors.card,
  textHaloWidth: 1.4,
  textOffset: [0, 1.5],
  textAllowOverlap: false,
  textOptional: true,
};

export const areaFillLayerStyle: FillLayerStyle = {
  fillColor: [
    'match',
    ['get', 'accent'],
    'clay',
    accentPalette.clay,
    'sand',
    accentPalette.sand,
    'olive',
    accentPalette.olive,
    accentPalette.ink,
  ],
  fillOpacity: 0.18,
};

export const selectedAreaFillLayerStyle: FillLayerStyle = {
  fillColor: colors.foreground,
  fillOpacity: 0.1,
};

export const areaLineLayerStyle: LineLayerStyle = {
  lineColor: colors.foreground,
  lineWidth: 1.4,
  lineOpacity: 0.7,
};

export const selectedAreaLineLayerStyle: LineLayerStyle = {
  lineColor: colors.foreground,
  lineWidth: 2.6,
  lineOpacity: 0.95,
};

export function getAccentColor(accent?: string): string {
  if (!accent) {
    return accentPalette.ink;
  }

  return accentPalette[accent as MapAccent] ?? accentPalette.ink;
}
