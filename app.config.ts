import type { ExpoConfig } from 'expo/config';

const downloadsToken =
  process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN?.trim() ||
  process.env.RNMAPBOX_DOWNLOADS_TOKEN?.trim();

if (downloadsToken && !process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN) {
  process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN = downloadsToken;
}

const config: ExpoConfig = {
  name: 'CampusOS',
  slug: 'campus-os',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.anonymous.campusos',
  },
  android: {
    package: 'com.anonymous.campusos',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
    output: 'single',
    name: 'CampusOS',
    shortName: 'CampusOS',
    description: 'Campus event discovery and navigation app',
    themeColor: '#ffffff',
    backgroundColor: '#ffffff',
  },
  plugins: [
    'expo-font',
    [
      '@rnmapbox/maps',
      {
        RNMapboxMapsVersion: '11.16.2',
      },
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Allow CampusOS to show your current location on the globe.',
        isIosBackgroundLocationEnabled: false,
        isAndroidBackgroundLocationEnabled: false,
        isAndroidForegroundServiceEnabled: false,
      },
    ],
  ],
  extra: {
    mapboxPublicToken:
      process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN?.trim() ?? '',
  },
};

export default config;
