import { useEffect, useRef } from 'react';
import { Animated, LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';

import { colors, fontFamily, radius } from '../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Segment = { key: string; label: string };

type SegmentedControlProps = {
  segments: Segment[];
  activeKey: string;
  onSelect: (key: string) => void;
  compact?: boolean;
};

export function SegmentedControl({
  segments,
  activeKey,
  onSelect,
  compact = false,
}: SegmentedControlProps) {
  const scaleAnims = useRef(
    segments.map(() => new Animated.Value(1)),
  ).current;

  function handlePress(key: string, index: number) {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'),
    );

    // Bounce animation on the pressed pill
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.93,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        friction: 5,
        tension: 300,
        useNativeDriver: true,
      }),
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
            style={[
              styles.buttonWrapper,
              { transform: [{ scale: scaleAnims[index] }] },
            ]}
          >
            <Pressable
              style={[styles.button, isActive && styles.buttonActive]}
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
    height: 36,
    borderRadius: radius.md,
  },
  buttonActive: {
    backgroundColor: colors.foreground,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.mutedForeground,
  },
  labelActive: {
    color: colors.inverseForeground,
  },
});
