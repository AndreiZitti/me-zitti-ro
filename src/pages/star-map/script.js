// ============================================
// PHASE 3: Canvas Star Field
// ============================================

//TODO: REFRACTOTOR TO ANOTHER PAGE ( THE DETAIL VIEW)
//TODO: REFRATOR ANIMATION LOGIC INTO SMALLER COMPONENTS


const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let stars = [];
let time = 0;
let mouseX = 0;
let mouseY = 0;
let shootingStars = [];
let rotation = 0; // Canvas rotation in degrees

// Transition state management for hyperdrive zoom
const transitionState = {
  active: false,
  mode: null, // 'zooming-in', 'viewing', 'zooming-out'
  targetX: 0,
  targetY: 0,
  progress: 0, // 0 to 1
  duration: 1200, // milliseconds
  startTime: 0,
  currentTrip: null
};

// Resize canvas to window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Generate stars with 3 layers
function generateStars() {
  stars = [];

  // Layer 1 (far) - 150 stars
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseX: 0, // Will be set after creation
      baseY: 0,
      size: 0.5 + Math.random() * 0.5,
      baseOpacity: 0.3 + Math.random() * 0.3,
      opacity: 0.3 + Math.random() * 0.3,
      twinkleSpeed: 0.0005 + Math.random() * 0.001,
      layer: 1
    });
  }

  // Layer 2 (mid) - 100 stars
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseX: 0,
      baseY: 0,
      size: 0.8 + Math.random() * 0.7,
      baseOpacity: 0.5 + Math.random() * 0.3,
      opacity: 0.5 + Math.random() * 0.3,
      twinkleSpeed: 0.0005 + Math.random() * 0.001,
      layer: 2
    });
  }

  // Layer 3 (near) - 50 stars
  for (let i = 0; i < 50; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseX: 0,
      baseY: 0,
      size: 1 + Math.random(),
      baseOpacity: 0.7 + Math.random() * 0.3,
      opacity: 0.7 + Math.random() * 0.3,
      twinkleSpeed: 0.0005 + Math.random() * 0.001,
      layer: 3
    });
  }

  // Set base positions for parallax
  stars.forEach(star => {
    star.baseX = star.x;
    star.baseY = star.y;
  });
}

// Draw subtle background atmosphere
function drawAtmosphere() {
  // 1. Milky Way band - diagonal gradient from bottom-left to top-right
  const milkyWayGradient = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);
  milkyWayGradient.addColorStop(0, 'rgba(140, 140, 180, 0)');
  milkyWayGradient.addColorStop(0.35, 'rgba(140, 140, 180, 0.08)');
  milkyWayGradient.addColorStop(0.5, 'rgba(140, 140, 180, 0.12)');
  milkyWayGradient.addColorStop(0.65, 'rgba(140, 140, 180, 0.08)');
  milkyWayGradient.addColorStop(1, 'rgba(140, 140, 180, 0)');

  ctx.fillStyle = milkyWayGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

}

// Shooting star functions
function createShootingStar() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * (canvas.height * 0.5); // Top half only
  const angle = (Math.PI / 4) + (Math.random() * Math.PI / 12); // 45-60 degrees
  const speed = 3 + Math.random() * 2; // 3-5px per frame
  const length = 50 + Math.random() * 30; // 50-80px
  const duration = 1000 + Math.random() * 1000; // 1-2 seconds

  shootingStars.push({
    x,
    y,
    angle,
    speed,
    length,
    startTime: Date.now(),
    duration,
    opacity: 1
  });
}

function updateShootingStars() {
  const now = Date.now();
  shootingStars = shootingStars.filter(star => {
    const elapsed = now - star.startTime;

    // Update position
    star.x += Math.cos(star.angle) * star.speed;
    star.y += Math.sin(star.angle) * star.speed;

    // Fade out
    star.opacity = Math.max(0, 1 - (elapsed / star.duration));

    // Remove if faded or off screen
    return star.opacity > 0 && star.x < canvas.width + 100 && star.y < canvas.height + 100;
  });
}

