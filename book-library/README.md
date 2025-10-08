# Personal Book Library - Three.js 3D Showcase

A beautiful, interactive 3D book library powered by **Three.js WebGL** rendering, featuring realistic lighting, photorealistic wooden shelves, and smooth animations.

> **🎉 Newly Migrated to Three.js!** This project has been upgraded from CSS 3D transforms to WebGL-based rendering for enhanced visual quality and interactivity.

## ✨ Features

- **🎨 WebGL 3D Rendering**: Books displayed with Three.js for photorealistic graphics
- **🔥 HDRI Environment**: Warm fireplace environment lighting
- **🪵 Realistic Textures**: 4K wood textures on shelves
- **📚 Dynamic Books**: Random sizes, category-based colors, canvas-based spine text
- **🖱️ Interactive Controls**: Orbit camera, zoom, click to open books
- **🔍 Filtering & Sorting**: Filter by genre, sort by title/author/genre
- **💾 LocalStorage**: Persistent book data with admin panel
- **📱 Responsive Design**: Optimized for desktop (mobile support with performance adjustments)

## Current Collection

### Science & Physics Shelf

- **Brief Answers to the Big Questions** by Stephen Hawking (9/10)
- **The Universe in a Nutshell** by Stephen Hawking (8/10)
- **A Brief History of Time** by Stephen Hawking (10/10)

### Fiction & Literature Shelf

- **IT** by Stephen King (9/10)
- **The Stand** by Stephen King (9/10)
- **Pet Sematary** by Stephen King (8/10)
- **1984** by George Orwell (10/10)

## 📁 File Structure

```
book-library/
├── index.html              # Main page (Three.js integrated)
├── admin.html             # Book management interface
│
├── js/
│   ├── bookLibrary.js     # Data management & logic
│   ├── bookshelf3D.js     # Three.js scene manager (NEW)
│   ├── Book3D.js          # 3D book component (NEW)
│   └── admin.js           # Admin panel logic
│
├── css/
│   ├── library.css        # UI styles (cleaned up)
│   ├── default.css        # Base styles
│   └── admin.css          # Admin panel styles
│
├── assets/
│   ├── Fireplace 4K.hdr           # HDRI environment
│   └── Dark Wood Texture/
│       └── textures/
│           └── dark_wood_diff_4k.jpg  # Wood texture
│
├── MIGRATION_SUMMARY.md       # Detailed migration docs
├── THREE_JS_QUICKSTART.md     # Quick start guide
└── README.md                  # This file
```

## 🚀 Quick Start

### 1. Start Local Server
```bash
cd book-library
python3 -m http.server 8000
```

### 2. Open in Browser
Navigate to: `http://localhost:8000`

### 3. Interact with Books
- **Rotate View**: Click and drag
- **Zoom**: Scroll wheel
- **Open Book**: Click on any book
- **Filter**: Use genre dropdown
- **Sort**: Click sort buttons

## 📖 Managing Books

### Adding Books
1. Go to `http://localhost:8000/admin.html`
2. Fill in book details (title, author, genre, etc.)
3. Click "Add Book"
4. Books are saved to localStorage automatically

### Editing/Deleting Books
- Use the admin panel to edit or remove existing books
- Changes sync immediately to the 3D view

## 🎨 Customization

### Changing Book Colors
Edit `js/Book3D.js` → `getCategoryColor()`:
```javascript
const categoryColors = {
  'ai': 0x4a90e2,        // Blue
  'science': 0x9b59b6,   // Purple
  'horror': 0xe74c3c,    // Red
  // Add your own...
};
```

### Adjusting Lighting
Edit `js/bookshelf3D.js` → `setupLighting()`:
```javascript
const dirLight = new THREE.DirectionalLight(0xffd9b3, 1.2); // Color, intensity
```

### Camera Position
Edit `js/bookshelf3D.js` → constructor:
```javascript
this.camera.position.set(0, 1, 14); // x, y, z
```

See **[THREE_JS_QUICKSTART.md](THREE_JS_QUICKSTART.md)** for more customization examples.

## 🔧 Technical Details

### Three.js Implementation
- **Renderer**: WebGL with antialiasing, shadows, tone mapping
- **Camera**: Perspective (55° FOV) with orbit controls
- **Lighting**: 5-light setup (ambient, directional, point, rim, hemisphere)
- **Materials**: MeshStandardMaterial with PBR workflow
- **Animations**: Custom lerp-based smooth transitions
- **Raycasting**: Accurate click detection with canvas offset

### Assets
- **HDRI**: Fireplace 4K environment (23.7 MB)
- **Textures**: Dark wood 4K diffuse map (10.5 MB)
- **Text**: Canvas-based rendering for book spines
- **Three.js**: v0.169.0 from CDN

### Performance
- 60fps target on modern hardware
- Shadow maps: 2048x2048
- Optimized raycasting (books only)
- Async asset loading with progress
- Per-frame animation updates

See **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** for complete technical documentation.

## 🎯 React Three Fiber Conversion

This project can be easily converted to React using `@react-three/fiber`:

### Recommended Libraries:
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers (OrbitControls, Environment, Text)
- `@react-three/postprocessing` - Effects (bloom, depth of field)

### Component Structure:
```jsx
<Canvas>
  <Environment files="fireplace.hdr" />
  <OrbitControls />
  <Bookshelf books={books} onBookClick={handleClick} />
</Canvas>
```

The current vanilla Three.js setup makes this conversion straightforward.

## 🌐 Browser Support

- ✅ Chrome/Edge (Chromium) - Best performance
- ✅ Firefox - Excellent support
- ✅ Safari - Good support (WebGL 2.0)
- ⚠️ Requires ES6 modules and WebGL support
- 📱 Mobile: Works but performance may vary (large HDRI)

## 🚧 Future Enhancements

### Near-term
- [ ] Book cover textures/images
- [ ] Hover effects (glow, subtle animation)
- [ ] Better mobile performance (compressed HDRI)
- [ ] Search functionality with highlights

### Advanced
- [ ] Page flipping animations
- [ ] VR support (WebXR)
- [ ] Physics engine integration (cannon.js)
- [ ] Post-processing effects (bloom, DOF)
- [ ] Signed distance field fonts (sharper text)
- [ ] Reading progress tracking
- [ ] Integration with reading APIs (Goodreads)

## 📚 Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [HDRI Haven](https://polyhaven.com/hdris) - Free HDRIs
- [Poly Haven Textures](https://polyhaven.com/textures) - Free PBR textures

## 📄 License

Personal project - Free to use and modify

---

**Built with Three.js ❤️**
