// Satellite animation with black hole physics integration
const satelliteContainer = document.querySelector('.satellite').parentElement;
let satellites = [];
let satelliteIdCounter = 0;

// Satellite class
class Satellite {
  constructor() {
    this.id = satelliteIdCounter++;
    this.element = this.createSatelliteElement();
    this.x = -50;
    this.y = window.innerHeight * 0.5;
    this.vx = 2;
    this.vy = 0;
    this.inBlackHoleMode = false;
    this.angle = 0;
    this.randomizePosition();
  }

  createSatelliteElement() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('satellite');
    svg.setAttribute('viewBox', '0 0 138.66 65.33');
    svg.innerHTML = `
      <defs>
        <style>.cls-1,.cls-3,.cls-4{fill:#474747;}.cls-1,.cls-2,.cls-3,.cls-4,.cls-5{stroke:#686868;stroke-miterlimit:10;}.cls-1,.cls-2,.cls-5{stroke-width:2.4px;}.cls-2{fill:#686868;}.cls-3{stroke-width:2.55px;}.cls-4{stroke-width:2.46px;}.cls-5{fill:none;}</style>
      </defs>
      <rect class="cls-1" x="57.28" y="17.29" width="24.46" height="37.26"/><rect class="cls-1" x="57.28" y="48.26" width="24.46" height="6.29"/><rect class="cls-1" x="57.28" y="17.29" width="24.46" height="4.68"/><rect class="cls-2" x="63.24" y="27.1" width="12.8" height="15.41"/><rect class="cls-3" x="60.73" y="54.55" width="17.82" height="9.51"/><rect class="cls-4" x="87.53" y="21.96" width="49.91" height="23.69"/><rect class="cls-1" x="87.53" y="21.96" width="7.13" height="23.69"/><rect class="cls-1" x="94.66" y="21.96" width="7.13" height="23.69"/><rect class="cls-1" x="101.79" y="21.96" width="7.13" height="23.69"/><rect class="cls-1" x="108.92" y="21.96" width="7.13" height="23.69"/><rect class="cls-1" x="116.05" y="21.96" width="7.13" height="23.69"/><rect class="cls-1" x="123.18" y="21.96" width="7.13" height="23.69"/><rect class="cls-1" x="130.31" y="21.96" width="7.13" height="23.69"/><rect class="cls-4" x="1.23" y="21.96" width="49.91" height="23.69"/><rect class="cls-1" x="1.23" y="21.96" width="7.13" height="23.69"/><rect class="cls-1" x="8.36" y="21.96" width="7.13" height="23.69"/><rect class="cls-1" x="15.49" y="21.96" width="7.13" height="23.69"/><rect class="cls-1" x="22.62" y="21.96" width="7.13" height="23.69"/><rect class="cls-1" x="29.75" y="21.96" width="7.13" height="23.69"/><rect class="cls-1" x="36.88" y="21.96" width="7.13" height="23.69"/><rect class="cls-5" x="44.01" y="21.96" width="7.13" height="23.69"/><line class="cls-5" x1="51.14" y1="33.81" x2="57.28" y2="33.81"/><line class="cls-5" x1="87.53" y1="33.81" x2="81.74" y2="33.81"/><polygon class="cls-1" points="86.61 17.29 51.87 17.29 57.28 8.28 81.74 8.28 86.61 17.29"/><line class="cls-5" x1="69.51" y1="8.28" x2="69.51"/>
    `;
    document.body.appendChild(svg);
    return svg;
  }

  randomizePosition() {
    const sides = ['left', 'right', 'top', 'bottom'];
    const chosenSide = sides[Math.floor(Math.random() * sides.length)];

    if (chosenSide === 'left') {
      this.x = -50;
      this.y = window.innerHeight * (Math.random() * 0.5);
      this.vx = (2 + Math.random()) * 0.512;
      this.vy = (Math.random() - 0.5) * 0.5 * 0.512;
    } else if (chosenSide === 'right') {
      this.x = window.innerWidth + 50;
      this.y = window.innerHeight * (0.5 + Math.random() * 0.5);
      this.vx = -(2 + Math.random()) * 0.512;
      this.vy = (Math.random() - 0.5) * 0.5 * 0.512;
    } else if (chosenSide === 'top') {
      this.x = window.innerWidth * (Math.random() * 0.5);
      this.y = -50;
      this.vx = (Math.random() - 0.5) * 2 * 0.512;
      this.vy = (2 + Math.random()) * 0.512;
    } else {
      this.x = window.innerWidth * (0.5 + Math.random() * 0.5);
      this.y = window.innerHeight + 50;
      this.vx = (Math.random() - 0.5) * 2 * 0.512;
      this.vy = -(2 + Math.random()) * 0.512;
    }
  }

  update() {
    if (typeof blackHole !== 'undefined' && blackHole.active) {
      const dist = Math.sqrt(
        Math.pow(this.x - blackHole.mouse.x, 2) +
        Math.pow(this.y - blackHole.mouse.y, 2)
      );

      const ang = Math.atan2(
        blackHole.mouse.y - this.y,
        blackHole.mouse.x - this.x
      );

      const force = (50 * blackHole.blackHoleMass) / Math.pow(dist, 2);
      const ax = force * Math.cos(ang);
      const ay = force * Math.sin(ang);

      this.vx += 0.5 * ax;
      this.vy += 0.5 * ay;
      this.vx *= 0.95;
      this.vy *= 0.95;

      this.x += this.vx;
      this.y += this.vy;

      if (dist < blackHole.blackHoleMass + 10) {
        this.randomizePosition();
      }

      this.angle += Math.sqrt(this.vx * this.vx + this.vy * this.vy) * 2;
    } else {
      this.x += this.vx;
      this.y += this.vy;
      this.angle += 3;

      if (this.x > window.innerWidth + 100 ||
          this.x < -100 ||
          this.y > window.innerHeight + 100 ||
          this.y < -100) {
        return true; // Signal for removal
      }
    }

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.transform = `rotate(${this.angle}deg)`;
    return false;
  }

  remove() {
    this.element.remove();
  }
}

// Update all satellites
function updateSatellites() {
  satellites = satellites.filter(sat => {
    const shouldRemove = sat.update();
    if (shouldRemove) {
      sat.remove();
      // Schedule next satellite spawn 10 seconds after this one disappears
      setTimeout(spawnSatellite, 10000);
      return false;
    }
    return true;
  });
  requestAnimationFrame(updateSatellites);
}

// Spawn a new satellite
function spawnSatellite() {
  // Only spawn if there's no satellite currently on screen
  if (satellites.length === 0) {
    const sat = new Satellite();
    satellites.push(sat);
  }
}

// Initialize - spawn first satellite
spawnSatellite();
updateSatellites();
