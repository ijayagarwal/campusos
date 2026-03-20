/**
 * CampusOS Design Tokens
 *
 * Neutral base: shadcn zinc scale
 * Accent colors: shadcn theme colors (used sparingly for states, features, badges)
 * Typography: Sora font family
 */

// ── Neutral palette (zinc scale) ──────────────────────────────────────────────

export const neutral = {
  50: '#fafafa',
  100: '#f4f4f5',
  150: '#ececee',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
  950: '#09090b',
} as const;

// ── Semantic color aliases ────────────────────────────────────────────────────

export const colors = {
  background: neutral[50],
  card: neutral[100],
  cardHover: neutral[150],
  border: neutral[200],
  muted: neutral[400],
  mutedForeground: neutral[500],
  foreground: neutral[900],
  inverseForeground: neutral[50],
  inverseBackground: neutral[900],
} as const;

// ── Accent colors (shadcn theme values) ───────────────────────────────────────

export const accent = {
  blue: {
    DEFAULT: '#3b82f6',
    foreground: '#eff6ff',
    muted: '#dbeafe',
  },
  green: {
    DEFAULT: '#22c55e',
    foreground: '#f0fdf4',
    muted: '#dcfce7',
  },
  orange: {
    DEFAULT: '#f97316',
    foreground: '#fff7ed',
    muted: '#ffedd5',
  },
  red: {
    DEFAULT: '#ef4444',
    foreground: '#fef2f2',
    muted: '#fee2e2',
  },
  rose: {
    DEFAULT: '#f43f5e',
    foreground: '#fff1f2',
    muted: '#ffe4e6',
  },
  violet: {
    DEFAULT: '#8b5cf6',
    foreground: '#f5f3ff',
    muted: '#ede9fe',
  },
  yellow: {
    DEFAULT: '#eab308',
    foreground: '#fefce8',
    muted: '#fef9c3',
  },
} as const;

// ── Typography ────────────────────────────────────────────────────────────────

export const fontFamily = {
  regular: 'Sora_400Regular',
  semibold: 'Sora_600SemiBold',
  bold: 'Sora_700Bold',
} as const;

export const typography = {
  h1: { fontFamily: fontFamily.bold, fontSize: 28, letterSpacing: -1.2 },
  h2: { fontFamily: fontFamily.bold, fontSize: 24, letterSpacing: -0.8 },
  h3: { fontFamily: fontFamily.semibold, fontSize: 18 },
  body: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 22 },
  bodySmall: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 20 },
  label: { fontFamily: fontFamily.semibold, fontSize: 15 },
  caption: { fontFamily: fontFamily.regular, fontSize: 12 },
  eyebrow: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.9,
  },
  metric: { fontFamily: fontFamily.bold, fontSize: 26 },
  navLabel: { fontFamily: fontFamily.regular, fontSize: 11 },
} as const;

// ── Spacing ───────────────────────────────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
} as const;

// ── Border radius ─────────────────────────────────────────────────────────────

export const radius = {
  sm: 14,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
  full: 999,
} as const;
