// Image mappings for each trip folder
const tripImages = {
  Moon: ['BloodMoonClose.jpg', 'BloodMoonFar.jpg', 'smallmoon.JPG'],
  Sun: ['Sun.JPG'],
  Trip1: ['DoubleSun.JPG'],
  Trip2: ['StarCluster.JPG'],
  Trip3: ['Galaxy.JPG'],
  NGC_891: ['NGC_891.JPG', 'NGC_891_1.JPG', 'NGC_891_2.JPG']
};

export class TransitionManager {
  constructor(starField) {
    this.starField = starField;
    this.active = false;
    this.currentTrip = null;
    this.images = [];
    this.isTransitioning = false;

    // UI Elements
    this.detailView = document.getElementById('trip-detail-view');
    this.slideContainer = document.getElementById('carousel-slide');
    this.contentEl = document.getElementById('carousel-content');

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Close button
    const closeBtn = document.getElementById('close-detail');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.endTransition());
    }

    // Navigation buttons
    const nextBtn = document.querySelector('.carousel-next');
    const prevBtn = document.querySelector('.carousel-prev');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.next());
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prev());
    }

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.active) {
        this.endTransition();
      }
    });

    // Click outside to close
    this.detailView.addEventListener('click', (e) => {
      if (e.target === this.detailView) {
        this.endTransition();
      }
    });
  }

  startTransition(trip, starElement) {
    if (this.active) return;
    this.active = true;
    this.currentTrip = trip;

    // Get images for this trip
    this.images = tripImages[trip.folder] || [];

    // Build carousel
    this.buildCarousel(trip);

    // Populate content
    this.updateContent(trip);

    // Simple fade in - show detail view
    this.detailView.classList.remove('hidden');
  }

  buildCarousel(trip) {
    this.slideContainer.innerHTML = '';

    const basePath = `assets/Trips/${trip.folder}/`;
    const images = this.images.length > 0 ? this.images : ['placeholder.jpg'];

    // Helper to create an item
    const createItem = (imgSrc, imgIndex) => {
      const item = document.createElement('div');
      item.className = 'item';
      item.style.backgroundImage = `url(${basePath}${imgSrc})`;
      item.dataset.imgIndex = imgIndex;

      // Click on thumbnail to show that specific image
      item.addEventListener('click', (e) => {
        if (this.isTransitioning) return;

        const items = this.slideContainer.querySelectorAll('.item');
        const clickedIndex = Array.from(items).indexOf(e.currentTarget);

        // Only respond to thumbnail clicks (position 3+, index 2+)
        if (clickedIndex >= 2) {
          const movesNeeded = clickedIndex - 1;

          this.fadeAndSwap(() => {
            // Move items until clicked one is at position 2 (visible hero)
            for (let i = 0; i < movesNeeded; i++) {
              const firstItem = this.slideContainer.querySelector('.item');
              this.slideContainer.appendChild(firstItem);
            }
          });
        }
      });

      return item;
    };

    // For CodePen effect: item 1 is hidden behind item 2 (both fullscreen)
    // Add duplicate of first image as position 1 (will be behind)
    this.slideContainer.appendChild(createItem(images[0], 0));

    // Add all images
    images.forEach((img, idx) => {
      this.slideContainer.appendChild(createItem(img, idx));
    });
  }

  updateContent(trip) {
    document.getElementById('detail-title').textContent = trip.title;
    document.getElementById('detail-notes').textContent = trip.notes;
    document.getElementById('detail-date').textContent = trip.date;
    document.getElementById('detail-location').textContent = trip.location;

    // Restart animations by removing and re-adding content
    this.contentEl.style.animation = 'none';
    this.contentEl.offsetHeight; // Trigger reflow
    this.contentEl.style.animation = '';

    // Reset child animations
    const animatedEls = this.contentEl.querySelectorAll('.name, .des, .meta');
    animatedEls.forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = '';
    });
  }

  next() {
    if (this.isTransitioning) return;
    this.fadeAndSwap(() => {
      const items = this.slideContainer.querySelectorAll('.item');
      if (items.length > 0) {
        this.slideContainer.appendChild(items[0]);
      }
    });
  }

  prev() {
    if (this.isTransitioning) return;
    this.fadeAndSwap(() => {
      const items = this.slideContainer.querySelectorAll('.item');
      if (items.length > 0) {
        this.slideContainer.prepend(items[items.length - 1]);
      }
    });
  }

  fadeAndSwap(swapFn) {
    this.isTransitioning = true;

    // Fade out
    this.slideContainer.classList.add('fading');

    // After fade out, do the swap
    setTimeout(() => {
      swapFn();

      // Fade back in
      setTimeout(() => {
        this.slideContainer.classList.remove('fading');
        this.isTransitioning = false;
      }, 50);
    }, 300);
  }

  endTransition() {
    this.active = false;
    this.currentTrip = null;

    // Simple fade out
    this.detailView.classList.add('hidden');
  }
}
