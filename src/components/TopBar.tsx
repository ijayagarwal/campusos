import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Platform, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, neutral, radius, spacing } from '../theme';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 44) : 0;

type TopBarProps = {
  onMenuPress?: () => void;
};

export function TopBar({ onMenuPress }: TopBarProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>CampusOS</Text>

      <Pressable
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
      >
        <Ionicons name="ellipsis-vertical" size={18} color={colors.foreground} />
      </Pressable>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.menuBackdrop}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuDropdown}>
            <Pressable
              style={styles.menuItem}
              onPress={() => setMenuVisible(false)}
            >
              <Ionicons name="person-outline" size={18} color={colors.foreground} />
              <Text style={styles.menuItemText}>Profile</Text>
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable
              style={styles.menuItem}
              onPress={() => setMenuVisible(false)}
            >
              <Ionicons name="settings-outline" size={18} color={colors.foreground} />
              <Text style={styles.menuItemText}>Settings</Text>
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
    paddingTop: STATUS_BAR_HEIGHT + spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  logo: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.foreground,
    letterSpacing: -0.6,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: neutral[150],
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: STATUS_BAR_HEIGHT + 80,
    paddingRight: spacing.xl,
  },
  menuDropdown: {
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
    minWidth: 180,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuItemText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.foreground,
  },
  menuDivider: {
    height: 1,
    backgroundColor: neutral[200],
    marginHorizontal: spacing.md,
  },
});