function drawShootingStars() {
  shootingStars.forEach(star => {
    const endX = star.x - Math.cos(star.angle) * star.length;
    const endY = star.y - Math.sin(star.angle) * star.length;

    // Create gradient for trail
    const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY);
    gradient.addColorStop(0, `rgba(220, 230, 255, ${star.opacity})`);
    gradient.addColorStop(1, `rgba(220, 230, 255, 0)`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `rgba(220, 230, 255, ${star.opacity * 0.8})`;

    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.shadowBlur = 0; // Reset
  });
}

// Draw stars
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw atmosphere first (before stars)
  drawAtmosphere();

  // Draw stars (rotation is applied via position updates, not canvas transform)
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.shadowBlur = star.size * 1.5;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    ctx.shadowBlur = 0; // Reset
  });

  // Draw shooting stars on top
  drawShootingStars();
}

// Update stars (twinkling + parallax + rotation)
function updateStars() {
  time += 0.01;

  // Slow rotation: 0.1 degrees per minute
  rotation += 0.1 / 60 / 60;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const rotRad = (rotation * Math.PI) / 180;

  stars.forEach(star => {
    // Twinkling animation
    const twinkle = Math.sin(time * star.twinkleSpeed) * 0.2;
    star.opacity = star.baseOpacity + twinkle;
    star.opacity = Math.max(0, Math.min(1, star.opacity));

    // Apply rotation to base position
    const relX = star.baseX - centerX;
    const relY = star.baseY - centerY;
    const rotatedX = relX * Math.cos(rotRad) - relY * Math.sin(rotRad);
    const rotatedY = relX * Math.sin(rotRad) + relY * Math.cos(rotRad);
    const newBaseX = rotatedX + centerX;
    const newBaseY = rotatedY + centerY;

    // Parallax movement on top of rotation
    let parallaxAmount = 0;
    if (star.layer === 1) parallaxAmount = 5;   // 5px max movement
    if (star.layer === 2) parallaxAmount = 15;  // 15px
    if (star.layer === 3) parallaxAmount = 30;  // 30px

    // Smooth lerp (linear interpolation)
    const targetX = newBaseX + mouseX * parallaxAmount;
    const targetY = newBaseY + mouseY * parallaxAmount;

    star.x += (targetX - star.x) * 0.1; // 10% lerp
    star.y += (targetY - star.y) * 0.1;
  });
}

// Easing function for smooth acceleration (zoom in keeps accelerating)
function easeInCubic(t) {
  return t * t * t;
}

