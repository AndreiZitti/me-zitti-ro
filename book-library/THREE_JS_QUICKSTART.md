# Three.js Bookshelf - Quick Start Guide

## What You Have Now

Your book library has been upgraded from CSS 3D transforms to **WebGL-based Three.js rendering**. This gives you:

- 🎨 Realistic lighting from a fireplace HDRI environment
- 🪵 Photorealistic wooden shelves
- 📚 3D books with random sizes and category-based colors
- ✨ Smooth animations when opening books
- 🖱️ Interactive camera controls (orbit, zoom)
- 🔍 All your filters and sorting still work perfectly

---

## Testing the Application

### 1. Start the Server
```bash
cd /Users/zitti/Documents/GitHub/azitti/book-library
python3 -m http.server 8000
```

### 2. Open in Browser
Navigate to: `http://localhost:8000`

### 3. What You Should See
- A warm fireplace environment in the background
- Wooden shelves with 3D books arranged neatly
- Books in different colors based on genre
- Book titles and authors on the spines

---

## Interacting with the Bookshelf

### Camera Controls
- **Rotate View**: Click and drag on the canvas
- **Zoom In/Out**: Scroll with mouse wheel
- **Reset View**: Refresh the page

### Book Interactions
- **Open a Book**: Click on any book
  - Book smoothly moves forward
  - Details overlay appears with book info
- **Close Book**: Click the X button or click outside the overlay

### Filters & Sorting
- **Filter by Genre**: Use the dropdown at the top
  - Select multiple genres (hold Ctrl/Cmd)
  - Click "Clear All" to reset
- **Sort Books**: Click sort buttons
  - By Title (alphabetical)
  - By Author (alphabetical)
  - By Genre (grouped)

All your existing filter/sort functionality works exactly as before!

---

## File Structure

```
book-library/
├── index.html              # Main page (updated with Three.js)
├── admin.html             # Book management (unchanged)
│
├── js/
│   ├── bookLibrary.js     # Data & logic (mostly unchanged)
│   ├── bookshelf3D.js     # Three.js scene manager (NEW)
│   ├── Book3D.js          # 3D book component (NEW)
│   └── admin.js           # Admin panel (unchanged)
│
├── css/
│   ├── library.css        # UI styles (cleaned up, 195 lines)
│   └── library-old.css.bak # Backup of CSS 3D code
│
├── assets/
│   ├── Fireplace 4K.hdr           # HDRI environment
│   └── Dark Wood Texture/
│       └── textures/
│           └── dark_wood_diff_4k.jpg
│
└── data/
    └── (localStorage used instead)
```

---

## Key Code Locations

### Adding a New Book
Books are managed in localStorage through the admin panel:
- Go to `http://localhost:8000/admin.html`
- Add/edit/delete books
- Changes automatically sync to the 3D view

### Changing Book Colors
Edit category colors in `js/Book3D.js`:
```javascript
getCategoryColor(category) {
  const categoryColors = {
    'ai': 0x4a90e2,        // Blue
    'self-help': 0xf39c12, // Orange
    'business': 0x27ae60,  // Green
    'science': 0x9b59b6,   // Purple
    'horror': 0xe74c3c,    // Red
    'dystopian': 0x34495e, // Dark gray
  };
  return categoryColors[category] || 0x95a5a6;
}
```

### Adjusting Lighting
Edit lighting in `js/bookshelf3D.js` → `setupLighting()` method:
```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const dirLight = new THREE.DirectionalLight(0xffd9b3, 1.2);
const fireplaceLight = new THREE.PointLight(0xff6633, 1.5, 30);
// etc.
```

### Changing Camera Position
Edit in `js/bookshelf3D.js` → constructor:
```javascript
this.camera.position.set(0, 1, 14); // x, y, z
```

### Adjusting Animation Speed
Edit in `js/Book3D.js` → `update()` method:
```javascript
const lerpFactor = 0.1; // Lower = slower, Higher = faster (0-1)
```

