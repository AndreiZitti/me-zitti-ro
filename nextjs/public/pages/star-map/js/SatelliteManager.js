export class SatelliteManager {
  constructor() {
    this.satellites = [];
    this.idCounter = 0;
    this.container = document.body; // Or specific container
    
    // Start loop
    this.spawnSatellite();
    this.animate();
  }

  createSatelliteElement() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('satellite');
    svg.setAttribute('viewBox', '0 0 138.66 65.33');
    // Simplified content for brevity, full content should be here
    svg.innerHTML = `
      <defs>
        <style>.cls-1,.cls-3,.cls-4{fill:#474747;}.cls-1,.cls-2,.cls-3,.cls-4,.cls-5{stroke:#686868;stroke-miterlimit:10;}.cls-1,.cls-2,.cls-5{stroke-width:2.4px;}.cls-2{fill:#686868;}.cls-3{stroke-width:2.55px;}.cls-4{stroke-width:2.46px;}.cls-5{fill:none;}</style>
      </defs>
      <rect class="cls-1" x="57.28" y="17.29" width="24.46" height="37.26"/>
      <rect class="cls-4" x="87.53" y="21.96" width="49.91" height="23.69"/>
      <rect class="cls-4" x="1.23" y="21.96" width="49.91" height="23.69"/>
      <line class="cls-5" x1="51.14" y1="33.81" x2="57.28" y2="33.81"/>
      <line class="cls-5" x1="87.53" y1="33.81" x2="81.74" y2="33.81"/>
    `;
    // Add full SVG content if needed for visual fidelity
    this.container.appendChild(svg);
    return svg;
  }

  spawnSatellite() {
    if (this.satellites.length > 0) return;

    const sat = {
      id: this.idCounter++,
      element: this.createSatelliteElement(),
      x: -50,
      y: window.innerHeight * 0.5,
      vx: 2,
      vy: 0,
      angle: 0
    };

    this.randomizePosition(sat);
    this.satellites.push(sat);
  }

  randomizePosition(sat) {
    const sides = ['left', 'right', 'top', 'bottom'];
    const chosenSide = sides[Math.floor(Math.random() * sides.length)];

    if (chosenSide === 'left') {
      sat.x = -50;
      sat.y = window.innerHeight * (Math.random() * 0.5);
      sat.vx = (2 + Math.random()) * 0.5;
      sat.vy = (Math.random() - 0.5) * 0.25;
    } else if (chosenSide === 'right') {
      sat.x = window.innerWidth + 50;
      sat.y = window.innerHeight * (0.5 + Math.random() * 0.5);
      sat.vx = -(2 + Math.random()) * 0.5;
      sat.vy = (Math.random() - 0.5) * 0.25;
    } else if (chosenSide === 'top') {
      sat.x = window.innerWidth * (Math.random() * 0.5);
      sat.y = -50;
      sat.vx = (Math.random() - 0.5) * 0.25;
      sat.vy = (2 + Math.random()) * 0.5;
    } else {
      sat.x = window.innerWidth * (0.5 + Math.random() * 0.5);
      sat.y = window.innerHeight + 50;
      sat.vx = (Math.random() - 0.5) * 0.25;
      sat.vy = -(2 + Math.random()) * 0.5;
    }
  }

  update(blackHole) {
    this.satellites = this.satellites.filter(sat => {
      if (blackHole && blackHole.active) {
        const dx = sat.x - blackHole.mouse.x;
        const dy = sat.y - blackHole.mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const force = (50 * blackHole.mass) / (dist * dist);
        const angle = Math.atan2(blackHole.mouse.y - sat.y, blackHole.mouse.x - sat.x);
        
        sat.vx += Math.cos(angle) * force;
        sat.vy += Math.sin(angle) * force;
        sat.vx *= 0.95;
        sat.vy *= 0.95;

        if (dist < blackHole.mass + 10) {
          this.randomizePosition(sat);
        }
        sat.angle += Math.sqrt(sat.vx*sat.vx + sat.vy*sat.vy) * 2;
      } else {
        sat.angle += 0.5;
      }

      sat.x += sat.vx;
      sat.y += sat.vy;

      // Remove if far off screen
      if (sat.x < -200 || sat.x > window.innerWidth + 200 || 
          sat.y < -200 || sat.y > window.innerHeight + 200) {
        sat.element.remove();
        setTimeout(() => this.spawnSatellite(), 5000 + Math.random() * 5000);
        return false;
      }

      sat.element.style.left = `${sat.x}px`;
      sat.element.style.top = `${sat.y}px`;
      sat.element.style.transform = `rotate(${sat.angle}deg)`;
      return true;
    });
  }

  animate() {
    // This will be called by main loop
  }
}
