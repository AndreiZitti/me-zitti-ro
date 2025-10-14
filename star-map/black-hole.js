// ============================================
// BLACK HOLE MODE - Uses existing canvas/stars
// ============================================

class BlackHoleMode {
  constructor() {
    this.active = false;
    this.blackHoleMass = 10;
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.particleData = []; // Store physics data for each star
  }

  enter() {
    if (this.active) return;
    this.active = true;

    // Hide cursor and make black hole the cursor
    document.body.classList.add('black-hole-cursor');

    // Initialize mouse at center
    this.mouse.x = window.innerWidth / 2;
    this.mouse.y = window.innerHeight / 2;

    // Convert existing stars to particles with physics
    if (typeof stars !== 'undefined') {
      this.particleData = stars.map(star => ({
        starRef: star, // Reference to original star
        vx: 2 * Math.cos(Math.atan2(this.mouse.y - star.y, this.mouse.x - star.x) + 3 * Math.PI / 4),
        vy: 2 * Math.sin(Math.atan2(this.mouse.y - star.y, this.mouse.x - star.x) + 3 * Math.PI / 4),
        ax: 0,
        ay: 0,
        hist: [], // Trail history
        isTripStar: false
      }));
    }

    // Also add trip stars as particles
    const tripStarElements = document.querySelectorAll('.trip-star');
    tripStarElements.forEach(tripEl => {
      const rect = tripEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Get the star color from CSS variable
      const starColor = getComputedStyle(tripEl).getPropertyValue('--star-color').trim();

      // Create a virtual star object for trip stars
      const virtualStar = {
        x: centerX,
        y: centerY,
        size: 8, // Larger size for trip stars
        opacity: 1,
        layer: 3,
        color: starColor // Store the color
      };

      this.particleData.push({
        starRef: virtualStar,
        tripElement: tripEl, // Store reference to DOM element
        vx: 2 * Math.cos(Math.atan2(this.mouse.y - centerY, this.mouse.x - centerX) + 3 * Math.PI / 4),
        vy: 2 * Math.sin(Math.atan2(this.mouse.y - centerY, this.mouse.x - centerX) + 3 * Math.PI / 4),
        ax: 0,
        ay: 0,
        hist: [],
        isTripStar: true
      });

      // Hide the trip star DOM element while in black hole mode
      tripEl.style.opacity = '0';
    });

    // Store bound handler for removal later
    this.boundMouseMove = this.handleMouseMove.bind(this);
    canvas.addEventListener('mousemove', this.boundMouseMove);

    console.log(`Black hole mode activated with ${this.particleData.length} particles (${tripStarElements.length} trip stars)`);
  }

  exit() {
    if (!this.active) return;
    this.active = false;

    // Restore cursor
    document.body.classList.remove('black-hole-cursor');

    // Remove mouse tracking
    if (this.boundMouseMove) {
      canvas.removeEventListener('mousemove', this.boundMouseMove);
      this.boundMouseMove = null;
    }

    // Restore trip star DOM elements
    const tripStarElements = document.querySelectorAll('.trip-star');
    tripStarElements.forEach(tripEl => {
      tripEl.style.opacity = '1';
    });

    // Clear particle data
    this.particleData = [];
    this.blackHoleMass = 10;

    console.log('Black hole mode deactivated');

    // Refresh page to reset canvas state
    window.location.reload();
  }

  handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  updateParticle(particle) {
    const star = particle.starRef;
    const w = canvas.width;
    const h = canvas.height;

    // Distance from black hole
    const dist = Math.sqrt(Math.pow(star.x - this.mouse.x, 2) + Math.pow(star.y - this.mouse.y, 2));

    // Gravitational physics
    const mg = 100;
    const ang = Math.atan2(this.mouse.y - star.y, this.mouse.x - star.x);
    const force = mg * star.size * this.blackHoleMass / Math.pow(dist, 2);

    particle.ax = force * Math.cos(ang);
    particle.ay = force * Math.sin(ang);

    if (dist > this.blackHoleMass + star.size) {
      // Apply gravity
      particle.vx += 0.9 * particle.ax;
      particle.vy += 0.9 * particle.ay;

      // Friction
      particle.vx *= 0.9;
      particle.vy *= 0.9;

      // Update star position
      star.x += particle.vx;
      star.y += particle.vy;
    } else {
      // Star consumed by black hole - respawn off screen
      star.x = Math.random() * (w + 20) - 10;
      star.y = Math.random() * (h + 20) - 10;

      // Make sure it's actually off screen
      while (star.x > 0 && star.x < w && star.y > 0 && star.y < h) {
        star.x = Math.random() * (w + 20) - 10;
        star.y = Math.random() * (h + 20) - 10;
      }

      // Reset velocity with angle towards center
      const newAng = Math.atan2(h / 2 - star.y, w / 2 - star.x) + 3 * Math.PI / 4;
      particle.vx = 1 * Math.cos(newAng);
      particle.vy = 1 * Math.sin(newAng);
      particle.ax = 0;
      particle.ay = 0;

      if (!particle.isTripStar) {
        // Regular stars: reset base position and randomize size
        star.baseX = star.x;
        star.baseY = star.y;

        star.size = (star.layer === 1) ? 0.5 + Math.random() * 0.5 :
                    (star.layer === 2) ? 0.8 + Math.random() * 0.7 :
                    1 + Math.random();
      }
      // Trip stars keep their size and color

      // Black hole gains mass
      this.blackHoleMass = Math.pow(Math.pow(this.blackHoleMass, 2) + Math.pow(star.size, 2), 1 / 2);

      // Clear trail
      particle.hist = [];
    }

    // Store position for trail
    particle.hist.push({ x: star.x, y: star.y });
    if (particle.hist.length > 5) {
      particle.hist.shift();
    }
  }

  update() {
    if (!this.active) return;

    // Update all particles
    this.particleData.forEach(particle => this.updateParticle(particle));
  }

  draw() {
    if (!this.active) return;

    // Draw trails for each particle
    this.particleData.forEach(particle => {
      if (particle.hist.length > 1) {
        ctx.beginPath();
        particle.hist.forEach(hi => ctx.lineTo(hi.x, hi.y));
        ctx.lineWidth = 2 * particle.starRef.size;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        // Use colored trails for trip stars
        if (particle.isTripStar && particle.starRef.color) {
          ctx.strokeStyle = `${particle.starRef.color}40`; // Add transparency
        } else {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        }

        ctx.stroke();
      }
    });

    // Draw trip stars as colored glowing particles
    this.particleData.forEach(particle => {
      if (particle.isTripStar && particle.starRef.color) {
        const star = particle.starRef;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
        ctx.fillStyle = star.color;
        ctx.shadowBlur = star.size * 3;
        ctx.shadowColor = star.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // Draw black hole
    ctx.beginPath();
    ctx.arc(this.mouse.x, this.mouse.y, this.blackHoleMass, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();

    // Draw event horizon ring
    ctx.beginPath();
    ctx.arc(this.mouse.x, this.mouse.y, this.blackHoleMass, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(100, 50, 200, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw accretion disk glow
    const gradient = ctx.createRadialGradient(
      this.mouse.x, this.mouse.y, 0,
      this.mouse.x, this.mouse.y, this.blackHoleMass * 3
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.5, 'rgba(100, 50, 200, 0.2)');
    gradient.addColorStop(1, 'rgba(100, 50, 200, 0)');

    ctx.beginPath();
    ctx.arc(this.mouse.x, this.mouse.y, this.blackHoleMass * 3, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

// Create global instance
const blackHole = new BlackHoleMode();
