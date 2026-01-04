# ZittiOS Launcher - Design Document

**Date:** 2026-01-04
**Status:** Approved for v1

## Overview

Redesign zitti.ro as a minimal desktop OS launcher ("ZittiOS"). Visitors land on a desktop with an animated starfield, a dock of app icons, and branding. Clicking icons opens floating panels (internal apps) or navigates to subdomains (external apps).

## Design Decisions

| Decision | Choice |
|----------|--------|
| OS depth | Launcher only (expandable later) |
| App behavior | Center modal panels (floating cards) |
| Background | Animated starfield |
| Icon layout | Bottom dock (macOS-style) |
| Desktop chrome | Name/logo + clock |
| Mobile | Same concept adapted (dock as bottom nav, full-screen panels) |

## Visual Direction

- **Theme:** "Late Night Desktop"
- **Colors:** Dark mode, cool tones (blues, teals, purples)
- **Vibe:** Professional enough to trust, personal enough to remember
- **Icons:** Minimal line icons (clean, modern)

## Layout

```
Desktop (1440x900 example)
┌─────────────────────────────────────────┐
│  ANDREI ZITTI                    11:42  │
│                                         │
│            ✦  ·    ·                    │
│       ·         ✦       ·    ✦          │
│            ·        ·                   │
│     ✦   ·      ✦          ·             │
│              ·       ·         ✦        │
│         ·        ✦       ·              │
│                                         │
│  ┌─────┬─────┬─────┬─────┬─────┐       │
│  │ PRO │ STA │ LIB │ GAM │ TRA │       │
│  └─────┴─────┴─────┴─────┴─────┘       │
└─────────────────────────────────────────┘

Mobile (375x812 example)
┌───────────────┐
│ ANDREI  11:42 │
│               │
│   ✦  ·    ·   │
│      ✦    ·   │
│   ·     ✦     │
│               │
│ ┌─┬─┬─┬─┬─┐  │
│ │◯│◯│◯│◯│◯│  │
│ └─┴─┴─┴─┴─┘  │
└───────────────┘
```

## The 5 Apps

| App | Icon | Behavior | Destination |
|-----|------|----------|-------------|
| Projects | Terminal/code icon | External link | projects.zitti.ro |
| Stars | Star/constellation icon | Center modal | Internal page |
| Library | Book icon | Center modal | Internal page |
| Games | Dice/controller icon | External link | games.zitti.ro |
| Travel | Map/globe icon | External link | travelling.zitti.ro |

## Interactions

### Dock
- Icons scale up slightly on hover (macOS-style magnification optional)
- Click triggers either modal open or external navigation
- Subtle glow/highlight on active state

### Center Modal (Internal Apps)
- Fades/scales in from center
- Floats over desktop with visible starfield edges
- Close via X button, clicking outside, or Escape key
- Contains iframe or embedded content from existing pages

### External Links
- Open in same tab (or new tab - TBD)
- Brief visual feedback on click

## Technical Approach

### Structure
```
src/
├── index.html          # ZittiOS desktop
├── pages/
│   ├── home/
│   │   ├── css/
│   │   │   └── zittios.css
│   │   └── js/
│   │       ├── desktop.js      # Main orchestration
│   │       ├── starfield.js    # Background animation
│   │       ├── dock.js         # Dock interactions
│   │       └── modal.js        # Panel management
│   ├── star-map/       # Existing
│   └── book-library/   # Existing
```

### Key Components
1. **Starfield** - Canvas-based twinkling stars (can reuse/adapt existing tsParticles or write custom)
2. **Dock** - Flexbox container with icon buttons
3. **Modal** - Overlay with iframe or content injection
4. **Clock** - Simple JS updating every minute

## Mobile Adaptations

- Dock stays at bottom (smaller icons)
- Panels slide up full-screen instead of floating center
- Touch-friendly tap targets (44px minimum)
- Starfield simplified for performance

## Future Expansion (v2+)

- Draggable/resizable windows
- Menu bar with dropdowns
- "Boot" animation on first visit
- Desktop widgets
- Window minimize/maximize

## References

- https://macos-web.app - Clean macOS recreation
- https://dustinbrett.com - daedalOS
- https://os.ryo.lu - ryOS
