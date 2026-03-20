import type * as GeoJSON from 'geojson';

export type MapFeatureKind = 'poi' | 'area' | 'route' | 'user' | 'splat-poi';
export type MapAccent = 'clay' | 'sand' | 'olive' | 'ink';
export type MapPoiIcon = 'home' | 'library' | 'sports' | 'custom';

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type MapPoi = {
  id: string;
  kind: 'poi' | 'splat-poi';
  title: string;
  subtitle?: string;
  coordinate: Coordinate;
  accent: MapAccent;
  icon: MapPoiIcon;
  splatSceneId?: string;
};

export type MapArea = {
  id: string;
  kind: 'area';
  title: string;
  geojson: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
  accent: MapAccent;
};

export type LiveLocation = {
  userId: string;
  coordinate: Coordinate;
  heading?: number;
  accuracy?: number;
  speed?: number;
  timestamp: number;
};

export type PoiFeatureProperties = Pick<
  MapPoi,
  'id' | 'kind' | 'title' | 'subtitle' | 'accent' | 'icon' | 'splatSceneId'
>;

export type AreaFeatureProperties = {
  id: string;
  kind: 'area';
  title: string;
  accent: MapAccent;
};