// Update transition physics for hyperdrive zoom
function updateTransition() {
  const now = Date.now();
  const elapsed = now - transitionState.startTime;
  const rawProgress = Math.min(elapsed / transitionState.duration, 1);
  transitionState.progress = rawProgress;

  if (transitionState.mode === 'zooming-in' || transitionState.mode === 'zooming-out') {
    const isZoomingIn = transitionState.mode === 'zooming-in';
    const effectiveProgress = isZoomingIn ? transitionState.progress : (1 - transitionState.progress);

    // Use cubic easing for acceleration curve
    const easedProgress = easeInCubic(effectiveProgress);

    stars.forEach(star => {
      // Calculate angle from star to vanishing point
      const dx = star.x - transitionState.targetX;
      const dy = star.y - transitionState.targetY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // Layer speed multipliers
      let speedMultiplier = 1;
      if (star.layer === 2) speedMultiplier = 2;
      if (star.layer === 3) speedMultiplier = 3;

      // Move star away from vanishing point (hyperdrive effect)
      // Smoother acceleration curve
      const baseSpeed = 6;
      const acceleration = 1 + easedProgress * 2.5; // Up to 3.5x faster, smoother curve
      const speed = baseSpeed * speedMultiplier * acceleration;
      star.x += Math.cos(angle) * speed * (isZoomingIn ? 1 : -1);
      star.y += Math.sin(angle) * speed * (isZoomingIn ? 1 : -1);

      // Progressive fade with steeper curve at 70% mark
      let fadeAmount = easedProgress * 0.5; // Max 50% fade, smoother
      if (easedProgress > 0.7) {
        fadeAmount = 0.35 + (easedProgress - 0.7) * 1.5;
      }
      star.opacity = star.baseOpacity * (1 - fadeAmount);

      // Recycle stars that go off-screen - smoother respawn
      const margin = 100;
      if (star.x < -margin || star.x > canvas.width + margin ||
          star.y < -margin || star.y > canvas.height + margin) {
        // Respawn at vanishing point with small offset - this prevents the "pop" effect
        const respawnDistance = 20 + Math.random() * 30; // Smaller, more consistent spawn radius
        const respawnAngle = Math.random() * Math.PI * 2;
        star.x = transitionState.targetX + Math.cos(respawnAngle) * respawnDistance;
        star.y = transitionState.targetY + Math.sin(respawnAngle) * respawnDistance;
        star.opacity = 0; // Start invisible and fade in
      }
    });

    // Check if transition is complete
    if (transitionState.progress >= 1) {
      if (isZoomingIn) {
        // Switch to viewing mode
        transitionState.mode = 'viewing';
        showDetailView();
      } else {
        // Exit transition completely
        transitionState.active = false;
        transitionState.mode = null;
        transitionState.currentTrip = null;
        // Regenerate stars to reset positions
        stars.length = 0;
        generateStars();
      }
    }
  } else if (transitionState.mode === 'viewing') {
    // Keep parallax running during viewing, just with dimmed stars
    time += 0.01;

    // Slow rotation continues
    rotation += 0.1 / 60 / 60;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const rotRad = (rotation * Math.PI) / 180;

    stars.forEach(star => {
      // Keep dimmed but visible
      const twinkle = Math.sin(time * star.twinkleSpeed) * 0.15;
      star.opacity = (star.baseOpacity * 0.5) + twinkle; // 50% opacity with subtle twinkle
      star.opacity = Math.max(0, Math.min(1, star.opacity));

      // Apply rotation to base position
      const relX = star.baseX - centerX;
      const relY = star.baseY - centerY;
      const rotatedX = relX * Math.cos(rotRad) - relY * Math.sin(rotRad);
      const rotatedY = relX * Math.sin(rotRad) + relY * Math.cos(rotRad);
      const newBaseX = rotatedX + centerX;
      const newBaseY = rotatedY + centerY;

      // Parallax movement (slightly reduced)
      let parallaxAmount = 0;
      if (star.layer === 1) parallaxAmount = 3;   // Reduced from 5
      if (star.layer === 2) parallaxAmount = 10;  // Reduced from 15
      if (star.layer === 3) parallaxAmount = 20;  // Reduced from 30

      // Smooth lerp
      const targetX = newBaseX + mouseX * parallaxAmount;
      const targetY = newBaseY + mouseY * parallaxAmount;

      star.x += (targetX - star.x) * 0.08; // Slightly slower lerp
      star.y += (targetY - star.y) * 0.08;
    });
  }
}

// Animation loop
function animate() {
  if (transitionState.active) {
    updateTransition(); // Handle zoom transition
  } else if (blackHole && blackHole.active) {
    blackHole.update();
  } else {
    updateStars();
  }

  updateShootingStars();
  drawStars();

  // Draw black hole effects on top
  if (blackHole && blackHole.active) {
    blackHole.draw();
  }

  requestAnimationFrame(animate);
}

// Shooting star spawner - every 5 seconds for testing
setInterval(() => {
  createShootingStar();
}, 5000); // 5 seconds

// ============================================
// PHASE 4: Mouse Parallax
// ============================================

window.addEventListener('mousemove', (e) => {
  // Normalize to -1 to 1 range, center is 0
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// ============================================
// PHASE 5: Render Trip Stars
// ============================================

const nebulaContainer = document.getElementById('nebulae-container');

// Helper function to convert hex to rgb
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 };
}

// Create trip stars from trip data
function createTripStars() {
  tripsData.forEach((trip, index) => {
    const star = document.createElement('div');
    star.className = `trip-star ${trip.size}`;
    star.dataset.tripId = trip.id;

    // Position
    star.style.left = `${trip.position.x}%`;
    star.style.top = `${trip.position.y}%`;

    // Color - much more subtle than before
    const rgb = hexToRgb(trip.color);
    star.style.setProperty('--star-color', trip.color);
    star.style.setProperty('--star-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);

    // Title overlay
    const title = document.createElement('div');
    title.className = 'trip-star-title';
    title.textContent = trip.title;
    star.appendChild(title);

    // Click handler - pass event for position
    star.addEventListener('click', (e) => showTripDetails(trip, e));

    nebulaContainer.appendChild(star);
  });
}

// ============================================
// PHASE 6: Trip Details with Zoom Transition
// ============================================

// Load photos for a trip folder
async function loadTripPhotos(folderName) {
  const photoExtensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];
  const basePath = `assets/Trips/${folderName}/`;

  // Try to fetch photos from the folder
  const photos = [];

  // Common photo names to try
  const commonNames = ['BloodMoonClose', 'BloodMoonFar', 'smallmoon', 'Sun', 'DoubleSun', 'StarCluster'];

  for (const name of commonNames) {
    for (const ext of photoExtensions) {
      try {
        const path = basePath + name + ext;
        const response = await fetch(path, { method: 'HEAD' });
        if (response.ok) {
          photos.push(path);
        }
      } catch (e) {
        // Photo doesn't exist, continue
      }
    }
  }

  return photos;
}

