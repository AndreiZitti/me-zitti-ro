// ============================================
// PHASE 3: Canvas Star Field
// ============================================

const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let stars = [];
let time = 0;
let mouseX = 0;
let mouseY = 0;
let shootingStars = [];
let rotation = 0; // Canvas rotation in degrees

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

  // 2. Purple nebula cloud - top-right (no glow in middle)
  const purpleX = canvas.width * 0.7;
  const purpleY = canvas.height * 0.3;
  const purpleGradient = ctx.createRadialGradient(purpleX, purpleY, 100, purpleX, purpleY, 500);
  purpleGradient.addColorStop(0, 'rgba(139, 92, 246, 0.015)');
  purpleGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.008)');
  purpleGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

  ctx.fillStyle = purpleGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 3. Teal nebula cloud - bottom-left (no glow in middle)
  const tealX = canvas.width * 0.25;
  const tealY = canvas.height * 0.75;
  const tealGradient = ctx.createRadialGradient(tealX, tealY, 80, tealX, tealY, 350);
  tealGradient.addColorStop(0, 'rgba(80, 200, 200, 0.012)');
  tealGradient.addColorStop(0.5, 'rgba(80, 200, 200, 0.006)');
  tealGradient.addColorStop(1, 'rgba(80, 200, 200, 0)');

  ctx.fillStyle = tealGradient;
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

// Animation loop
function animate() {
  // If black hole mode is active, use black hole physics instead of normal updates
  if (blackHole && blackHole.active) {
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

    // Click handler (same as before)
    star.addEventListener('click', () => showTripDetails(trip));

    nebulaContainer.appendChild(star);
  });
}

// ============================================
// PHASE 6: Trip Details Modal
// ============================================

const modal = document.getElementById('trip-modal');
const closeBtn = modal.querySelector('.close-btn');

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

async function showTripDetails(trip) {
  // Populate content
  document.getElementById('modal-title').textContent = trip.title;
  document.getElementById('modal-date').textContent = `📅 ${trip.date}`;
  document.getElementById('modal-location').textContent = `📍 ${trip.location}`;
  document.getElementById('modal-photos').textContent = `📸 ${trip.photoCount} photos`;
  document.getElementById('modal-notes').textContent = trip.notes;

  // Load and display photos
  const gallery = document.getElementById('modal-gallery');
  gallery.innerHTML = '<p style="opacity: 0.6;">Loading photos...</p>';

  const photos = await loadTripPhotos(trip.folder);

  gallery.innerHTML = '';
  if (photos.length > 0) {
    photos.forEach(photoPath => {
      const img = document.createElement('img');
      img.src = photoPath;
      img.alt = trip.title;
      img.loading = 'lazy';
      img.addEventListener('click', () => {
        window.open(photoPath, '_blank');
      });
      gallery.appendChild(img);
    });
  } else {
    gallery.innerHTML = '<p style="opacity: 0.6;">No photos available</p>';
  }

  // Show modal
  modal.classList.remove('hidden');
}

function hideModal() {
  modal.classList.add('hidden');
}

// Close button
closeBtn.addEventListener('click', hideModal);

// Click outside modal to close
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    hideModal();
  }
});

// ESC key to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    hideModal();
  }
});

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

// ============================================
// PHASE 8: Black Hole Mode Integration
// ============================================

// Black hole mode toggle
const blackHoleToggle = document.getElementById('black-hole-toggle');

if (blackHoleToggle && typeof blackHole !== 'undefined') {
  blackHoleToggle.addEventListener('click', () => {
    if (blackHole.active) {
      // Exit black hole mode
      blackHole.exit();
      blackHoleToggle.classList.remove('active');
      blackHoleToggle.classList.remove('hidden');
    } else {
      // Enter black hole mode
      blackHole.enter();
      blackHoleToggle.classList.add('active');
      blackHoleToggle.classList.add('hidden');
    }
  });

  // Track mouse to show button when hovering over button area
  document.addEventListener('mousemove', (e) => {
    if (blackHole.active) {
      const buttonRect = blackHoleToggle.getBoundingClientRect();
      const isOverButton = (
        e.clientX >= buttonRect.left &&
        e.clientX <= buttonRect.right &&
        e.clientY >= buttonRect.top &&
        e.clientY <= buttonRect.bottom
      );

      if (isOverButton) {
        blackHoleToggle.classList.remove('hidden');
      } else {
        blackHoleToggle.classList.add('hidden');
      }
    }
  });

  // ESC key to exit black hole mode
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && blackHole.active) {
      blackHole.exit();
      blackHoleToggle.classList.remove('active');
      blackHoleToggle.classList.remove('hidden');
    }
  });
} else {
  console.warn('Black hole mode not available - blackHole object not found');
}
