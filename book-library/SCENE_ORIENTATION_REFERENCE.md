# 3D Scene Orientation Reference

## Coordinate System
- **+X**: Right
- **-X**: Left
- **+Y**: Up
- **-Y**: Down
- **+Z**: Forward (toward camera)
- **-Z**: Backward (away from camera)

## Camera Position
- Position: `(0, 5, 14)`
- Looking at: `(0, 0, 0)`
- The camera is positioned above and in front of the scene, looking toward the origin

## Shelf Configuration

### Shelf Position (First shelf, index 0)
- Position Y: `0`
- Shelf thickness: `0.45`
- Shelf top surface: `Y = 0.225` (0 + 0.45/2)
- Shelf dimensions: `8 (width) × 0.45 (thickness) × 4 (depth)`
- Shelf is centered at `Z = 0`

### Multiple Shelves
- Shelf spacing: `4.5` units vertically
- Shelf N position: `Y = -N × 4.5`

## Book Configuration (GLB Model)

### On Shelf (Closed State)

**Parent Mesh (Book3D.mesh):**
- Position X: Calculated based on shelf position (left to right)
- Position Y: `shelfTop + dimensions.height / 2`
  - Example: `0.225 + 2.0 = 2.225` (for 4-unit tall book)
- Position Z: `0` (centered on shelf)
- Rotation: `(0, 0, 0)` - NO parent rotation on shelf

**GLB Model (Book3D.gltfModel) - Child of parent mesh:**
- Position: `(0, 0, 0)` relative to parent
- Rotation: `(Math.PI/2, Math.PI/2, 0)` = `(90°, 90°, 0°)`
  - X rotation (+90°): Stands book upright (was lying flat)
  - Y rotation (+90°): Turns spine to face forward (+Z toward camera)
  - Z rotation (0°): No roll
- Rotation order: `'YXZ'` (Y first, then X, then Z)

**Visual result on shelf:**
- Spine (GREEN): Faces forward toward camera (+Z direction)
- Front Cover (RED): Faces right (+X direction)
- Back Cover (BLACK): Faces left (-X direction)
- Top edge (pages): Faces up (+Y direction)
- Bottom edge: Sits on shelf

### Pulled Out (Cover Showing)

**Parent Mesh:**
- Position: `(0, 2, 6)` - centered in front of camera
- Rotation: `(-Math.PI/9, -Math.PI/2, 0)` = `(-20°, -90°, 0°)`
  - X rotation (-20°): Tilts top toward viewer
  - Y rotation (-90°): Rotates book counter-clockwise to show cover
  - Z rotation (0°): No roll

**GLB Model:**
- Still has internal rotation: `(Math.PI/2, Math.PI/2, 0)`
- Combined with parent rotation

**Visual result when pulled out:**
- Front Cover (RED): Faces forward toward camera (+Z direction)
- Spine (GREEN): Now on left side
- Back Cover (BLACK): On right side (away from camera)
- Book is tilted slightly toward viewer

## GLB Model Internal Structure

### Blender Model Hierarchy
```
Scene (root)
├── Spine (Mesh) - GREEN colored
│   ├── Front Cover (child) - RED colored
│   └── Back Cover (child) - BLACK colored
├── Papers Practice (collection)
│   ├── Plane.073 (page) - HIDDEN initially
│   ├── Plane.074 (page) - HIDDEN initially
│   ├── ...
│   └── Plane.103 (page) - HIDDEN initially
└── Empty Controllers (Empty.073 - Empty.105)
    └── Control page bend/curl via Hook modifiers
```

### Animation
- Total duration: 9.208 seconds (135 frames at ~30fps)
- Target stop frame: 65 (at 2.167 seconds)
- Animation controls page flipping via Empty controllers
- Pages become visible when animation starts

## Important Notes

1. **Parent vs Child Rotation**: The book uses TWO rotation systems:
   - Parent mesh rotation (changes when book is pulled out)
   - GLB internal rotation (stays fixed at 90°, 90°, 0°)

2. **Book Positioning**: Books are positioned so their CENTER is at `shelfTop + height/2`, which makes the bottom touch the shelf top.

3. **Animation Orientation**: The animation was created in Blender with a specific orientation. After applying our rotations, the animation may play in an unexpected orientation relative to the camera.

4. **Pages Visibility**: Individual page meshes (Plane.073 - Plane.103) are hidden by default and shown only when the flip animation starts.

## Current Issue
When the book is pulled out and shows the red cover correctly, clicking it triggers the page flip animation. However, the animation orientation doesn't match the pulled-out book orientation, causing the pages to appear in the wrong direction.

**TODO**: The animation needs to be analyzed in its original Blender orientation to understand how to correctly apply it after our rotation transformations.