// Start zoom transition to trip details
async function showTripDetails(trip, event) {
  // Prevent action if already transitioning
  if (transitionState.active) return;

  // Get clicked star's position
  const starElement = event.currentTarget;
  const rect = starElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Disable black hole mode if active
  if (blackHole && blackHole.active) {
    blackHole.exit();
    document.getElementById('black-hole-toggle')?.classList.remove('active');
    document.getElementById('black-hole-reset')?.classList.add('hidden');
  }

  // Fade out OTHER trip stars, but keep the clicked one visible
  const nebulaContainer = document.getElementById('nebulae-container');
  const allTripStars = nebulaContainer.querySelectorAll('.trip-star');
  allTripStars.forEach(star => {
    if (star !== starElement) {
      star.style.opacity = '0';
      star.style.transition = 'opacity 0.5s ease';
    } else {
      // Keep clicked star visible and brighten it
      star.style.transition = 'transform 1.2s ease, opacity 0.8s ease';
      star.style.transform = 'translate(-50%, -50%) scale(2)';
      star.style.opacity = '1';
      star.style.zIndex = '1000';
    }
  });
  nebulaContainer.classList.add('transitioning');

  // Set transition state
  transitionState.active = true;
  transitionState.mode = 'zooming-in';
  transitionState.targetX = centerX;
  transitionState.targetY = centerY;
  transitionState.startTime = Date.now();
  transitionState.progress = 0;
  transitionState.currentTrip = trip;

  // Animation loop will handle the zoom
}

//TODO: REFRACTOTOR TO ANOTHER PAGE ( THE DETAIL VIEW)

// Show detail view (called when zoom completes)
async function showDetailView() {
  const trip = transitionState.currentTrip;
  if (!trip) return;

  // Populate detail view content
  document.getElementById('detail-title').textContent = trip.title;
  document.getElementById('detail-date').textContent = `📅 ${trip.date}`;
  document.getElementById('detail-location').textContent = `📍 ${trip.location}`;
  document.getElementById('detail-notes').textContent = trip.notes;

  // Load photos
  const photos = await loadTripPhotos(trip.folder);

  // Set hero image (use first photo or placeholder)
  const heroImg = document.getElementById('detail-hero-img');
  if (photos.length > 0) {
    heroImg.src = photos[0];
    heroImg.alt = trip.title;
  } else {
    heroImg.style.display = 'none';
  }

  // Populate gallery with remaining photos
  const gallery = document.getElementById('detail-gallery');
  gallery.innerHTML = '';

  if (photos.length > 1) {
    photos.slice(1).forEach(photoPath => {
      const img = document.createElement('img');
      img.src = photoPath;
      img.alt = trip.title;
      img.loading = 'lazy';
      img.addEventListener('click', () => {
        window.open(photoPath, '_blank');
      });
      gallery.appendChild(img);
    });
  }

  // Show detail view with fade
  const detailView = document.getElementById('trip-detail-view');
  detailView.classList.remove('hidden');
}

// Start zoom-out transition and hide detail view
function hideDetailView() {
  // Fade out detail view
  const detailView = document.getElementById('trip-detail-view');
  detailView.classList.add('hidden');

  // Start zoom-out after brief delay
  setTimeout(() => {
    transitionState.mode = 'zooming-out';
    transitionState.startTime = Date.now();
    transitionState.progress = 0;

    // Fade all trip stars back in
    const nebulaContainer = document.getElementById('nebulae-container');
    const allTripStars = nebulaContainer.querySelectorAll('.trip-star');
    allTripStars.forEach(star => {
      star.style.opacity = '1';
      star.style.transform = 'translate(-50%, -50%) scale(1)';
      star.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      star.style.zIndex = '';
    });

    // Re-enable interactions after zoom-out completes
    setTimeout(() => {
      nebulaContainer.classList.remove('transitioning');
    }, transitionState.duration);
  }, 300);
}

