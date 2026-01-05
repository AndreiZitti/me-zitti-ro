import { StarField } from './StarField.js';
import { SatelliteManager } from './SatelliteManager.js';
import { BlackHoleManager } from './BlackHoleManager.js';
import { TransitionManager } from './TransitionManager.js';
import { InteractionManager } from './InteractionManager.js';
import { ConstellationManager } from './ConstellationManager.js';

// Import data (assuming we can import it, or we'll fetch it)
// For now, let's just inline the data or fetch it if we convert it to JSON.
// Let's use the existing tripsData variable if it's global, or better, define it here.
const tripsData = [
  {
    id: "moon",
    title: "Lunar Observations",
    date: "August 12, 2024",
    location: "Backyard Observatory",
    photoCount: 8,
    notes: "Clear night. Captured multiple moon phases with stunning crater detail. Used 200mm lens with tripod.",
    color: "#E8E8E8",
    position: { x: 20, y: 30 },
    size: "large",
    folder: "Moon",
    shape: "crescent-moon"
  },
  {
    id: "sun",
    title: "Solar Observations",
    date: "July 4, 2024",
    location: "Desert National Park",
    photoCount: 12,
    notes: "Sunset photography session. Captured sun with interesting atmospheric effects and color gradients.",
    color: "#FFA500",
    position: { x: 75, y: 15 },
    size: "large",
    folder: "Sun",
    shape: "sun"
  },
  {
    id: "trip1",
    title: "Nebulas",
    date: "June 20, 2024",
    location: "Dark Sky Reserve",
    photoCount: 15,
    notes: "Perfect conditions for nebula photography. Minimal light pollution, captured stunning detail of emission and reflection nebulae.",
    color: "#9D4EDD",
    position: { x: 48, y: 62 },
    size: "medium",
    folder: "Trip1"
  },
  {
    id: "trip2",
    title: "Star Clusters",
    date: "September 5, 2024",
    location: "Mountain Peak",
    photoCount: 20,
    notes: "Long exposure session targeting open and globular clusters. Pleiades and other clusters came out beautifully.",
    color: "#3A86FF",
    position: { x: 82, y: 58 },
    size: "medium",
    folder: "Trip2",
    shape: "star-cluster"
  },
  {
    id: "trip3",
    title: "Galaxies",
    date: "May 15, 2024",
    location: "Coastal Viewpoint",
    photoCount: 10,
    notes: "Deep sky session capturing distant galaxies. Andromeda and other spiral galaxies with stunning detail.",
    color: "#06FFA5",
    position: { x: 12, y: 75 },
    size: "small",
    folder: "Trip3",
    shape: "spiral-galaxy"
  },
  {
    id: "ngc891",
    title: "NGC 891",
    date: "November 2024",
    location: "Remote Observatory",
    photoCount: 3,
    notes: "Edge-on spiral galaxy in Andromeda constellation.",
    color: "#7B68EE",
    position: { x: 35, y: 42 },
    size: "medium",
    folder: "NGC_891",
    shape: "edge-on-galaxy"
  }
];

class StarMapApp {
  constructor() {
    this.starField = new StarField('starfield');
    this.satelliteManager = new SatelliteManager();
    this.blackHoleManager = new BlackHoleManager('starfield');
    this.transitionManager = new TransitionManager(this.starField);
    this.interactionManager = new InteractionManager(this.starField, this.transitionManager);
    this.constellationManager = new ConstellationManager();

    // Create trip stars and initialize constellation lines
    const tripElements = this.interactionManager.createTripStars(tripsData);
    this.constellationManager.initialize(tripElements);

    // Pass trip elements to black hole manager for interaction
    this.blackHoleManager.setTripStars(tripElements);

    this.animate();
  }

  animate() {
    // 1. Update State
    if (this.blackHoleManager.active) {
      this.blackHoleManager.update(this.starField.stars);
      this.satelliteManager.update(this.blackHoleManager);
    } else {
      this.starField.update(this.interactionManager.mouseX, this.interactionManager.mouseY);
      this.satelliteManager.update(null);

      // Update constellation lines and hub position with parallax
      this.constellationManager.updateHubPosition(
        this.interactionManager.mouseX,
        this.interactionManager.mouseY
      );
      this.constellationManager.update();
    }

    // 2. Draw
    this.starField.draw();

    if (this.blackHoleManager.active) {
      this.blackHoleManager.draw();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  new StarMapApp();
});
