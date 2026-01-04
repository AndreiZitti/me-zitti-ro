export class ConstellationManager {
  constructor() {
    this.hub = document.getElementById('central-hub');
    this.modal = document.getElementById('hub-modal');
    this.modalBackdrop = this.modal.querySelector('.hub-modal-backdrop');
    this.closeBtn = document.getElementById('close-hub-modal');
    this.tripElements = [];

    // Hub position (percentage-based, will convert to pixels)
    this.hubPosition = { x: 50, y: 50 };

    // Set up hub click to show modal
    this.hub.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showModal();
    });

    // Close modal when clicking backdrop
    this.modalBackdrop.addEventListener('click', () => {
      this.hideModal();
    });

    // Close button
    this.closeBtn.addEventListener('click', () => {
      this.hideModal();
    });

    // Close modal on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideModal();
      }
    });
  }

  showModal() {
    this.modal.classList.remove('hidden');
  }

  hideModal() {
    this.modal.classList.add('hidden');
  }

  // Called after trip stars are created
  initialize(tripStars) {
    this.tripElements = tripStars;
    this.setupHoverListeners();
  }

  setupHoverListeners() {
    this.tripElements.forEach((tripEl) => {
      tripEl.addEventListener('mouseenter', () => {
        this.hub.classList.add('revealed');
      });
      tripEl.addEventListener('mouseleave', () => {
        this.hub.classList.remove('revealed');
      });
    });
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
