# Starmap Objects Redesign

## Overview

Replace generic glowing dots with thematic celestial objects that match their content. Add constellation lines connecting all objects to a central hub (future Instagram link).

## Object Shapes & Animations

| Trip | Shape | Animation |
|------|-------|-----------|
| Moon | Crescent silhouette | Slow phase shift (shadow moves across) |
| Sun | Circle with radiating rays | Rays pulse outward gently |
| Milky Way Core | Dense cluster of small dots | Random twinkle/shimmer |
| Deep Sky (Andromeda) | Tilted spiral | Slow rotation (~30s per revolution) |
| Star Trails | Concentric arc segments | Arcs rotate around center |
| NGC 891 | Thin glowing edge-on disc | Subtle brightness pulse |

**Size hierarchy**: Larger objects for major trips, smaller for others (preserved from current system).

**Hover behavior**: Object brightens, animation speeds up slightly, scale increases to 1.1x.

## Constellation Connections

All objects connect to a central hub via faint lines, forming a personal star chart.

**Lines:**
- Thin: 1px, ~20% opacity white
- Slight glow effect
- Spoke pattern (each object connects directly to center)

**Central Hub:**
- Positioned near center (slightly offset for visual interest)
- 30-40% opacity at rest (subtle, not dominant)
- Subtle pulse animation
- Brightens to 80% on hover
- Later becomes Instagram portal/gateway

**Parallax behavior:**
- Lines move with objects during parallax
- Creates subtle stretching effect
- Lines redraw dynamically based on object positions

## Visual Hierarchy (z-index)

1. Background stars (distant, fast parallax)
2. Constellation lines
3. Trip objects (closer, slower parallax)
4. Central hub (same layer as objects)

## Technical Implementation

### Trip Objects
- SVG elements positioned over the canvas
- Each object is its own SVG with CSS animations
- Positioned absolutely with percentage-based coordinates
- Parallax applied via JS (InteractionManager)

### Constellation Lines
- Single SVG layer or Canvas overlay
- Redrawn each frame to follow object positions
- Simple `<line>` elements connecting each object to hub

### Existing Systems
- Background starfield canvas unchanged
- Black hole mode pulls trip objects into gravity simulation

## Interactions

### At Rest
- Starfield animates in background
- Trip objects float with subtle animations
- Faint constellation lines visible
- Satellite drifts across occasionally

### Mouse Move
- Parallax shifts all layers
- Constellation lines stretch/follow dynamically

### Object Hover
- Object brightens + scales (1.1x)
- Animation speeds up slightly
- Title fades in below
- Connected constellation line brightens

### Object Click
- Detail carousel fades in
- Background dims slightly

### Hub Hover
- Brightens from 30% to 80% opacity
- Label appears (Instagram icon or text)

### Hub Click
- Opens Instagram in new tab

## Assets Needed

SVGs or sprites for each object type:
- Spiral galaxy (for Andromeda) - separate arm paths preferred
- Crescent moon
- Sun with rays (rays as separate paths)
- Star cluster (group of dots)
- Edge-on galaxy (thin disc)
- Concentric arcs (for star trails)

## Future Enhancements

- Central hub as animated portal/wormhole
- More elaborate hover effects
- Sound design (subtle ambient tones)
