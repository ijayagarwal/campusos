import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

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

export function BottomTabBar({ items, activeKey, onSelect }: BottomTabBarProps) {
  const scaleAnims = useRef(items.map(() => new Animated.Value(1))).current;

  function handlePress(key: string, index: number) {
    Animated.sequence([
      Animated.timing(scaleAnims[index], { toValue: 0.82, duration: 70, useNativeDriver: Platform.OS !== 'web' }),
      Animated.spring(scaleAnims[index], { toValue: 1, friction: 4, tension: 400, useNativeDriver: Platform.OS !== 'web' }),
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
            style={[styles.itemWrapper, { transform: [{ scale: scaleAnims[index] }] }]}
          >
            <Pressable
              onPress={() => handlePress(item.key, index)}
              style={({ hovered }: any) => [
                styles.item,
                isActive && styles.itemActive,
                !isActive && hovered && styles.itemHovered,
              ]}
            >
              <View style={styles.iconWrap}>
                {isActive && <View style={styles.activeIndicator} />}
                <Ionicons
                  name={isActive ? (item.activeIcon ?? item.icon) : item.icon}
                  size={22}
                  color={isActive ? colors.foreground : neutral[400]}
                />
              </View>
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
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'web' ? spacing.md : spacing.sm,
  },
  itemWrapper: {
    flex: 1,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    borderRadius: 14,
    gap: 3,
    cursor: 'pointer',
  } as any,
  itemActive: {},
  itemHovered: {
    backgroundColor: neutral[100],
  },
  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 28,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.foreground,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    color: neutral[400],
    marginTop: 1,
    userSelect: 'none',
  } as any,
  labelActive: {
    color: colors.foreground,
  },
});
