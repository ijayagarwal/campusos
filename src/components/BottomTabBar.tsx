import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, neutral, spacing } from '../theme';

export type TabItem = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon?: keyof typeof Ionicons.glyphMap;
  branded?: boolean;
};

type BottomTabBarProps = {
  items: TabItem[];
  activeKey: string;
  onSelect: (key: string) => void;
};

export function BottomTabBar({
  items,
  activeKey,
  onSelect,
}: BottomTabBarProps) {
  const scaleAnims = useRef(
    items.map(() => new Animated.Value(1)),
  ).current;

  function handlePress(key: string, index: number) {
    // Quick bounce
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.85,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        friction: 5,
        tension: 350,
        useNativeDriver: true,
      }),
    ]).start();

    onSelect(key);
  }

  return (
    <View style={styles.bar}>
      {items.map((item, index) => {
        const isActive = item.key === activeKey;
        return (
          <Animated.View
            key={item.key}
            style={[
              styles.itemWrapper,
              { transform: [{ scale: scaleAnims[index] }] },
            ]}
          >
            <Pressable
              onPress={() => handlePress(item.key, index)}
              style={[styles.item, isActive && styles.itemActive]}
            >
              <Ionicons
                name={isActive ? (item.activeIcon ?? item.icon) : item.icon}
                size={22}
                color={isActive ? colors.foreground : colors.muted}
              />
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {item.label}
              </Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: neutral[200],
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  itemWrapper: {
    flex: 1,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },
  itemActive: {
    backgroundColor: neutral[150],
  },
  label: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.muted,
    marginTop: 4,
  },
  labelActive: {
    color: colors.foreground,
    fontFamily: fontFamily.semibold,
  },
});
