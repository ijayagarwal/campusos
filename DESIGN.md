# CampusOS — Design System

All tokens are defined in `src/theme/tokens.ts` and re-exported from `src/theme/index.ts`.

Import in any component:
```typescript
import { colors, accent, neutral, fontFamily, typography, spacing, radius } from '../theme';
```

---

## Colors

### Neutral Palette (Zinc Scale)

The app UI chrome is neutral. Use these for backgrounds, text, borders, and surfaces.

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral[50]` | `#fafafa` | Page background |
| `neutral[100]` | `#f4f4f5` | Card / elevated surface |
| `neutral[150]` | `#ececee` | Hover / pressed state |
| `neutral[200]` | `#e4e4e7` | Borders, dividers, tab tracks |
| `neutral[300]` | `#d4d4d8` | Disabled text, pull handles |
| `neutral[400]` | `#a1a1aa` | Muted icons, inactive tabs |
| `neutral[500]` | `#71717a` | Secondary text, meta info |
| `neutral[600]` | `#52525b` | Body text |
| `neutral[700]` | `#3f3f46` | Strong secondary |
| `neutral[800]` | `#27272a` | Headings on light bg |
| `neutral[900]` | `#18181b` | Primary text, dark fills |
| `neutral[950]` | `#09090b` | Absolute black |

### Semantic Aliases

| Alias | Maps to | Usage |
|-------|---------|-------|
| `colors.background` | `neutral[50]` | Screen background |
| `colors.card` | `neutral[100]` | Card backgrounds |
| `colors.cardHover` | `neutral[150]` | Pressed card state |
| `colors.border` | `neutral[200]` | Borders, separators |
| `colors.muted` | `neutral[400]` | Inactive icons |
| `colors.mutedForeground` | `neutral[500]` | Secondary text |
| `colors.foreground` | `neutral[900]` | Primary text, dark UI |
| `colors.inverseForeground` | `neutral[50]` | Text on dark backgrounds |
| `colors.inverseBackground` | `neutral[900]` | Dark surfaces (hero cards) |

### Accent Colors (Use Sparingly)

Accents are for status indicators, category badges, event cards, and interactive highlights — never for app chrome.

Each accent has 3 variants:

| Variant | Purpose | Example |
|---------|---------|---------|
| `DEFAULT` | Primary color | Badge fill, accent strip, marker |
| `foreground` | Text on DEFAULT bg | Light readable text |
| `muted` | Light tint | Badge background, subtle highlight |

| Color | DEFAULT | Muted | Semantic Use |
|-------|---------|-------|-------------|
| **Blue** | `#3b82f6` | `#dbeafe` | Competitions, links |
| **Green** | `#22c55e` | `#dcfce7` | Live status, success, "In Planner" |
| **Orange** | `#f97316` | `#ffedd5` | Warnings, highlights |
| **Red** | `#ef4444` | `#fee2e2` | Errors, high occupancy |
| **Rose** | `#f43f5e` | `#ffe4e6` | Shows, cultural events |
| **Violet** | `#8b5cf6` | `#ede9fe` | Talks, AI features |
| **Yellow** | `#eab308` | `#fef9c3` | Ceremonies, cognitive load |

### Event Category Color Mapping

```typescript
Ceremony    → accent.yellow.DEFAULT
Competition → accent.blue.DEFAULT
Talk        → accent.violet.DEFAULT
Show        → accent.rose.DEFAULT
```

---

## Typography

Font family: **Sora** (Google Fonts) — 3 weights loaded:

| Weight | Token | Font Name |
|--------|-------|-----------|
| Regular (400) | `fontFamily.regular` | `Sora_400Regular` |
| Semi-bold (600) | `fontFamily.semibold` | `Sora_600SemiBold` |
| Bold (700) | `fontFamily.bold` | `Sora_700Bold` |

### Type Scale

Use `typography.*` spread in StyleSheet for consistent sizing:

```typescript
const styles = StyleSheet.create({
  heading: { ...typography.h2, color: colors.foreground },
});
```

| Token | Size | Weight | Letter Spacing | Use |
|-------|------|--------|----------------|-----|
| `typography.h1` | 28px | Bold | -1.2 | App title |
| `typography.h2` | 24px | Bold | -0.8 | Page headings |
| `typography.h3` | 18px | Semi-bold | — | Section titles |
| `typography.body` | 14px | Regular | — | Body text (22px line) |
| `typography.bodySmall` | 13px | Regular | — | Descriptions (20px line) |
| `typography.label` | 15px | Semi-bold | — | Button labels, mini titles |
| `typography.caption` | 12px | Regular | — | Meta text, timestamps |
| `typography.eyebrow` | 12px | Regular | 0.9 | Uppercase labels |
| `typography.metric` | 26px | Bold | — | Large stat numbers |
| `typography.navLabel` | 11px | Regular | — | Tab bar labels |

---

## Spacing

4px base scale. Use `spacing.*` for padding, margins, and gaps:

