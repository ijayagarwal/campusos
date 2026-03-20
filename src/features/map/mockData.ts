import type * as GeoJSON from 'geojson';

import type {
  AreaFeatureProperties,
  MapArea,
  MapPoi,
  PoiFeatureProperties,
} from './types';

export const CAMPUS_CENTER: [number, number] = [80.23458, 26.50911];
export const DEFAULT_SELECTED_POI_ID = 'outreach-auditorium';

export const mapPois: MapPoi[] = [
  {
    id: 'outreach-auditorium',
    kind: 'splat-poi',
    title: 'Outreach Auditorium',
    subtitle: 'You are here',
    coordinate: { latitude: 26.50911, longitude: 80.23458 },
    accent: 'clay',
    icon: 'library',
    splatSceneId: 'outreach-auditorium-splat',
  },
  {
    id: 'kelkar-library',
    kind: 'poi',
    title: 'P K Kelkar Library',
    subtitle: '4 min',
    coordinate: { latitude: 26.5099, longitude: 80.2346 },
    accent: 'sand',
    icon: 'library',
  },
  {
    id: 'sports-hub',
    kind: 'poi',
    title: 'Sports Complex',
    subtitle: '6 min',
    coordinate: { latitude: 26.50872, longitude: 80.2338 },
    accent: 'olive',
    icon: 'sports',
  },
  {
    id: 'visitor-hostel',
    kind: 'poi',
    title: 'Visitor Hostel',
    subtitle: '3 min',
    coordinate: { latitude: 26.50888, longitude: 80.23512 },
    accent: 'ink',
    icon: 'custom',
  },
];

export const mapAreas: MapArea[] = [
  {
    id: 'central-spine',
    kind: 'area',
    title: 'Central Spine',
    accent: 'sand',
    geojson: {
      type: 'Feature',
      properties: {
        id: 'central-spine',
        kind: 'area',
        title: 'Central Spine',
        accent: 'sand',
      } satisfies AreaFeatureProperties,
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.2337, 26.50995],
            [80.2351, 26.50995],
            [80.2352, 26.50895],
            [80.2338, 26.5089],
            [80.2337, 26.50995],
          ],
        ],
      },
    },
  },
  {
    id: 'south-court',
    kind: 'area',
    title: 'South Court',
    accent: 'clay',
    geojson: {
      type: 'Feature',
      properties: {
        id: 'south-court',
        kind: 'area',
        title: 'South Court',
        accent: 'clay',
      } satisfies AreaFeatureProperties,
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.2341, 26.5094],
            [80.23515, 26.5094],
            [80.2352, 26.50855],
            [80.23415, 26.5085],
            [80.2341, 26.5094],
          ],
        ],
      },
    },
  },
];

export function toPoiFeatureCollection(
  pois: MapPoi[],
): GeoJSON.FeatureCollection<GeoJSON.Point, PoiFeatureProperties> {
  return {
    type: 'FeatureCollection',
    features: pois.map((poi) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [poi.coordinate.longitude, poi.coordinate.latitude],
      },
      properties: {
        id: poi.id,
        kind: poi.kind,
        title: poi.title,
        subtitle: poi.subtitle,
        accent: poi.accent,
        icon: poi.icon,
        splatSceneId: poi.splatSceneId,
      },
    })),
  };
}

export function toAreaFeatureCollection(
  areas: MapArea[],
): GeoJSON.FeatureCollection<
  GeoJSON.Polygon | GeoJSON.MultiPolygon,
  AreaFeatureProperties
> {
  return {
    type: 'FeatureCollection',
    features: areas.map((area) => ({
      ...area.geojson,
      properties: {
        id: area.id,
        kind: 'area',
        title: area.title,
        accent: area.accent,
      },
    })),
  };
}
