import * as Location from 'expo-location';

import type { LiveLocation } from '../map/types';

export type ForegroundLocationAccess = {
  granted: boolean;
  canAskAgain: boolean;
  status: string;
  servicesEnabled: boolean;
};

const DEFAULT_MAX_LOCATION_AGE_MS = 60_000;

export const LOCATION_WATCH_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.Balanced,
  timeInterval: 4_000,
  distanceInterval: 5,
  mayShowUserSettingsDialog: true,
};

export async function requestForegroundLocationAccess(): Promise<ForegroundLocationAccess> {
  const permission = await Location.requestForegroundPermissionsAsync();
  const servicesEnabled = permission.granted
    ? await Location.hasServicesEnabledAsync()
    : false;

  return {
    granted: permission.granted,
    canAskAgain: permission.canAskAgain,
    status: permission.status,
    servicesEnabled,
  };
}

export function toLiveLocation(
  userId: string,
  location: Location.LocationObject,
): LiveLocation {
  return {
    userId,
    coordinate: {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    },
    heading:
      location.coords.heading === null ? undefined : location.coords.heading,
    accuracy:
      location.coords.accuracy === null ? undefined : location.coords.accuracy,
    speed: location.coords.speed === null ? undefined : location.coords.speed,
    timestamp: location.timestamp,
  };
}

export async function getLastKnownLiveLocation(
  userId: string,
): Promise<LiveLocation | null> {
  const location = await Location.getLastKnownPositionAsync({
    maxAge: DEFAULT_MAX_LOCATION_AGE_MS,
    requiredAccuracy: 120,
  });

  return location ? toLiveLocation(userId, location) : null;
}

export async function startLiveLocationWatch(
  userId: string,
  onUpdate: (location: LiveLocation) => void,
  onError?: (message: string) => void,
): Promise<Location.LocationSubscription> {
  return Location.watchPositionAsync(
    LOCATION_WATCH_OPTIONS,
    (location) => {
      onUpdate(toLiveLocation(userId, location));
    },
    onError,
  );
}
