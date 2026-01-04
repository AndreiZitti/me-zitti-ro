# ZittiOS v2 - Design Document

**Date:** 2026-01-04
**Status:** Approved

## Overview

Enhance ZittiOS with Mac-like polish: improved dock with magnification, centered hero text, background switcher, and refined top bar with menus.

## Features

### 1. Mac-like Dock

**Changes from v1:**
- Remove text labels, icon-only design
- Show app name as tooltip on hover
- Magnification effect: icons scale up as cursor approaches
- Bounce animation when clicking to launch
- Add Settings gear icon (6th icon)

**Technical approach:**
- CSS transforms for magnification based on mouse distance
- JavaScript to calculate distance from each icon to cursor
- CSS keyframe animation for bounce
- Tooltip positioned above icon on hover

### 2. Centered Hero

**Content:**
- Name: "ANDREI ZITTI"
- Tagline: "AI Engineer. Stargazer. Sailor."

**Styling:**
- Centered vertically and horizontally on desktop
- Subtle opacity (0.8-0.9) so starfield shows through
- Doesn't interfere with dock interaction
- Pointer-events: none (clicks pass through to desktop)

### 3. Settings Panel

**Access:** Click Settings gear icon in dock

**Layout:** Center modal (reuse existing modal system)

**Options:**
- Background picker with 2 presets:
  - Starfield (current, default)
  - Dark gradient or solid (TBD)
- Visual preview of each option
- Click to apply, persists in localStorage

### 4. Mac-like Top Bar

**Left side:**
- Small logo/icon (could be a star, or stylized "Z")
- "ZittiOS" text that opens dropdown menu:
  - About ZittiOS
  - Settings (opens same panel as dock icon)

**Right side:**
- Clock in monospace font (already exists)
- Thinner, more refined styling

**Styling:**
- Frosted glass blur effect
- Thinner height than current
- Subtle bottom border/shadow

## Visual Reference

```
┌─────────────────────────────────────────────────────┐
│ ⭐ ZittiOS ▾                              12:34    │  ← Thin frosted top bar
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│                   ANDREI ZITTI                      │  ← Centered hero
│            AI Engineer. Stargazer. Sailor.          │
│                                                     │
│                     ✦  ·    ·                       │  ← Starfield behind
│                ·         ✦       ·                  │
│                                                     │
│                                                     │
│            ┌───┬───┬───┬───┬───┬───┐              │
│            │ ◯ │ ◯ │ ◯ │ ◯ │ ◯ │ ⚙ │              │  ← Icon-only dock
│            └───┴───┴───┴───┴───┴───┘              │
│                    ▲ magnified                      │
└─────────────────────────────────────────────────────┘
```

## Implementation Notes

### Dock Magnification Algorithm
```javascript
// For each dock icon, calculate scale based on distance to cursor
const maxScale = 1.5;
const effectRadius = 150; // pixels

icons.forEach(icon => {
  const distance = getDistanceToCursor(icon, mouseX);
  const scale = distance < effectRadius
    ? 1 + (maxScale - 1) * (1 - distance / effectRadius)
    : 1;
  icon.style.transform = `scale(${scale})`;
});
```

### Background Persistence
- Store selected background in `localStorage.setItem('zittios-background', 'starfield')`
- On load, read and apply saved preference
- Default to starfield if not set

### Settings Panel
- Reuse modal overlay system from v1
- Create dedicated settings content (not iframe)
- Simple grid of background options with visual previews

## Future Considerations (v3+)
- More background options (gradients, images, dynamic)
- Desktop widgets
- Genie minimize effect
- Sound effects
- Multiple desktops/spaces
