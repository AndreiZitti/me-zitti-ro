export class StarField {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.shootingStars = [];
    this.time = 0;
    this.rotation = 0;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    // this.initConstellations(); // Disabled for now
  }

  // Zodiac constellation data - SVG-like paths for each sign
  // Paths are normalized to 0-1 coordinates
  getZodiacData() {
    return [
      {
        name: 'Aries',
        // Ram horns shape
        stars: [[0.5, 0.2], [0.3, 0.5], [0.7, 0.5], [0.2, 0.8], [0.8, 0.8]],
        path: 'M 0.2 0.8 Q 0.15 0.4 0.5 0.2 Q 0.85 0.4 0.8 0.8'
      },
      {
        name: 'Taurus',
        // Bull horns / V shape with circle
        stars: [[0.2, 0.2], [0.8, 0.2], [0.5, 0.5], [0.35, 0.8], [0.65, 0.8]],
        path: 'M 0.2 0.2 L 0.5 0.5 L 0.8 0.2 M 0.35 0.65 A 0.15 0.15 0 1 1 0.65 0.65 A 0.15 0.15 0 1 1 0.35 0.65'
      },
      {
        name: 'Gemini',
        // Two parallel figures
        stars: [[0.3, 0.2], [0.7, 0.2], [0.3, 0.5], [0.7, 0.5], [0.3, 0.8], [0.7, 0.8]],
        path: 'M 0.2 0.2 L 0.8 0.2 M 0.3 0.2 L 0.3 0.8 M 0.7 0.2 L 0.7 0.8 M 0.2 0.8 L 0.8 0.8'
      },
      {
        name: 'Cancer',
        // Crab claws - sideways 69
        stars: [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]],
        path: 'M 0.5 0.25 A 0.2 0.2 0 1 0 0.3 0.5 M 0.5 0.75 A 0.2 0.2 0 1 0 0.7 0.5'
      },
      {
        name: 'Leo',
        // Lion's mane curve
        stars: [[0.2, 0.3], [0.5, 0.2], [0.8, 0.4], [0.6, 0.6], [0.3, 0.8]],
        path: 'M 0.2 0.5 Q 0.2 0.2 0.5 0.2 Q 0.8 0.2 0.8 0.5 Q 0.8 0.7 0.5 0.6 L 0.3 0.85'
      },
      {
        name: 'Virgo',
        // M with extended tail
        stars: [[0.2, 0.2], [0.35, 0.5], [0.5, 0.2], [0.65, 0.5], [0.8, 0.2], [0.75, 0.8]],
        path: 'M 0.2 0.7 L 0.2 0.2 L 0.35 0.5 L 0.5 0.2 L 0.65 0.5 L 0.8 0.2 L 0.8 0.6 Q 0.9 0.9 0.6 0.85'
      },
      {
        name: 'Libra',
        // Scales
        stars: [[0.2, 0.4], [0.5, 0.4], [0.8, 0.4], [0.5, 0.8]],
        path: 'M 0.2 0.5 L 0.8 0.5 M 0.5 0.5 L 0.5 0.8 M 0.2 0.3 Q 0.35 0.2 0.5 0.3 Q 0.65 0.2 0.8 0.3'
      },
      {
        name: 'Scorpio',
        // Scorpion with stinger
        stars: [[0.2, 0.3], [0.35, 0.5], [0.5, 0.3], [0.65, 0.5], [0.8, 0.3], [0.85, 0.7]],
        path: 'M 0.2 0.7 L 0.2 0.2 L 0.35 0.5 L 0.5 0.2 L 0.65 0.5 L 0.8 0.2 L 0.8 0.6 L 0.9 0.7 L 0.85 0.6'
      },
      {
        name: 'Sagittarius',
        // Arrow
        stars: [[0.2, 0.8], [0.8, 0.2], [0.6, 0.2], [0.8, 0.4]],
        path: 'M 0.2 0.8 L 0.8 0.2 M 0.55 0.2 L 0.8 0.2 L 0.8 0.45 M 0.4 0.4 L 0.5 0.6 M 0.4 0.6 L 0.5 0.4'
      },
      {
        name: 'Capricorn',
        // Sea-goat curve
        stars: [[0.3, 0.3], [0.5, 0.2], [0.7, 0.4], [0.8, 0.7], [0.5, 0.8]],
        path: 'M 0.25 0.5 Q 0.3 0.2 0.6 0.25 Q 0.85 0.3 0.8 0.6 Q 0.75 0.85 0.4 0.75 Q 0.5 0.6 0.7 0.7'
      },
      {
        name: 'Aquarius',
        // Water waves
        stars: [[0.2, 0.4], [0.4, 0.35], [0.6, 0.45], [0.8, 0.4], [0.2, 0.6], [0.8, 0.6]],
        path: 'M 0.15 0.4 Q 0.3 0.3 0.4 0.4 Q 0.5 0.5 0.6 0.4 Q 0.7 0.3 0.85 0.4 M 0.15 0.6 Q 0.3 0.5 0.4 0.6 Q 0.5 0.7 0.6 0.6 Q 0.7 0.5 0.85 0.6'
      },
      {
        name: 'Pisces',
        // Two fish connected
        stars: [[0.25, 0.3], [0.75, 0.7], [0.5, 0.5]],
        path: 'M 0.15 0.35 A 0.12 0.12 0 1 1 0.35 0.35 A 0.12 0.12 0 1 1 0.15 0.35 M 0.25 0.35 L 0.5 0.5 L 0.75 0.65 M 0.65 0.65 A 0.12 0.12 0 1 1 0.85 0.65 A 0.12 0.12 0 1 1 0.65 0.65'
      }
    ];
  }

  initConstellations() {
    this.zodiacData = this.getZodiacData();
    this.currentConstellation = null;
    this.constellationState = 'idle'; // idle, fading_in, visible, drawing, fading_out
    this.stateTimer = 0;
    this.lineProgress = 0;

    // Timing (in frames at ~60fps)
    this.idleDuration = 300;        // 5 seconds between constellations
    this.fadeInDuration = 120;      // 2 seconds fade in stars
    this.visibleDuration = 60;      // 1 second stars visible before drawing
    this.drawDuration = 90;         // 1.5 seconds to draw lines
    this.fadeOutDuration = 180;     // 3 seconds fade out

    this.scheduleNextConstellation();
  }

  scheduleNextConstellation() {
    // Pick random zodiac
    const randomIndex = Math.floor(Math.random() * this.zodiacData.length);
    const zodiac = this.zodiacData[randomIndex];

    // Random position and size
    const scale = 80 + Math.random() * 60; // 80-140px base size
    const x = scale + Math.random() * (this.width - scale * 2);
    const y = scale + Math.random() * (this.height - scale * 2);

    this.currentConstellation = {
      ...zodiac,
      x,
      y,
      scale,
      starOpacity: 0,
      lineOpacity: 0
    };

    this.constellationState = 'fading_in';
    this.stateTimer = 0;
    this.lineProgress = 0;
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width; // * window.devicePixelRatio;
    this.canvas.height = this.height; // * window.devicePixelRatio;
    // this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.generateStars();
  }

  generateStars() {
    this.stars = [];
    const layers = [
      { count: 150, size: [0.5, 0.5], opacity: [0.3, 0.3], layer: 1 },
      { count: 100, size: [0.8, 0.7], opacity: [0.5, 0.3], layer: 2 },
      { count: 50, size: [1.0, 1.0], opacity: [0.7, 0.3], layer: 3 }
    ];

    layers.forEach(config => {
      for (let i = 0; i < config.count; i++) {
        this.stars.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          baseX: 0,
          baseY: 0,
          size: config.size[0] + Math.random() * config.size[1],
          baseOpacity: config.opacity[0] + Math.random() * config.opacity[1],
          opacity: 0, // Will be set in update
          twinkleSpeed: 0.0005 + Math.random() * 0.001,
          layer: config.layer
        });
      }
    });

    this.stars.forEach(star => {
      star.baseX = star.x;
      star.baseY = star.y;
      star.opacity = star.baseOpacity;
    });
  }

  drawAtmosphere() {
    const gradient = this.ctx.createLinearGradient(0, this.height, this.width, 0);
    gradient.addColorStop(0, 'rgba(140, 140, 180, 0)');
    gradient.addColorStop(0.35, 'rgba(140, 140, 180, 0.08)');
    gradient.addColorStop(0.5, 'rgba(140, 140, 180, 0.12)');
    gradient.addColorStop(0.65, 'rgba(140, 140, 180, 0.08)');
    gradient.addColorStop(1, 'rgba(140, 140, 180, 0)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  createShootingStar() {
    const x = Math.random() * this.width;
    const y = Math.random() * (this.height * 0.5);
    const angle = (Math.PI / 4) + (Math.random() * Math.PI / 12);
    const speed = 3 + Math.random() * 2;
    const length = 50 + Math.random() * 30;
    const duration = 1000 + Math.random() * 1000;

    this.shootingStars.push({
      x, y, angle, speed, length,
      startTime: Date.now(),
      duration,
      opacity: 1
    });
  }

  updateShootingStars() {
    const now = Date.now();
    this.shootingStars = this.shootingStars.filter(star => {
      const elapsed = now - star.startTime;
      star.x += Math.cos(star.angle) * star.speed;
      star.y += Math.sin(star.angle) * star.speed;
      star.opacity = Math.max(0, 1 - (elapsed / star.duration));
      return star.opacity > 0 && star.x < this.width + 100 && star.y < this.height + 100;
    });
  }

  drawShootingStars() {
    this.shootingStars.forEach(star => {
      const endX = star.x - Math.cos(star.angle) * star.length;
      const endY = star.y - Math.sin(star.angle) * star.length;

      const gradient = this.ctx.createLinearGradient(star.x, star.y, endX, endY);
      gradient.addColorStop(0, `rgba(220, 230, 255, ${star.opacity})`);
      gradient.addColorStop(1, `rgba(220, 230, 255, 0)`);

      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(star.x, star.y);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
    });
  }

  updateConstellations() {
    this.stateTimer++;

    // Handle idle state (no constellation showing)
    if (this.constellationState === 'idle') {
      if (this.stateTimer >= this.idleDuration) {
        this.scheduleNextConstellation();
      }
      return;
    }

    if (!this.currentConstellation) return;

    const c = this.currentConstellation;

    switch (this.constellationState) {

      case 'fading_in':
        c.starOpacity = Math.min(1, this.stateTimer / this.fadeInDuration);
        if (this.stateTimer >= this.fadeInDuration) {
          this.constellationState = 'visible';
          this.stateTimer = 0;
        }
        break;

      case 'visible':
        c.starOpacity = 1;
        if (this.stateTimer >= this.visibleDuration) {
          this.constellationState = 'drawing';
          this.stateTimer = 0;
        }
        break;

      case 'drawing':
        c.starOpacity = 1;
        this.lineProgress = Math.min(1, this.stateTimer / this.drawDuration);
        c.lineOpacity = this.lineProgress;
        if (this.stateTimer >= this.drawDuration) {
          this.constellationState = 'fading_out';
          this.stateTimer = 0;
        }
        break;

      case 'fading_out':
        const fadeProgress = this.stateTimer / this.fadeOutDuration;
        c.starOpacity = 1 - fadeProgress;
        c.lineOpacity = 1 - fadeProgress;
        if (this.stateTimer >= this.fadeOutDuration) {
          this.constellationState = 'idle';
          this.stateTimer = 0;
          this.currentConstellation = null;
        }
        break;
    }
  }

  // Parse and draw SVG path with progress (0-1)
  drawPathWithProgress(path, x, y, scale, progress, opacity) {
    const ctx = this.ctx;
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Simple path parser for M, L, Q, A commands
    const commands = path.match(/[MLQA][^MLQA]*/gi) || [];
    const totalCommands = commands.length;
    const visibleCommands = Math.ceil(totalCommands * progress);

    let currentX = 0, currentY = 0;

    ctx.beginPath();

    for (let i = 0; i < visibleCommands; i++) {
      const cmd = commands[i].trim();
      const type = cmd[0].toUpperCase();
      const nums = cmd.slice(1).trim().split(/[\s,]+/).map(parseFloat);

      // Scale coordinates
      const sx = (n) => x + n * scale;
      const sy = (n) => y + n * scale;

      switch (type) {
        case 'M':
          currentX = nums[0];
          currentY = nums[1];
          ctx.moveTo(sx(currentX), sy(currentY));
          break;
        case 'L':
          currentX = nums[0];
          currentY = nums[1];
          ctx.lineTo(sx(currentX), sy(currentY));
          break;
        case 'Q':
          ctx.quadraticCurveTo(sx(nums[0]), sy(nums[1]), sx(nums[2]), sy(nums[3]));
          currentX = nums[2];
          currentY = nums[3];
          break;
        case 'A':
          // Simplified arc - draw as circle approximation
          const rx = nums[0] * scale;
          const ry = nums[1] * scale;
          const endX = nums[5];
          const endY = nums[6];
          // Draw arc to endpoint
          const cx = (currentX + endX) / 2;
          const cy = (currentY + endY) / 2;
          ctx.arc(sx(cx), sy(cy), rx, 0, Math.PI * 2);
          currentX = endX;
          currentY = endY;
          break;
      }
    }

    ctx.stroke();
  }

  drawConstellations(mouseX, mouseY) {
    if (!this.currentConstellation) return;

    const c = this.currentConstellation;
    if (c.starOpacity <= 0) return;

    const ctx = this.ctx;

    // Apply subtle parallax
    const parallaxAmount = 5;
    const px = c.x + (mouseX || 0) * parallaxAmount;
    const py = c.y + (mouseY || 0) * parallaxAmount;

    // Draw the zodiac symbol path (lines)
    if (c.lineOpacity > 0) {
      this.drawPathWithProgress(c.path, px, py, c.scale, this.lineProgress, c.lineOpacity);
    }

    // Draw stars
    c.stars.forEach(([nx, ny], i) => {
      const starX = px + nx * c.scale;
      const starY = py + ny * c.scale;
      const size = 2 + Math.random() * 0.5;

      // Twinkle
      const twinkle = Math.sin(this.time * 2 + i * 1.5) * 0.15;
      const finalOpacity = c.starOpacity * (0.7 + twinkle);

      ctx.beginPath();
      ctx.arc(starX, starY, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `rgba(255, 255, 255, ${finalOpacity * 0.8})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  update(mouseX, mouseY) {
    this.time += 0.01;
    this.rotation += 0.1 / 60 / 60; // Slow rotation
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.updateConstellations();

    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const rotRad = (this.rotation * Math.PI) / 180;

    this.stars.forEach(star => {
      // Twinkle
      const twinkle = Math.sin(this.time * star.twinkleSpeed) * 0.2;
      star.opacity = Math.max(0, Math.min(1, star.baseOpacity + twinkle));

      // Rotation
      const relX = star.baseX - centerX;
      const relY = star.baseY - centerY;
      const rotatedX = relX * Math.cos(rotRad) - relY * Math.sin(rotRad);
      const rotatedY = relX * Math.sin(rotRad) + relY * Math.cos(rotRad);
      const newBaseX = rotatedX + centerX;
      const newBaseY = rotatedY + centerY;

      // Parallax
      const parallaxAmount = star.layer === 1 ? 5 : star.layer === 2 ? 15 : 30;
      const targetX = newBaseX + mouseX * parallaxAmount;
      const targetY = newBaseY + mouseY * parallaxAmount;

      star.x += (targetX - star.x) * 0.1;
      star.y += (targetY - star.y) * 0.1;
    });

    this.updateShootingStars();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawAtmosphere();

    // Draw constellations behind regular stars
    this.drawConstellations(this.mouseX || 0, this.mouseY || 0);

    this.stars.forEach(star => {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      this.ctx.shadowBlur = star.size * 1.5;
      this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    });

    this.drawShootingStars();
  }
}
