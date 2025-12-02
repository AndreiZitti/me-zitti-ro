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

  update(mouseX, mouseY) {
    this.time += 0.01;
    this.rotation += 0.1 / 60 / 60; // Slow rotation

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
