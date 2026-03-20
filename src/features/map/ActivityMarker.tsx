import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, neutral } from '../../theme';

type ActivityMarkerProps = {
  venue: string;
  eventCount: number;
  color: string;
  isLive: boolean;
  isSelected: boolean;
};

export function ActivityMarker({
  venue,
  eventCount,
  color,
  isLive,
  isSelected,
}: ActivityMarkerProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const shouldPulse = isLive || isSelected;
  const size = isSelected ? 44 : 36;
  const half = size / 2;

  useEffect(() => {
    if (shouldPulse) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 2,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [shouldPulse, pulseAnim]);

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [1, 2],
    outputRange: [0.35, 0],
  });

  return (
    <View style={styles.container}>
      {/* Pulse ring */}
      {shouldPulse && (
        <Animated.View
          style={[
            styles.pulseRing,
            {
              width: size,
              height: size,
              borderRadius: half,
              backgroundColor: color,
              opacity: pulseOpacity,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}

      {/* Main circle */}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: half,
            backgroundColor: color,
            opacity: isLive ? 0.9 : 0.55,
          },
        ]}
      >
        <Text style={styles.count}>{eventCount}</Text>
      </View>

      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={styles.label} numberOfLines={1}>
          {venue}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 100,
  },
  pulseRing: {
    position: 'absolute',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  count: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    color: '#ffffff',
  },
  labelContainer: {
    marginTop: 4,
    backgroundColor: 'rgba(250, 250, 250, 0.88)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    maxWidth: 100,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: 9,
    color: colors.foreground,
    textAlign: 'center',
  },
});
