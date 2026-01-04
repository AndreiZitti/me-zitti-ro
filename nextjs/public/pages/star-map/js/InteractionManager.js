export class InteractionManager {
  constructor(starField, transitionManager) {
    this.starField = starField;
    this.transitionManager = transitionManager;
    this.mouseX = 0;
    this.mouseY = 0;

    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.setupTripStars();
  }

  handleMouseMove(e) {
    // Normalize -1 to 1
    this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  setupTripStars() {
    // We need to wait for trip stars to be created or pass them in.
    // For now, let's assume they are created in main.js or here.
    // Let's actually move trip star creation here or to a separate TripManager.
    // For simplicity, let's keep it here.
    
    const container = document.getElementById('nebulae-container');
    // We need the trips data. Let's import it in main and pass it here? 
    // Or just import it here.
  }
  
  // Called from main with data - returns array of created elements
  createTripStars(tripsData) {
    const container = document.getElementById('nebulae-container');
    container.innerHTML = ''; // Clear existing
    const tripElements = [];

    tripsData.forEach(trip => {
      const star = document.createElement('div');
      star.className = `trip-star ${trip.size}`;
      star.dataset.tripId = trip.id;
      star.style.left = `${trip.position.x}%`;
      star.style.top = `${trip.position.y}%`;
      star.style.setProperty('--star-color', trip.color);

      // Hex to RGB for glow
      const rgb = this.hexToRgb(trip.color);
      star.style.setProperty('--star-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);

      // Add shape-specific class and content
      if (trip.shape) {
        star.classList.add(`shape-${trip.shape}`);

        if (trip.shape === 'spiral-galaxy') {
          const galaxyImg = document.createElement('div');
          galaxyImg.className = 'galaxy-sprite';
          star.appendChild(galaxyImg);
        }

        if (trip.shape === 'crescent-moon') {
          const moonEl = document.createElement('div');
          moonEl.className = 'moon-shape';
          const moonShadow = document.createElement('div');
          moonShadow.className = 'moon-shadow';
          moonEl.appendChild(moonShadow);
          star.appendChild(moonEl);
        }

        if (trip.shape === 'sun') {
          const sunEl = document.createElement('div');
          sunEl.className = 'sun-sprite';
          star.appendChild(sunEl);
        }

        if (trip.shape === 'star-cluster') {
          const clusterEl = document.createElement('div');
          clusterEl.className = 'star-cluster-sprite';
          star.appendChild(clusterEl);
        }

        if (trip.shape === 'edge-on-galaxy') {
          const galaxyEl = document.createElement('div');
          galaxyEl.className = 'edge-on-galaxy-sprite';
          star.appendChild(galaxyEl);
        }
      }

      const title = document.createElement('div');
      title.className = 'trip-star-title';
      title.textContent = trip.title;
      star.appendChild(title);

      star.addEventListener('click', (e) => {
        this.transitionManager.startTransition(trip, star);
      });

      container.appendChild(star);
      tripElements.push(star);
    });

    return tripElements;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  }
}
