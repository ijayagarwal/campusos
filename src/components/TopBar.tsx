import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Platform, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, neutral, radius, spacing } from '../theme';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 44) : 0;

type TopBarProps = {
  onMenuPress?: () => void;
};

export function TopBar({ onMenuPress: _onMenuPress }: TopBarProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.logoGroup}>
        <View style={styles.logoMark}>
          <Ionicons name="planet-outline" size={16} color={colors.inverseForeground} />
        </View>
        <Text style={styles.logo}>CampusOS</Text>
      </View>

      <View style={styles.actions}>
        <View style={styles.liveChip}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>TechKriti 2026</Text>
        </View>
        <Pressable
          style={({ hovered }: any) => [styles.menuButton, hovered && styles.menuButtonHovered]}
          onPress={() => setMenuVisible(true)}
        >
          <Ionicons name="person-circle-outline" size={22} color={colors.foreground} />
        </Pressable>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuDropdown}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuHeaderName}>Guest User</Text>
              <Text style={styles.menuHeaderSub}>IIT Kanpur</Text>
            </View>
            <View style={styles.menuDivider} />
            {[
              { icon: 'person-outline' as const, label: 'Profile', color: colors.foreground },
              { icon: 'settings-outline' as const, label: 'Settings', color: colors.foreground },
            ].map((item) => (
              <Pressable
                key={item.label}
                style={({ hovered }: any) => [styles.menuItem, hovered && styles.menuItemHovered]}
                onPress={() => setMenuVisible(false)}
              >
                <Ionicons name={item.icon} size={16} color={item.color} />
                <Text style={[styles.menuItemText, { color: item.color }]}>{item.label}</Text>
              </Pressable>
            ))}
            <View style={styles.menuDivider} />
            <Pressable
              style={({ hovered }: any) => [styles.menuItem, hovered && styles.menuItemHovered]}
              onPress={() => setMenuVisible(false)}
            >
              <Ionicons name="log-out-outline" size={16} color="#ef4444" />
              <Text style={[styles.menuItemText, { color: '#ef4444' }]}>Sign out</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: STATUS_BAR_HEIGHT + spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: neutral[200],
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoMark: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.foreground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.foreground,
    letterSpacing: -0.5,
    userSelect: 'none',
  } as any,
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: neutral[100],
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: neutral[200],
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  liveText: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    color: colors.foreground,
    userSelect: 'none',
  } as any,
  menuButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: neutral[150],
    cursor: 'pointer',
  } as any,
  menuButtonHovered: {
    backgroundColor: neutral[200],
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: STATUS_BAR_HEIGHT + 68,
    paddingRight: spacing.xl,
  },
  menuDropdown: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    minWidth: 200,
    borderWidth: 1,
    borderColor: neutral[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    overflow: 'hidden',
  },
  menuHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuHeaderName: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.foreground,
  },
  menuHeaderSub: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    cursor: 'pointer',
  } as any,
  menuItemHovered: {
    backgroundColor: neutral[100],
  },
  menuItemText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.foreground,
    userSelect: 'none',
  } as any,
  menuDivider: {
    height: 1,
    backgroundColor: neutral[200],
  },
});
