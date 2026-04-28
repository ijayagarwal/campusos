import { useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, radius } from '../theme';

type Segment = { key: string; label: string };

type SegmentedControlProps = {
  segments: Segment[];
  activeKey: string;
  onSelect: (key: string) => void;
  compact?: boolean;
};

export function SegmentedControl({ segments, activeKey, onSelect, compact = false }: SegmentedControlProps) {
  const scaleAnims = useRef(segments.map(() => new Animated.Value(1))).current;

  function handlePress(key: string, index: number) {
    Animated.sequence([
      Animated.timing(scaleAnims[index], { toValue: 0.93, duration: 80, useNativeDriver: Platform.OS !== 'web' }),
      Animated.spring(scaleAnims[index], { toValue: 1, friction: 5, tension: 300, useNativeDriver: Platform.OS !== 'web' }),
    ]).start();
    onSelect(key);
  }

  return (
    <View style={[styles.track, compact && styles.trackCompact]}>
      {segments.map((segment, index) => {
        const isActive = segment.key === activeKey;
        return (
          <Animated.View
            key={segment.key}
            style={[styles.buttonWrapper, { transform: [{ scale: scaleAnims[index] }] }]}
          >
            <Pressable
              style={({ hovered }: any) => [
                styles.button,
                isActive && styles.buttonActive,
                !isActive && hovered && styles.buttonHovered,
              ]}
              onPress={() => handlePress(segment.key, index)}
            >
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {segment.label}
              </Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: 26,
    backgroundColor: colors.card,
    padding: 5,
  },
  trackCompact: {
    padding: 3,
  },
  buttonWrapper: {
    flex: 1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    borderRadius: radius.md,
    cursor: 'pointer',
  } as any,
  buttonHovered: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  buttonActive: {
    backgroundColor: colors.foreground,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.mutedForeground,
    userSelect: 'none',
  } as any,
  labelActive: {
    color: colors.inverseForeground,
  },
});
