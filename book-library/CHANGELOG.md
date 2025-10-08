# Changelog

All notable changes to the Personal Book Library project.

---

## [2.0.0] - 2025-10-08 - Three.js Migration 🎉

### Major Changes
- **Migrated from CSS 3D transforms to Three.js WebGL rendering**
- Complete visual overhaul with realistic 3D graphics
- Improved performance and smoother animations

### Added
- ✨ Three.js WebGL renderer with antialiasing and shadows
- 🔥 HDRI environment lighting (Fireplace 4K)
- 🪵 Photorealistic wood textures on shelves
- 📚 Canvas-based text rendering for book spines
- 🖱️ OrbitControls for interactive camera movement
- 🎬 Smooth lerp-based animations for book interactions
- 📱 Book details overlay modal
- 🎨 5-light setup (ambient, directional, point, rim, hemisphere)
- ⚡ Raycasting for accurate click detection
- 📄 Comprehensive documentation (3 new docs)

### New Files
- `js/bookshelf3D.js` - Three.js scene manager (410 lines)
- `js/Book3D.js` - 3D book component class (186 lines)
- `MIGRATION_SUMMARY.md` - Technical documentation
- `THREE_JS_QUICKSTART.md` - User guide
- `CHANGELOG.md` - This file

### Modified Files
- `index.html` - Added Three.js import map and canvas container
- `js/bookLibrary.js` - Integrated Three.js rendering, commented out old DOM code
- `css/library.css` - Cleaned up from 620 to 195 lines
- `README.md` - Updated with Three.js features and usage

### Removed/Deprecated
- All CSS 3D transform code (`.bk-*` classes)
- Old DOM rendering methods (kept as comments)
- Unused CSS animations and transforms
- Old shelf rendering system

### Technical Details
- Three.js v0.169.0 (via CDN)
- ES6 modules for clean imports
- Custom animation system using requestAnimationFrame
- Shadow mapping with 2048x2048 resolution
- ACES Filmic tone mapping for realistic colors
- PBR materials (MeshStandardMaterial)

### Performance
- 60fps target rendering
- Async asset loading with progress
- Optimized raycasting (books only)
- Efficient animation updates (only active books)
- Hardware-accelerated WebGL rendering

### Browser Support
- Chrome/Edge: ✅ Excellent
- Firefox: ✅ Excellent
- Safari: ✅ Good
- Requires: ES6 modules, WebGL

---

## [1.0.0] - 2024-08-11 - Initial CSS 3D Version

### Features
- CSS 3D transform-based book rendering
- Manual shelf creation with `shelf.png` image
- Filter by genre (multi-select)
- Sort by title, author, genre
- LocalStorage for book persistence
- Admin panel for book management
- Responsive design

### Files
- `index.html` - Main page
- `js/bookLibrary.js` - Book data and DOM rendering
- `css/library.css` - CSS 3D styles (620 lines)
- `admin.html` - Book management interface
- 13 default books in 6 categories

---

## Migration Statistics

### Code Changes
- **Lines Added**: ~600 (Three.js implementation)
- **Lines Removed**: ~425 (CSS 3D code)
- **Net Change**: +175 lines (better code organization)
- **Files Added**: 5
- **Files Modified**: 4

### File Size Changes
- **CSS**: 620 lines → 195 lines (-68%)
- **JS**: +596 lines (new Three.js code)
- **Assets**: +34.2 MB (HDRI + textures)

### Performance Improvements
- 🚀 Hardware-accelerated WebGL rendering
- 🎬 Smoother animations (60fps vs CSS transitions)
- 🎨 Photorealistic lighting and shadows
- 📐 Accurate 3D positioning and depth

---

## Future Roadmap

### v2.1.0 (Planned)
- [ ] Book cover textures/images
- [ ] Hover glow effects
- [ ] Mobile performance optimization (compressed HDRI)
- [ ] Search functionality

### v2.2.0 (Planned)
- [ ] Page flipping animations
- [ ] Reading progress tracking
- [ ] Better text rendering (SDF fonts)

### v3.0.0 (Future)
- [ ] VR support (WebXR)
- [ ] Physics engine integration
- [ ] Post-processing effects
- [ ] React Three Fiber conversion

---

## Credits

- **Three.js**: https://threejs.org/
- **HDRI**: Poly Haven (https://polyhaven.com/)
- **Wood Textures**: CC0 Textures / Poly Haven
- **Original Design**: Custom CSS 3D implementation
- **Migration**: Completed 2025-10-08

---

**Note**: For rollback instructions, see [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)
