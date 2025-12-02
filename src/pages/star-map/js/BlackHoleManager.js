export class BlackHoleManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.active = false;
    this.mass = 10;
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.particles = [];
    
    this.boundMouseMove = this.handleMouseMove.bind(this);
    
    // Setup UI
    this.toggleBtn = document.getElementById('black-hole-toggle');
    this.resetBtn = document.getElementById('black-hole-reset');
    this.setupUI();
  }

  setupUI() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.enter());
    }
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.exit());
    }
    this.drawIcon();
  }

  drawIcon() {
    const iconCanvas = document.getElementById('black-hole-icon');
    if (!iconCanvas) return;
    const ctx = iconCanvas.getContext('2d');
    const cx = 30, cy = 30, r = 10;
    
    ctx.clearRect(0, 0, 60, 60);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.strokeStyle = 'rgba(100, 50, 200, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  enter(initialX, initialY) {
    if (this.active) return;
    this.active = true;
    document.body.classList.add('black-hole-cursor');
    
    if (initialX !== undefined) {
      this.mouse.x = initialX;
      this.mouse.y = initialY;
    }

    this.toggleBtn?.classList.add('active', 'hidden');
    this.resetBtn?.classList.remove('hidden');
    
    this.canvas.addEventListener('mousemove', this.boundMouseMove);
  }

  exit() {
    if (!this.active) return;
    this.active = false;
    document.body.classList.remove('black-hole-cursor');
    
    this.toggleBtn?.classList.remove('active', 'hidden');
    this.resetBtn?.classList.add('hidden');
    
    this.canvas.removeEventListener('mousemove', this.boundMouseMove);
    this.particles = [];
    this.mass = 10;
    
    // Ideally we should signal main app to reset stars, but for now reload is a safe fallback for this destructive mode
    window.location.reload();
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  update(stars) {
    if (!this.active) return;
    
    // Initialize particles if needed
    if (this.particles.length === 0 && stars.length > 0) {
      this.particles = stars.map(star => ({
        starRef: star,
        vx: 0, vy: 0,
        hist: []
      }));
    }

    this.particles.forEach(p => {
      const dx = p.starRef.x - this.mouse.x;
      const dy = p.starRef.y - this.mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const angle = Math.atan2(dy, dx); // Angle FROM black hole TO star
      
      // Gravity
      const force = (100 * this.mass) / (dist * dist + 1); // +1 to avoid div by zero
      const ax = -Math.cos(angle) * force;
      const ay = -Math.sin(angle) * force;

      p.vx += ax;
      p.vy += ay;
      p.vx *= 0.95; // Friction
      p.vy *= 0.95;

      p.starRef.x += p.vx;
      p.starRef.y += p.vy;

      // Event horizon
      if (dist < this.mass) {
        // Respawn
        p.starRef.x = Math.random() * window.innerWidth;
        p.starRef.y = Math.random() * window.innerHeight;
        p.vx = 0;
        p.vy = 0;
        p.hist = [];
        this.mass += 0.1;
      }

      // Trail
      p.hist.push({x: p.starRef.x, y: p.starRef.y});
      if (p.hist.length > 5) p.hist.shift();
    });
  }

  draw() {
    if (!this.active) return;

    // Draw Black Hole
    this.ctx.beginPath();
    this.ctx.arc(this.mouse.x, this.mouse.y, this.mass, 0, Math.PI * 2);
    this.ctx.fillStyle = 'black';
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(100, 50, 200, 0.8)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Draw Trails
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 1;
    this.particles.forEach(p => {
      if (p.hist.length > 1) {
        this.ctx.beginPath();
        p.hist.forEach((pt, i) => {
          if (i === 0) this.ctx.moveTo(pt.x, pt.y);
          else this.ctx.lineTo(pt.x, pt.y);
        });
        this.ctx.stroke();
      }
    });
  }
}
