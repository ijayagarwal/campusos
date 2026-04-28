import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { accent, colors, fontFamily, spacing } from '../../theme';

type FestBannerProps = {
  festName: string;
  onPress: () => void;
};

export function FestBanner({ festName, onPress }: FestBannerProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.6, duration: 1200, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Pressable
      style={({ hovered }: any) => [styles.container, hovered && styles.containerHovered]}
      onPress={onPress}
    >
      <View style={styles.dotWrapper}>
        <Animated.View style={[styles.dotPulse, { transform: [{ scale: pulseAnim }] }]} />
        <View style={styles.dot} />
      </View>
      <Text style={styles.label}>{festName}</Text>
      <Ionicons name="chevron-forward" size={14} color={colors.inverseForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.foreground,
    borderRadius: 18,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
    cursor: 'pointer',
  } as any,
  containerHovered: {
    backgroundColor: '#27272a',
  },
  dotWrapper: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotPulse: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 5,
    backgroundColor: accent.green.DEFAULT,
    opacity: 0.3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: accent.green.DEFAULT,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: colors.inverseForeground,
    letterSpacing: 0.2,
    userSelect: 'none',
  } as any,
});