// ============================================
// PHASE 7: Initialization & Optimization
// ============================================

// Debounce resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resizeCanvas();
    stars.length = 0;
    generateStars();
  }, 250);
});

// Initialize everything
resizeCanvas();
generateStars();
createTripStars();
animate();

// Detail view event handlers
const closeDetailBtn = document.getElementById('close-detail');
if (closeDetailBtn) {
  closeDetailBtn.addEventListener('click', hideDetailView);
}

// ESC key to close detail view or black hole mode
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close detail view if open
    const detailView = document.getElementById('trip-detail-view');
    if (detailView && !detailView.classList.contains('hidden')) {
      hideDetailView();
    }
    // Or exit black hole mode
    else if (blackHole && blackHole.active) {
      blackHole.exit();
      const blackHoleToggle = document.getElementById('black-hole-toggle');
      const blackHoleReset = document.getElementById('black-hole-reset');
      if (blackHoleToggle) {
        blackHoleToggle.classList.remove('active');
        blackHoleToggle.classList.remove('hidden');
      }
      if (blackHoleReset) {
        blackHoleReset.classList.add('hidden');
      }
    }
  }
});

// ============================================
// PHASE 8: Black Hole Mode Integration
// ============================================

// Draw black hole icon on button
function drawBlackHoleIcon() {
  const iconCanvas = document.getElementById('black-hole-icon');
  if (!iconCanvas) return;

  const iconCtx = iconCanvas.getContext('2d');
  const centerX = 30;
  const centerY = 30;
  const blackHoleMass = 10; // Same as initial mass in black-hole.js

  // Clear canvas
  iconCtx.clearRect(0, 0, 60, 60);

  // Draw black hole (scaled down version of the actual black hole)
  // Black core
  iconCtx.beginPath();
  iconCtx.arc(centerX, centerY, blackHoleMass, 0, 2 * Math.PI);
  iconCtx.fillStyle = 'black';
  iconCtx.fill();

  // Event horizon ring
  iconCtx.beginPath();
  iconCtx.arc(centerX, centerY, blackHoleMass, 0, 2 * Math.PI);
  iconCtx.strokeStyle = 'rgba(100, 50, 200, 0.6)';
  iconCtx.lineWidth = 2;
  iconCtx.stroke();

  // Accretion disk glow
  const gradient = iconCtx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, blackHoleMass * 3
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.5, 'rgba(100, 50, 200, 0.3)');
  gradient.addColorStop(1, 'rgba(100, 50, 200, 0)');

  iconCtx.beginPath();
  iconCtx.arc(centerX, centerY, blackHoleMass * 3, 0, 2 * Math.PI);
  iconCtx.fillStyle = gradient;
  iconCtx.fill();
}

// Initialize black hole icon
drawBlackHoleIcon();

// Black hole mode toggle
const blackHoleToggle = document.getElementById('black-hole-toggle');
const blackHoleReset = document.getElementById('black-hole-reset');

if (blackHoleToggle && blackHoleReset && typeof blackHole !== 'undefined') {
  blackHoleToggle.addEventListener('click', (e) => {
    // Get button position to spawn black hole there
    const rect = blackHoleToggle.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    // Enter black hole mode at button position
    blackHole.enter(buttonCenterX, buttonCenterY);
    blackHoleToggle.classList.add('active');
    blackHoleToggle.classList.add('hidden');

    // Show reset button
    blackHoleReset.classList.remove('hidden');

    // Hide toggle button for 3 seconds
    setTimeout(() => {
      blackHoleToggle.classList.remove('hidden');
    }, 3000);
  });

  // Reset button exits black hole mode
  blackHoleReset.addEventListener('click', () => {
    blackHole.exit();
    blackHoleToggle.classList.remove('active');
    blackHoleToggle.classList.remove('hidden');
    blackHoleReset.classList.add('hidden');
  });
} else {
  console.warn('Black hole mode not available - blackHole object not found');
}