| Token | Value | Common Usage |
|-------|-------|-------------|
| `spacing.xs` | 4px | Tight gaps, icon margins |
| `spacing.sm` | 8px | Small padding, tab bar |
| `spacing.md` | 12px | Card gaps, list spacing |
| `spacing.lg` | 16px | Section padding |
| `spacing.xl` | 20px | Screen horizontal padding |
| `spacing['2xl']` | 24px | Large section gaps |
| `spacing['3xl']` | 32px | Hero section padding |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius.sm` | 14px | Small cards, dropdowns |
| `radius.md` | 20px | Buttons, segmented controls |
| `radius.lg` | 24px | Cards, event cards |
| `radius.xl` | 28px | Large cards |
| `radius['2xl']` | 32px | Hero cards, modals |
| `radius.full` | 999px | Pills, badges, chips |

---

## Component Patterns

### Cards

```typescript
{
  backgroundColor: colors.card,      // or '#ffffff' for elevated
  borderRadius: radius.lg,           // 24px
  padding: spacing.lg,               // 16px
}
```

For event cards with accent glow:
```typescript
{
  backgroundColor: '#ffffff',
  borderRadius: radius.lg,
  borderWidth: 1,
  borderColor: event.accentColor + '28',  // 16% opacity border
  shadowColor: event.accentColor,          // colored glow (iOS only)
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 12,
  elevation: 4,                            // Android depth
}
```

### Badges / Pills

```typescript
{
  borderRadius: radius.full,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  backgroundColor: accent.blue.muted,     // light tint
}
// Text:
{
  fontFamily: fontFamily.semibold,
  fontSize: 10,
  color: accent.blue.DEFAULT,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
}
```

### Category Badge (accent-tinted)

```typescript
// Container:
{ backgroundColor: event.accentColor + '15' }  // 8% opacity tint
// Text:
{ color: event.accentColor }
```

### Buttons

**Primary (dark):**
```typescript
{
  backgroundColor: colors.foreground,
  borderRadius: radius.full,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
}
// Text: { color: colors.inverseForeground }
```

**Ghost / icon button:**
```typescript
{
  width: 36, height: 36,
  borderRadius: 18,
  backgroundColor: neutral[150],
  alignItems: 'center',
  justifyContent: 'center',
}
```

### Top Bar

Solid section (not floating), with status bar padding:
```typescript
{
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: spacing.xl,
  paddingTop: STATUS_BAR_HEIGHT + spacing.sm,
  paddingBottom: spacing.md,
  backgroundColor: colors.background,
}
```

### Bottom Tab Bar

Solid section with top border:
```typescript
{
  flexDirection: 'row',
  backgroundColor: colors.background,
  borderTopWidth: 1,
  borderTopColor: neutral[200],
  paddingHorizontal: spacing.sm,
  paddingTop: spacing.sm,
  paddingBottom: spacing.sm,
}
```

### Bottom Sheet (Discovery Panel)

```typescript
{
  backgroundColor: 'rgba(250, 250, 250, 0.96)',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
}
// Pull handle:
{ width: 36, height: 4, borderRadius: 2, backgroundColor: neutral[300] }
```

### Mini Tab Group

```typescript
// Track:
{
  flexDirection: 'row',
  backgroundColor: neutral[200],
  borderRadius: 12,
  padding: 3,
}
// Active tab:
{ backgroundColor: colors.foreground }
// Active text:
{ color: colors.inverseForeground }
// Inactive text:
{ color: colors.mutedForeground }
```

---

## Map Markers

### Activity Marker

```
┌─────────────────┐
│   [Pulse ring]   │  ← Animated scale 1→2 (live/selected only)
│    ┌───────┐     │
│    │  3    │     │  ← Accent-colored circle with event count
│    └───────┘     │
│   venue label    │  ← Frosted label: rgba(250,250,250,0.88)
└─────────────────┘
```

- Live: opacity 0.9, pulse ring
- Upcoming: opacity 0.55, no pulse
- Selected: 44px (vs 36px default), always pulses

---

## Occupancy Indicators

| Level | Color | Label |
|-------|-------|-------|
| Low | `accent.green.DEFAULT` | "Low" |
| Medium | `accent.yellow.DEFAULT` | "Moderate" |
| High | `accent.red.DEFAULT` | "Busy" |

---

## Translucent Surfaces

For overlays on the map:
```typescript
backgroundColor: 'rgba(250, 250, 250, 0.96)'  // Nearly opaque white
backgroundColor: 'rgba(244, 244, 245, 0.92)'   // Slightly see-through
```

---

## Do's and Don'ts

**Do:**
- Use `colors.*` semantic aliases, not raw hex
- Use `typography.*` spread for text styles
- Use `spacing.*` for all padding/margin/gap
- Use accent colors only for meaningful UI states (live, category, status)
- Keep app chrome neutral (backgrounds, nav, cards)

**Don't:**
- Don't use shadows except on event cards (accent-colored glow only)
- Don't hardcode hex colors — use tokens
- Don't use warm earth tones (clay/sand/olive) — those are legacy map-only
- Don't add Tailwind or CSS-in-JS — use `StyleSheet.create()` with tokens
- Don't use ThemeProvider/Context — direct imports from `'../theme'`
