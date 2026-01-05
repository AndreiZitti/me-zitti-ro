export class ConstellationManager {
  constructor() {
    this.tripElements = [];
  }

  // Called after trip stars are created
  initialize(tripStars) {
    this.tripElements = tripStars;
  }

  // Update (for parallax effect - no-op now that hub is removed)
  updateHubPosition(offsetX, offsetY) {
    // Hub removed - no-op
  }

  // Called each frame (for future use if needed)
  update() {}
}
