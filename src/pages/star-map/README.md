# Interactive Star Map

A 3D interactive star map application built with Three.js that showcases deep sky objects with detailed information panels.

## Features

- **3D Star Field**: Beautiful Milky Way background texture rendered in 3D space
- **Interactive Objects**: Click on celestial objects to learn more about them
- **Information Panels**: Detailed descriptions with smooth fade-in animations
- **Responsive Design**: Full-screen immersive experience
- **Real Astronomical Data**: Includes coordinates (RA/Dec) and accurate descriptions

## File Structure

```
star-map/
├── index.html          # Self-contained HTML file with inline CSS and JavaScript
├── images/
│   └── MilkyWay.jpg    # Background star field texture
└── README.md           # This documentation
```

## Usage

1. **Local Development**:

   ```bash
   cd star-map
   python3 -m http.server 8000
   # Visit http://localhost:8000
   ```

2. **Interaction**:
   - **Explore**: Move your mouse around to explore the 3D star field
   - **Click Objects**: Click on white sprites to view detailed information
   - **Close Panels**: Click the "✕" button to close information panels

## Celestial Objects

The application features three fascinating deep sky objects:

### North America Nebula

- **Location**: Cygnus constellation (RA: 20h 59m 17.1s, Dec: +44°31'44")
- **Type**: Emission nebula
- **Distance**: ~2,590 light-years
- **Notable**: Outline resembles North America, spans area 10x larger than full Moon

### M13 – Great Globular Cluster

- **Location**: Hercules constellation (RA: 16h 41m 41.24s, Dec: +36°27'35.5")
- **Type**: Globular cluster
- **Distance**: ~22,000 light-years
- **Notable**: Contains several hundred thousand stars, discovered by Edmond Halley

### M81 – Bode's Galaxy

- **Location**: Ursa Major constellation (RA: 09h 55m 33.2s, Dec: +69°03'55")
- **Type**: Spiral galaxy
- **Distance**: ~12 million light-years
- **Notable**: Contains supermassive black hole with 70 million solar masses

## Technical Details

- **Three.js**: Modern 3D rendering engine
- **WebGL**: Hardware-accelerated graphics
- **Raycasting**: Precise click detection on 3D objects
- **Sprite System**: Efficient rendering of point objects
- **Smooth Animations**: CSS-based fade transitions

## Browser Support

- Modern browsers with WebGL support
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- Hardware acceleration recommended for best performance

## Future Enhancements

- [ ] More deep sky objects (additional nebulae, galaxies, clusters)
- [ ] Zoom and pan controls
- [ ] Object search functionality
- [ ] Real-time sky positioning
- [ ] Mobile touch controls
- [ ] Sound effects and ambient audio