---

## Customization Examples

### Example 1: Change Books Per Shelf
In `bookLibrary.js`:
```javascript
this.booksPerShelf = 8; // Change from 6 to 8
```

### Example 2: Make Books Pull Out Further
In `bookshelf3D.js` → `openBook()`:
```javascript
targetPosition.z += 3; // Change from 2 to 3
```

### Example 3: Add More Rotation When Opening
In `bookshelf3D.js` → `openBook()`:
```javascript
const targetRotation = new THREE.Euler(0, 0.4, 0); // Change from 0.2 to 0.4
```

### Example 4: Change Fireplace Light Color
In `bookshelf3D.js` → `setupLighting()`:
```javascript
const fireplaceLight = new THREE.PointLight(0xff9933, 1.5, 30); // Warmer orange
```

---

## Troubleshooting

### Issue: Black screen / Nothing shows up
**Solutions:**
1. Check browser console for errors (F12)
2. Ensure HDRI file exists: `assets/Fireplace 4K.hdr`
3. Verify wood texture exists: `assets/Dark Wood Texture/textures/dark_wood_diff_4k.jpg`
4. Try a hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Issue: Books don't appear
**Solutions:**
1. Check that `bookLibrary` initialized: Open console, type `window.bookLibrary`
2. Check books exist in localStorage: Go to `admin.html` and verify
3. Look for errors in console

### Issue: Can't click on books
**Solutions:**
1. Ensure raycaster is working (check console for "Book clicked:" messages)
2. Verify canvas is receiving mouse events
3. Check that `#bookshelf-3d-container` is visible

### Issue: Performance is slow
**Solutions:**
1. **Reduce shadow quality**: In `bookshelf3D.js`:
   ```javascript
   dirLight.shadow.mapSize.width = 1024; // Instead of 2048
   dirLight.shadow.mapSize.height = 1024;
   ```
2. **Lower HDRI quality**: Use a smaller HDRI file
3. **Reduce book count**: Display fewer books initially

### Issue: Text on spines is blurry
**Solutions:**
1. **Increase canvas resolution**: In `Book3D.js`:
   ```javascript
   canvas.width = 1024;  // Instead of 512
   canvas.height = 4096; // Instead of 2048
   ```

---

## Performance Tips

### For Desktop
- Keep shadow quality at 2048x2048
- Use full 4K textures
- Enable all lights

### For Mobile/Low-End Devices
- Reduce shadow quality to 1024x1024
- Use 1K textures instead of 4K
- Disable some lights (remove rim light, reduce fireplace light)
- Lower camera distance limits

---

## Next Steps

### Recommended Enhancements
1. **Add Book Covers**: Create texture images for book fronts
2. **Improve Text**: Use signed distance field fonts for sharper text
3. **Add Hover Effects**: Glow effect when hovering over books
4. **Page Flipping Animation**: Animated pages when opening books
5. **Search Functionality**: Search by title/author and highlight results

### Advanced Features
1. **VR Support**: Enable WebXR for VR viewing
2. **Physics**: Add realistic book physics with cannon.js
3. **Post-Processing**: Add bloom, depth of field effects
4. **Dynamic Covers**: Generate covers from book data

---

## Resources

### Three.js Documentation
- Official Docs: https://threejs.org/docs/
- Examples: https://threejs.org/examples/

### Learning Three.js
- Three.js Journey: https://threejs-journey.com/
- Three.js Fundamentals: https://threejs.org/manual/

### HDRI Sources
- Poly Haven: https://polyhaven.com/hdris
- HDRI Haven: https://hdrihaven.com/

### Texture Sources
- Poly Haven Textures: https://polyhaven.com/textures
- CC0 Textures: https://cc0textures.com/

---

## Support

If you encounter issues or want to customize further, check:
1. Browser console for errors (F12)
2. `MIGRATION_SUMMARY.md` for detailed implementation info
3. Three.js documentation for specific features

---

**Enjoy your new 3D book library!** 📚✨
