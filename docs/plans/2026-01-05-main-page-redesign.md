# Main Page Redesign

## Overview

Improve the ZittiHub main page with responsive mobile support, enhanced visual polish, and a layout toggle option.

## Goals

1. **Responsive Design** - Mobile-first approach with proper breakpoints
2. **Visual Polish** - Enhanced hover states with scale + glow effects
3. **Layout Toggle** - Option to switch between organic "constellation" and grid layouts

---

## Responsive Breakpoints & Layout

### Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | <768px | Single-column scrollable, 2-column icon grid |
| Tablet | 768-1023px | Similar to desktop, slightly condensed |
| Desktop | ≥1024px | Current organic scattered icons |

### Mobile Layout Flow (top to bottom)

1. **TopBar** - Fixed at top (logo + clock)
2. **Welcome Section** - Full width, centered, condensed padding
3. **Icons Section** - 2-column grid below welcome content, scrollable
4. **Contact Footer** - "Found a bug?" section at bottom

### Key Changes

- `WelcomePanel` loses absolute positioning on mobile, becomes normal document flow
- `DesktopIcons` switches from absolute scattered positions to CSS Grid on mobile
- Container changes from `h-screen overflow-hidden` to `min-h-screen overflow-auto` on mobile
- Use Tailwind responsive prefixes (`md:`, `lg:`) for layout switching

---

## Enhanced Hover States

### Desktop Icon Hover (Scale + Glow)

```
Default → Hover transition:
- Scale: 1.0 → 1.08
- Box shadow: none → 0 0 20px rgba(99, 102, 241, 0.4)
- Icon color: text-secondary → accent-primary
- Background: transparent → rgba(99, 102, 241, 0.1)
- Duration: 200ms ease-out
```

### Mobile Touch States

- On tap: Brief scale pulse (1.0 → 0.95 → 1.0)
- Active state background highlight
- No hover effects (touch devices)

### Icon Accessibility

- Minimum tap target: 48x48px on mobile
- Subtle border on mobile for better definition
- Labels slightly larger on mobile

### Tooltip Behavior

- Desktop: Keep centered tooltip on hover
- Mobile: No tooltip - labels visible directly under icons

---

## Layout Toggle (Profile Panel)

### Settings UI

Add "Desktop Layout" section in ProfilePanel with two options:
- **Constellation** (default) - Current organic scattered positions
- **Grid** - Icons in 2-column vertical grid on right side

### Grid Layout Positions

- 2×4 grid on right portion of screen
- ~120px vertical spacing, ~100px horizontal
- Positioned at approximately 75% and 90% from left
- Same staggered animation on load

### Persistence

- Store in `localStorage` as `zittihub-layout`
- Values: `'constellation'` | `'grid'`
- Default: `'constellation'`

### Scope

- Toggle only affects desktop view
- Mobile always uses responsive 2-column grid

---

## Implementation

### Files to Modify

| File | Changes |
|------|---------|
| `globals.css` | Add hover glow keyframe, mobile utilities |
| `DesktopIcons.tsx` | Responsive grid, layout prop, enhanced hover |
| `WelcomePanel.tsx` | Responsive positioning |
| `ProfilePanel.tsx` | Add layout toggle UI and localStorage |
| `page.tsx` | Read layout preference, pass to DesktopIcons |

### Implementation Order

1. Responsive mobile layout (biggest impact)
2. Enhanced hover states (quick win)
3. Layout toggle in Profile (additive feature)

### No Changes Needed

- `TopBar.tsx` - Already works at all sizes
- `Starfield.tsx` - Background adapts automatically
- `Modal.tsx` - Separate concern

### Testing

- Mobile Safari/Chrome (real device preferred)
- Tablet landscape/portrait
- Desktop with both layout modes
- Reduced motion preference respected
