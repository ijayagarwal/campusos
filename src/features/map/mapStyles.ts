import { colors, neutral } from '../../theme';
import { CAMPUS_CENTER } from './mockData';
import type { MapAccent } from './types';

export const MAPTILER_API_KEY = (
  process.env.EXPO_PUBLIC_MAPTILER_API_KEY ?? ''
).trim();

// MapTiler Streets style — swap slug for any MapTiler style you like
export const mapStyleURL = MAPTILER_API_KEY
  ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`
  : 'https://demotiles.maplibre.org/style.json'; // free fallback (no token needed)

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

export const initialViewState = {
  longitude: CAMPUS_CENTER[0],
  latitude: CAMPUS_CENTER[1],
  zoom: 15.5,
  pitch: 45,
  bearing: 0,
};

export const campusCameraSettings = {
  centerCoordinate: CAMPUS_CENTER,
  zoom: 15.5,
  pitch: 45,
  bearing: 0,
};

export const buildingExtrusionLayerStyle = {
  'fill-extrusion-color': [
    'interpolate',
    ['linear'],
    ['coalesce', ['get', 'render_height'], 0],
    0, neutral[200],
    20, neutral[300],
    60, neutral[400],
  ],
  'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 0],
  'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
  'fill-extrusion-opacity': 0.75,
} as const;

export function getAccentColor(accent?: string): string {
  if (!accent) return accentPalette.ink;
  return accentPalette[accent as MapAccent] ?? accentPalette.ink;
}
