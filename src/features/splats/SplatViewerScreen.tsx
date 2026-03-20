import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, fontFamily, neutral, radius, spacing } from '../../theme';
import type { SplatScene } from './types';

const NativeWebView =
  Platform.OS === 'web'
    ? null
    : (require('react-native-webview').WebView as typeof import('react-native-webview').WebView);

type SplatViewerScreenProps = {
  scene: SplatScene;
  onClose: () => void;
};

function buildSparkViewerUri(scene: SplatScene): string | null {
  const viewerBaseUrl = (process.env.EXPO_PUBLIC_SPARK_VIEWER_URL ?? '').trim();

  if (!viewerBaseUrl) {
    return null;
  }

  const params = [
    ['sceneId', scene.id],
    ['title', scene.title],
    ['sourceUrl', scene.sourceUrl],
    ['sourceFormat', scene.sourceFormat],
  ];

  if (scene.initialCamera?.position) {
    params.push(['position', scene.initialCamera.position.join(',')]);
  }

  if (scene.initialCamera?.target) {
    params.push(['target', scene.initialCamera.target.join(',')]);
  }

  const query = params
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  const separator = viewerBaseUrl.includes('?') ? '&' : '?';

  return `${viewerBaseUrl}${separator}${query}`;
}

function buildFallbackHtml(scene: SplatScene): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        color-scheme: light;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      body {
        margin: 0;
        padding: 24px;
        background: ${colors.background};
        color: ${colors.foreground};
      }
      .card {
        max-width: 720px;
        margin: 0 auto;
        background: ${colors.card};
        border-radius: 24px;
        padding: 24px;
        box-sizing: border-box;
      }
      h1 {
        margin: 0 0 12px;
        font-size: 24px;
      }
      p {
        margin: 0 0 12px;
        line-height: 1.55;
      }
      code {
        display: block;
        padding: 12px;
        border-radius: 14px;
        background: ${colors.foreground};
        color: ${colors.inverseForeground};
        word-break: break-all;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${scene.title}</h1>
      <p>This screen is ready for a Spark-based splat viewer, but no viewer page is configured yet.</p>
      <p>Set <strong>EXPO_PUBLIC_SPARK_VIEWER_URL</strong> to a Spark page that accepts query params named <strong>sourceUrl</strong> and <strong>sourceFormat</strong>.</p>
      <code>${scene.sourceUrl}</code>
    </div>
  </body>
</html>`;
}

export function SplatViewerScreen({
  scene,
  onClose,
}: SplatViewerScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const viewerUri = buildSparkViewerUri(scene);
  const usingNativeWebView = Platform.OS !== 'web' && NativeWebView;

  return (
    <SafeAreaView style={localStyles.shell}>
      <View style={localStyles.header}>
        <Pressable style={localStyles.closeButton} onPress={onClose}>
          <Ionicons name="arrow-back-outline" size={20} color={colors.foreground} />
        </Pressable>
        <View style={localStyles.headerCopy}>
          <Text style={localStyles.title}>{scene.title}</Text>
          <Text style={localStyles.subtitle}>Spark-backed 3D scene container</Text>
        </View>
      </View>

      <View style={localStyles.viewerFrame}>
        {usingNativeWebView ? (
          <NativeWebView
            key={reloadKey}
            source={
              viewerUri
                ? { uri: viewerUri }
                : { html: buildFallbackHtml(scene), baseUrl: 'https://campus-os.local/' }
            }
            onLoadStart={() => {
              setIsLoading(true);
              setLoadError(null);
            }}
            onLoadEnd={() => {
              setIsLoading(false);
            }}
            onError={({ nativeEvent }) => {
              setIsLoading(false);
              setLoadError(nativeEvent.description || 'Viewer load failed.');
            }}
            originWhitelist={['*']}
            javaScriptEnabled
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            style={localStyles.webview}
          />
        ) : (
          <View style={localStyles.browserFallback}>
            <Text style={localStyles.browserFallbackTitle}>Native viewer unavailable</Text>
            <Text style={localStyles.browserFallbackText}>
              This Spark screen is only wired for iOS and Android dev builds.
            </Text>
          </View>
        )}

        {isLoading ? (
          <View style={localStyles.loadingOverlay}>
            <ActivityIndicator color={colors.foreground} />
            <Text style={localStyles.loadingText}>Loading scene container...</Text>
          </View>
        ) : null}

        {loadError ? (
          <View style={localStyles.errorCard}>
            <Text style={localStyles.errorTitle}>Scene failed to load</Text>
            <Text style={localStyles.errorText}>{loadError}</Text>
            <Pressable
              style={localStyles.retryButton}
              onPress={() => {
                setLoadError(null);
                setIsLoading(true);
                setReloadKey((current) => current + 1);
              }}
            >
              <Text style={localStyles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  shell: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 6,
    paddingTop: spacing.sm + 6,
    paddingBottom: spacing.lg,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  headerCopy: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  viewerFrame: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: radius['2xl'],
    backgroundColor: colors.foreground,
  },
  webview: {
    flex: 1,
    backgroundColor: colors.background,
  },
  browserFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: radius.xl,
    backgroundColor: colors.card,
  },
  browserFallbackTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 10,
  },
  browserFallbackText: {
    fontSize: 13,
    color: colors.mutedForeground,
    lineHeight: 20,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(250, 250, 250, 0.88)',
  },
  loadingText: {
    fontSize: 13,
    color: colors.foreground,
  },
  errorCard: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: 18,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 12,
    color: colors.mutedForeground,
    lineHeight: 18,
    marginBottom: spacing.sm + 6,
  },
  retryButton: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    backgroundColor: colors.foreground,
    paddingHorizontal: spacing.sm + 6,
    paddingVertical: 10,
  },
  retryButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.inverseForeground,
  },
});
