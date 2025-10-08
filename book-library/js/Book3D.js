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
    this.coverMesh = null; // Separate mesh for animated cover
    this.coverPivot = null; // Pivot point for cover rotation (at spine edge)
    this.pagesMesh = null; // Pages that show when book opens
    this.originalPosition = new THREE.Vector3(...position);
    this.originalRotation = new THREE.Euler(0, 0, 0);
    this.hoverPosition = null; // Will be set on hover
    this.isHovered = false;
    this.isBookOpen = false; // Track if book content is open

    // Don't call createMesh here - it will be called from bookshelf3D
  }

  async createMesh() {
    // Create book group to hold all parts
    this.mesh = new THREE.Group();

    // Get color based on category
    const color = this.getCategoryColor(this.bookData.category);

    // Create pages texture (thin lines to simulate pages)
    const pagesTexture = this.createPagesTexture();
    const pagesTexturedMaterial = new THREE.MeshStandardMaterial({
      map: pagesTexture,
      roughness: 0.9,
      metalness: 0.0
    });

    // Create the main book body (pages block)
    await this.createPagesBlock(color, pagesTexturedMaterial);

    // Create the animated cover
    await this.createCover(color, pagesTexturedMaterial);

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

  createPagesTexture() {
    const pagesCanvas = document.createElement('canvas');
    pagesCanvas.width = 512;
    pagesCanvas.height = 512;
    const ctx = pagesCanvas.getContext('2d');

    // Base paper color
    ctx.fillStyle = '#F5F5DC';
    ctx.fillRect(0, 0, 512, 512);

    // Draw thin horizontal lines to simulate individual pages
    ctx.strokeStyle = '#E8E8D0';
    ctx.lineWidth = 1;
    for (let i = 0; i < 512; i += 3) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(pagesCanvas);
  }

  async createPagesBlock(color, pagesTexturedMaterial) {
    // ====================================================================
    // PAGES BLOCK - The main book body containing the pages
    // ====================================================================
    // Book orientation on shelf:
    //   - LEFT (-X): SPINE (outward facing, colored, with text)
    //   - RIGHT (+X): Right edge (colored)
    //   - FRONT (+Z): Pages (white, visible when cover opens)
    //   - BACK (-Z): Back cover (colored)
    //   - TOP (+Y): Page edges (white)
    //   - BOTTOM (-Y): Page edges (white)
    // ====================================================================

    // Pages block geometry (slightly smaller depth to account for cover)
    const pagesGeometry = new THREE.BoxGeometry(
      this.dimensions.width,
      this.dimensions.height,
      this.dimensions.depth * 0.95 // Slightly shallower for cover thickness
    );

    const spineMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.7,
      metalness: 0.1
    });

    const backCoverMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.7,
      metalness: 0.1
    });

    const rightEdgeMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.7,
      metalness: 0.1
    });

    // Materials for pages block
    // BoxGeometry face order: right, left, top, bottom, front, back
    const pagesMaterials = [
      rightEdgeMaterial,                  // right (+X) - RIGHT EDGE (colored)
      spineMaterial,                      // left (-X) - SPINE (colored, outward facing)
      pagesTexturedMaterial.clone(),      // top (+Y) - PAGE EDGES (white)
      pagesTexturedMaterial.clone(),      // bottom (-Y) - PAGE EDGES (white)
      pagesTexturedMaterial.clone(),      // front (+Z) - PAGES (white, visible when cover opens)
      backCoverMaterial                   // back (-Z) - BACK COVER (colored)
    ];

    this.pagesMesh = new THREE.Mesh(pagesGeometry, pagesMaterials);
    this.pagesMesh.castShadow = true;
    this.pagesMesh.receiveShadow = true;

    // Position pages block slightly back to make room for cover
    this.pagesMesh.position.z = -this.dimensions.depth * 0.025;

    this.mesh.add(this.pagesMesh);
  }

  async createCover(color, pagesTexturedMaterial) {
    // ====================================================================
    // COVER - Thin animated front cover that rotates open
    // ====================================================================
    // Cover orientation on shelf:
    //   - FRONT (+Z): Cover image/color (outward facing)
    //   - BACK (-Z): Inner cover (white/cream, visible when opened)
    //   - LEFT (-X): Spine edge (where cover attaches)
    //   - All edges: Colored
    // Rotation: Opens by rotating around X-axis (swings left)
    // ====================================================================

    // Cover is a thin box that will rotate open
    // Cover thickness is along Z-axis (depth dimension)
    const coverThickness = this.dimensions.depth * 0.05; // Thin cover (5% of depth)
    const coverGeometry = new THREE.BoxGeometry(
      this.dimensions.width,
      this.dimensions.height,
      coverThickness
    );

    // Try to load cover image if available
    let frontCoverMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.7,
      metalness: 0.1
    });

    if (this.bookData.coverImageURL) {
      try {
        const texture = await this.loadCoverTexture(this.bookData.coverImageURL);
        frontCoverMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.7,
          metalness: 0.1
        });
      } catch (error) {
        console.log(`Failed to load cover for ${this.bookData.title}, using color`);
      }
    }

    const coverBackMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.7,
      metalness: 0.1
    });

    const innerCoverMaterial = new THREE.MeshStandardMaterial({
      color: 0xF5F5DC, // White/cream for inner cover
      roughness: 0.8,
      metalness: 0.0
    });

    // Materials for cover
    // Order: right, left, top, bottom, front, back
    // Cover is on front (+Z), will rotate around left edge (-X)
    const coverMaterials = [
      coverBackMaterial.clone(),     // right edge
      coverBackMaterial.clone(),     // left edge (spine side)
      coverBackMaterial.clone(),     // top edge
      coverBackMaterial.clone(),     // bottom edge
      frontCoverMaterial,            // front (+Z) - cover image facing forward
      innerCoverMaterial             // back (-Z) - inner cover (white/cream)
    ];

    this.coverMesh = new THREE.Mesh(coverGeometry, coverMaterials);
    this.coverMesh.castShadow = true;
    this.coverMesh.receiveShadow = true;

    // Create first page (attached to cover, rotates with it)
    const firstPageThickness = coverThickness * 0.3; // Thinner than cover
    const firstPageGeometry = new THREE.BoxGeometry(
      this.dimensions.width,
      this.dimensions.height,
      firstPageThickness
    );

    // First page materials - white/cream on both sides
    const firstPageMaterial = new THREE.MeshStandardMaterial({
      color: 0xF5F5DC,
      roughness: 0.9,
      metalness: 0.0
    });

    const firstPageMaterials = [
      firstPageMaterial.clone(),  // right edge
      firstPageMaterial.clone(),  // left edge
      firstPageMaterial.clone(),  // top edge
      firstPageMaterial.clone(),  // bottom edge
      firstPageMaterial.clone(),  // front (white page)
      firstPageMaterial.clone()   // back (white page)
    ];

    this.firstPageMesh = new THREE.Mesh(firstPageGeometry, firstPageMaterials);
    this.firstPageMesh.castShadow = true;
    this.firstPageMesh.receiveShadow = true;

    // Create a pivot group for the cover + first page to rotate together
    this.coverPivot = new THREE.Group();

    // Position pivot at the LEFT EDGE of where the cover will be
    // This is the spine side (-X) at the front (+Z)
    this.coverPivot.position.set(
      -this.dimensions.width / 2,  // Left edge (spine)
      0,                            // Center Y
      (this.dimensions.depth - coverThickness) / 2  // Front Z position
    );

    // Position cover relative to pivot
    // Cover's left edge should be at pivot point (x=0 in pivot space)
    // So cover center is at +width/2
    this.coverMesh.position.set(
      this.dimensions.width / 2,  // Offset right from pivot
      0,                           // Center Y
      0                            // Same Z as pivot
    );

    // Position first page just behind the cover (more negative Z in pivot space)
    this.firstPageMesh.position.set(
      this.dimensions.width / 2,   // Same X as cover
      0,                            // Center Y
      -(coverThickness / 2 + firstPageThickness / 2 + 0.01)  // Behind cover
    );

    // Add both cover and first page to pivot, then pivot to book
    this.coverPivot.add(this.coverMesh);
    this.coverPivot.add(this.firstPageMesh);
    this.mesh.add(this.coverPivot);

    console.log('Cover pivot created at:', this.coverPivot.position);
    console.log('Cover mesh offset:', this.coverMesh.position);
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

    // Rotate text 90 degrees (so it reads top to bottom)
    context.rotate(Math.PI / 2);

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

  loadCoverTexture(url) {
    return new Promise((resolve, reject) => {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        url,
        (texture) => {
          resolve(texture);
        },
        undefined,
        (error) => {
          reject(error);
        }
      );
    });
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

  // Hover animation - tilt book out slightly
  animateHoverIn() {
    this.isHovered = true;

    // Calculate hover position - pull book forward (positive Z) slightly
    this.hoverPosition = this.originalPosition.clone();
    this.hoverPosition.z += 0.8; // Pull out 0.8 units forward

    this.targetPosition = this.hoverPosition.clone();
    this.targetRotation = this.originalRotation.clone();
    this.isAnimating = true;
  }

  animateHoverOut() {
    this.isHovered = false;

    // Return to original position
    this.targetPosition = this.originalPosition.clone();
    this.targetRotation = this.originalRotation.clone();
    this.isAnimating = true;
  }

  // Book opening animation - cover rotates to the left
  toggleBookOpen() {
    console.log('toggleBookOpen called, current state:', this.isBookOpen);
    console.log('coverPivot exists:', !!this.coverPivot);

    this.isBookOpen = !this.isBookOpen;

    if (this.isBookOpen) {
      this.openBookCover();
    } else {
      this.closeBookCover();
    }
  }

  openBookCover() {
    console.log('openBookCover called, coverPivot:', this.coverPivot);
    if (!this.coverPivot) {
      console.error('No coverPivot found!');
      return;
    }

    this.isBookOpen = true;
    // Cover pivot rotates around Y-axis (vertical axis)
    // When book is facing user, this swings the cover to the left
    // Rotate -160 degrees to open
    this.coverTargetRotation = -Math.PI * 0.89; // -160 degrees
    console.log('Cover target rotation set to:', this.coverTargetRotation);
  }

  closeBookCover() {
    if (!this.coverPivot) return;

    this.isBookOpen = false;
    // Return cover to closed position
    this.coverTargetRotation = 0;
    console.log('Closing book cover');
  }

  // Animation methods - smooth transitions
  animateOpen(targetPosition, targetRotation, duration = 500) {
    this.isHovered = false;

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
    this.isHovered = false;

    // Close the book cover when returning to shelf
    this.closeBookCover();
  }

  // Update method to be called each frame (from render loop)
  update() {
    // Animate book position and rotation
    if (this.isAnimating) {
      if (this.targetPosition && this.targetRotation) {
        // Lerp (linear interpolation) for smooth movement
        // Slower animation for more graceful movement
        const lerpFactor = this.isHovered ? 0.08 : 0.05;

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

    // Animate cover opening/closing
    if (this.coverPivot && this.coverTargetRotation !== undefined) {
      const coverLerpFactor = 0.08;
      const currentRotation = this.coverPivot.rotation.y;
      const diff = this.coverTargetRotation - currentRotation;

      if (Math.abs(diff) > 0.01) {
        this.coverPivot.rotation.y += diff * coverLerpFactor;
        // Log occasionally to avoid spam
        if (Math.random() < 0.05) {
          console.log('Animating cover - current:', currentRotation.toFixed(3), 'target:', this.coverTargetRotation.toFixed(3), 'diff:', diff.toFixed(3));
        }
      } else {
        this.coverPivot.rotation.y = this.coverTargetRotation;
        console.log('Cover animation complete at:', this.coverTargetRotation);
      }
    }
  }
}

export default Book3D;
