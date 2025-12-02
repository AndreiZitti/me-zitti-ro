export class ConstellationManager {
  constructor() {
    this.svg = document.getElementById('constellation-lines');
    this.hub = document.getElementById('central-hub');
    this.tripElements = [];

    // Constellation elements
    this.constellationGroup = null;
    this.tempPoint = null;

    // Hub position (percentage-based, will convert to pixels)
    this.hubPosition = { x: 50, y: 50 };

    // Set up hub click
    this.hub.addEventListener('click', () => {
      window.open('https://instagram.com', '_blank');
    });
  }

  // Called after trip stars are created
  initialize(tripStars) {
    this.tripElements = tripStars;
    this.createConstellationElements();
    this.setupHoverListeners();
  }

  createConstellationElements() {
    // Clear existing
    this.svg.innerHTML = '';

    // Create group for constellation lines
    this.constellationGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.constellationGroup.setAttribute('class', 'constellation-group');
    this.svg.appendChild(this.constellationGroup);

    // Create 3 paths for the triangle
    this.linesToHub = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.lineToNearest = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.lineToTemp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.lineNearestToTemp = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    this.constellationGroup.appendChild(this.linesToHub);
    this.constellationGroup.appendChild(this.lineToNearest);
    this.constellationGroup.appendChild(this.lineToTemp);
    this.constellationGroup.appendChild(this.lineNearestToTemp);

    // Create temporary point element
    this.tempPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.tempPoint.setAttribute('r', '3');
    this.tempPoint.setAttribute('class', 'temp-point');
    this.constellationGroup.appendChild(this.tempPoint);
  }

  setupHoverListeners() {
    this.tripElements.forEach((tripEl, index) => {
      tripEl.addEventListener('mouseenter', () => {
        this.showConstellation(index);
        this.hub.classList.add('revealed');
      });
      tripEl.addEventListener('mouseleave', () => {
        this.hideConstellation();
        this.hub.classList.remove('revealed');
      });
    });
  }

  getElementCenter(el) {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  findNearestStar(index) {
    const hoveredPos = this.getElementCenter(this.tripElements[index]);
    let nearestIndex = -1;
    let nearestDist = Infinity;

    this.tripElements.forEach((el, i) => {
      if (i === index) return;
      const pos = this.getElementCenter(el);
      const dist = Math.hypot(pos.x - hoveredPos.x, pos.y - hoveredPos.y);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIndex = i;
      }
    });

    return nearestIndex;
  }

  calculateTempPoint(p1, p2) {
    // Create third point to form triangle
    // Position it perpendicular to the line between p1 and p2
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.hypot(dx, dy);

    // Perpendicular offset (smaller triangle)
    const perpX = -dy / length;
    const perpY = dx / length;
    const offset = Math.min(length * 0.4, 60); // 40% of distance or max 60px

    return {
      x: midX + perpX * offset,
      y: midY + perpY * offset
    };
  }

  showConstellation(hoveredIndex) {
    const hoveredPos = this.getElementCenter(this.tripElements[hoveredIndex]);
    const nearestIndex = this.findNearestStar(hoveredIndex);
    const nearestPos = this.getElementCenter(this.tripElements[nearestIndex]);
    const hubPos = this.getElementCenter(this.hub);
    const tempPos = this.calculateTempPoint(hoveredPos, nearestPos);

    // Line from hovered star to hub
    this.linesToHub.setAttribute('d', `M ${hoveredPos.x} ${hoveredPos.y} Q ${(hoveredPos.x + hubPos.x) / 2} ${(hoveredPos.y + hubPos.y) / 2 - 30} ${hubPos.x} ${hubPos.y}`);
    this.linesToHub.classList.add('visible');

    // Line from hovered star to nearest star
    this.lineToNearest.setAttribute('d', `M ${hoveredPos.x} ${hoveredPos.y} L ${nearestPos.x} ${nearestPos.y}`);
    this.lineToNearest.classList.add('visible');

    // Line from hovered star to temp point
    this.lineToTemp.setAttribute('d', `M ${hoveredPos.x} ${hoveredPos.y} L ${tempPos.x} ${tempPos.y}`);
    this.lineToTemp.classList.add('visible');

    // Line from nearest star to temp point
    this.lineNearestToTemp.setAttribute('d', `M ${nearestPos.x} ${nearestPos.y} L ${tempPos.x} ${tempPos.y}`);
    this.lineNearestToTemp.classList.add('visible');

    // Position temp point
    this.tempPoint.setAttribute('cx', tempPos.x);
    this.tempPoint.setAttribute('cy', tempPos.y);
    this.tempPoint.classList.add('visible');
  }

  hideConstellation() {
    this.linesToHub.classList.remove('visible');
    this.lineToNearest.classList.remove('visible');
    this.lineToTemp.classList.remove('visible');
    this.lineNearestToTemp.classList.remove('visible');
    this.tempPoint.classList.remove('visible');
  }

  // Update hub position (for parallax effect)
  updateHubPosition(offsetX, offsetY) {
    const baseX = (this.hubPosition.x / 100) * window.innerWidth;
    const baseY = (this.hubPosition.y / 100) * window.innerHeight;

    const parallaxAmount = 20;
    const newX = baseX + offsetX * parallaxAmount;
    const newY = baseY + offsetY * parallaxAmount;

    this.hub.style.left = `${newX}px`;
    this.hub.style.top = `${newY}px`;
  }

  // Called each frame (for future use if needed)
  update() {}
}
