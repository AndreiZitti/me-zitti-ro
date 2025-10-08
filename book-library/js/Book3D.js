// Book3D.js - 3D Book Component
import * as THREE from 'three';

class Book3D {
  constructor(bookData, position, dimensions) {
    this.bookData = bookData;
    this.position = position;
    this.dimensions = dimensions || {
      width: 0.3 + Math.random() * 0.15, // 0.3-0.45 units
      height: 3.6 + Math.random() * 0.8,  // 3.6-4.4 units
      depth: 2.5 + Math.random() * 1.0    // 2.5-3.5 units
    };

    this.mesh = null;
    this.originalPosition = new THREE.Vector3(...position);
    this.originalRotation = new THREE.Euler(0, 0, 0);

    this.createMesh();
  }

  createMesh() {
    // Create book group to hold all parts
    this.mesh = new THREE.Group();

    // Create book geometry
    const bookGeometry = new THREE.BoxGeometry(
      this.dimensions.width,
      this.dimensions.height,
      this.dimensions.depth
    );

    // Get color based on category
    const color = this.getCategoryColor(this.bookData.category);

    // Create book material
    const bookMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.7,
      metalness: 0.1
    });

    // Create book mesh
    const bookMesh = new THREE.Mesh(bookGeometry, bookMaterial);
    bookMesh.castShadow = true;
    bookMesh.receiveShadow = true;

    // Add to group
    this.mesh.add(bookMesh);

    // Add spine text
    this.addSpineText();

    // Set position
    this.mesh.position.copy(this.originalPosition);

    // Store book data reference
    this.mesh.userData = {
      bookData: this.bookData,
      book3D: this
    };
  }

  addSpineText() {
    // Create canvas for text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas size (higher for better quality)
    canvas.width = 512;
    canvas.height = 2048;

    // Fill background (transparent)
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Set text style
    context.fillStyle = 'white';
    context.font = 'bold 60px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Save context state
    context.save();

    // Translate to center of canvas
    context.translate(canvas.width / 2, canvas.height / 2);

    // Rotate text 90 degrees (so it reads bottom to top)
    context.rotate(-Math.PI / 2);

    // Draw title
    const title = this.bookData.title.length > 30
      ? this.bookData.title.substring(0, 27) + '...'
      : this.bookData.title;

    context.fillText(title, 0, -100);

    // Draw author (smaller)
    context.font = 'italic 40px Arial';
    context.fillText(this.bookData.author, 0, 100);

    // Restore context
    context.restore();

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Create material with texture
    const textMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    });

    // Create plane for text (positioned on the spine - left side of book)
    const textGeometry = new THREE.PlaneGeometry(
      this.dimensions.depth * 0.95,
      this.dimensions.height * 0.95
    );

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Position on the left side (spine)
    textMesh.position.x = -this.dimensions.width / 2 + 0.01; // Slightly offset from surface
    textMesh.rotation.y = -Math.PI / 2; // Face outward

    this.mesh.add(textMesh);
  }

  getCategoryColor(category) {
    const categoryColors = {
      'ai': 0x4a90e2,        // Blue
      'self-help': 0xf39c12, // Orange
      'business': 0x27ae60,  // Green
      'science': 0x9b59b6,   // Purple
      'horror': 0xe74c3c,    // Red
      'dystopian': 0x34495e, // Dark gray
    };

    return categoryColors[category] || 0x95a5a6; // Default gray
  }

  // Animation methods - smooth transitions
  animateOpen(targetPosition, targetRotation, duration = 500) {
    // Set target properties for smooth animation in render loop
    this.targetPosition = targetPosition.clone();
    this.targetRotation = targetRotation.clone();
    this.isAnimating = true;
  }

  animateClose(duration = 500) {
    // Set target to original position for smooth animation
    this.targetPosition = this.originalPosition.clone();
    this.targetRotation = this.originalRotation.clone();
    this.isAnimating = true;
  }

  // Update method to be called each frame (from render loop)
  update() {
    if (!this.isAnimating) return;

    if (!this.targetPosition || !this.targetRotation) {
      this.isAnimating = false;
      return;
    }

    // Lerp (linear interpolation) for smooth movement
    const lerpFactor = 0.1;

    this.mesh.position.lerp(this.targetPosition, lerpFactor);
    this.mesh.rotation.x += (this.targetRotation.x - this.mesh.rotation.x) * lerpFactor;
    this.mesh.rotation.y += (this.targetRotation.y - this.mesh.rotation.y) * lerpFactor;
    this.mesh.rotation.z += (this.targetRotation.z - this.mesh.rotation.z) * lerpFactor;

    // Check if we're close enough to target (stop animating)
    const positionDistance = this.mesh.position.distanceTo(this.targetPosition);
    if (positionDistance < 0.01) {
      this.mesh.position.copy(this.targetPosition);
      this.mesh.rotation.copy(this.targetRotation);
      this.isAnimating = false;
    }
  }
}

export default Book3D;
