// Three.js 3D Bookshelf Scene Manager
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import Book3D from './Book3D.js';

class Bookshelf3D {
  constructor(containerElement, bookLibrary) {
    this.container = containerElement;
    this.bookLibrary = bookLibrary;
    this.books3D = []; // Array of { mesh, bookData, originalPosition, originalRotation }
    this.selectedBook = null;
    this.hoveredBook = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xE8DCC4); // Light beige

    // Get container dimensions
    const containerWidth = this.container.clientWidth;
    const containerHeight = this.container.clientHeight;

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      55, // FOV (slightly wider for better view)
      containerWidth / containerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 14); // Better angle to see books on shelf
    this.camera.lookAt(0, 0, 0);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(containerWidth, containerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.container.appendChild(this.renderer.domElement);

    // No camera controls - completely static view
    // OrbitControls disabled for static bookshelf view

    // Loading manager
    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onProgress = (url, loaded, total) => {
      console.log(`Loading: ${loaded}/${total} - ${url}`);
    };
    this.loadingManager.onLoad = () => {
      console.log('All assets loaded!');
      this.hideLoadingScreen();
    };

    // Texture loader
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);

    // Materials storage
    this.materials = {
      wood: null,
      bookCategories: {}
    };

    // Event listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('scroll', this.onScroll.bind(this));
    this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this));
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));

    // Initial camera Y position
    this.initialCameraY = this.camera.position.y;

    // Initialize
    this.init();
  }

  async init() {
    this.showLoadingScreen();

    // Load environment and textures
    await this.loadEnvironment();
    await this.loadWoodTextures();
    this.setupLighting();
    this.createShelves();
    this.createBooks();

    // Start render loop
    this.animate();
  }

  showLoadingScreen() {
    // Create a simple loading overlay
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-screen';
    loadingDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      z-index: 9999;
    `;
    loadingDiv.innerHTML = '<div>Loading 3D Bookshelf...</div>';
    document.body.appendChild(loadingDiv);
  }

  hideLoadingScreen() {
    const loadingDiv = document.getElementById('loading-screen');
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }

  async loadEnvironment() {
    // Skip HDRI loading - use simple color background (already set in constructor)
    console.log('Using simple background (no HDRI)');
    return Promise.resolve();
  }

  async loadWoodTextures() {
    return new Promise((resolve, reject) => {
      const basePath = 'assets/Dark Wood Texture/textures/';

      // Load diffuse (color) texture
      const diffuseTexture = this.textureLoader.load(
        basePath + 'dark_wood_diff_4k.jpg',
        () => console.log('Wood diffuse texture loaded')
      );

      // For now, we'll use a simple material
      // EXR files need special loader, so we'll skip normal/roughness for now
      // and add them in Phase 7 (Polish)

      this.materials.wood = new THREE.MeshStandardMaterial({
        map: diffuseTexture,
        roughness: 0.8,
        metalness: 0.1
      });

      resolve();
    });
  }

  setupLighting() {
    // Ambient light - soft overall illumination from HDRI
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Main directional light (sunlight from fireplace area)
    const dirLight = new THREE.DirectionalLight(0xffd9b3, 1.2);
    dirLight.position.set(5, 8, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.bias = -0.0001;
    this.scene.add(dirLight);

    // Warm point light from fireplace direction
    const fireplaceLight = new THREE.PointLight(0xff6633, 1.5, 30);
    fireplaceLight.position.set(-3, 2, 10);
    this.scene.add(fireplaceLight);

    // Rim light for depth
    const rimLight = new THREE.DirectionalLight(0xaaccff, 0.3);
    rimLight.position.set(-5, 3, -5);
    this.scene.add(rimLight);

    // Soft fill light from below
    const fillLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
    this.scene.add(fillLight);
  }

  createShelves() {
    const shelfCount = Math.ceil(this.bookLibrary.books.length / this.bookLibrary.booksPerShelf);
    const shelfSpacing = 4.5; // Vertical spacing between shelves
    const shelfThickness = 0.45; // 3x original thickness (0.15 * 3)

    for (let i = 0; i < shelfCount; i++) {
      const shelfGeometry = new THREE.BoxGeometry(8, shelfThickness, 4); // Shorter and narrower shelf
      const shelfMesh = new THREE.Mesh(shelfGeometry, this.materials.wood);

      // Position shelves vertically
      shelfMesh.position.y = -i * shelfSpacing;
      shelfMesh.position.z = 0; // Center shelf
      shelfMesh.receiveShadow = true;

      this.scene.add(shelfMesh);
    }
  }

  createBooks() {
    const books = this.bookLibrary.books;
    const booksPerShelf = this.bookLibrary.booksPerShelf;
    const shelfSpacing = 4.5;
    const shelfWidth = 7; // Usable width for books (reduced to match shorter shelf)
    const bookSpacing = 0.12; // Gap between books

    let currentShelf = 0;
    let xPosition = -shelfWidth / 2; // Start from left edge

    books.forEach((bookData, index) => {
      // Calculate which shelf this book belongs to
      const shelfIndex = Math.floor(index / booksPerShelf);

      // If we've moved to a new shelf, reset x position
      if (shelfIndex !== currentShelf) {
        currentShelf = shelfIndex;
        xPosition = -shelfWidth / 2;
      }

      // Consistent randomization per book (using book ID as seed)
      // This ensures each book gets unique but consistent dimensions
      const seed = bookData.id || index;
      const seededRandom = (seed) => {
        // Simple seeded random function
        const x = Math.sin(seed * 12345.6789) * 10000;
        return x - Math.floor(x);
      };

      const dimensions = {
        width: (0.18 + seededRandom(seed) * 0.12) * 2,  // 0.36 - 0.60 (spine width)
        height: 3.5 + seededRandom(seed + 100) * 1.0,   // 3.5 - 4.5 (book height)
        depth: 2.2 + seededRandom(seed + 200) * 0.8     // 2.2 - 3.0 (page width/book depth)
      };

      // Calculate Y position (shelf height)
      // Shelf is at -shelfIndex * shelfSpacing
      // Shelf thickness is 0.45, so top of shelf is at shelf.y + 0.225
      // Book bottom should be at shelf top
      // Since book position is at its center, book.y = shelfTop + book.height/2
      const shelfThickness = 0.45; // Same as in createShelves()
      const shelfY = -shelfIndex * shelfSpacing;
      const shelfTop = shelfY + shelfThickness / 2; // Half of shelf thickness
      const bookY = shelfTop + dimensions.height / 2;

      // Calculate Z position (books sitting on shelf)
      // Shelf depth is 4 units, centered at z=0
      // Books have depth of ~2.2-3.0 units, so they fit comfortably on shelf
      // Center books on the shelf at z=0
      const bookZ = 0;

      const position = [
        xPosition + dimensions.width / 2,
        bookY, // Properly positioned on shelf
        bookZ // Aligned with shelf back edge
      ];

      // Create book (async to support cover loading)
      const book3D = new Book3D(bookData, position, dimensions);

      // Store reference
      this.books3D.push(book3D);

      // Wait for mesh creation (async)
      book3D.createMesh().then(() => {
        // Add to scene after creation
        if (book3D.mesh) {
          this.scene.add(book3D.mesh);
          console.log(`Book added: ${bookData.title}`);
        }
      }).catch(error => {
        console.error(`Error creating book ${bookData.title}:`, error);
      });

      // Move x position for next book
      xPosition += dimensions.width + bookSpacing;
    });

    console.log(`Created ${this.books3D.length} books on ${currentShelf + 1} shelves`);
  }

  onWindowResize() {
    const containerWidth = this.container.clientWidth;
    const containerHeight = this.container.clientHeight;

    this.camera.aspect = containerWidth / containerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(containerWidth, containerHeight);
  }

  onScroll() {
    // Move camera down as user scrolls
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);

    // Calculate camera Y position based on scroll
    // Move camera down to show lower shelves
    const maxCameraMove = 20; // Maximum distance to move camera down
    this.camera.position.y = this.initialCameraY - (scrollPercent * maxCameraMove);
  }

  onMouseMove(event) {
    // Get canvas bounding rect for accurate mouse position
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Detect hover
    this.detectHover();
  }

  detectHover() {
    // Don't detect hover if a book is already selected
    if (this.selectedBook) return;

    // Raycast to detect book hover
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Get all book meshes
    const allBookMeshes = [];
    this.books3D.forEach(book3D => {
      if (book3D.mesh) {
        allBookMeshes.push(book3D.mesh);
      }
    });

    // Use recursive: true to detect all nested children
    const intersects = this.raycaster.intersectObjects(allBookMeshes, true);

    if (intersects.length > 0) {
      // Find which book was hovered
      let hoveredObject = intersects[0].object;

      // Traverse up to find parent book
      let hoveredBook = null;
      let currentObject = hoveredObject;
      while (currentObject && !hoveredBook) {
        hoveredBook = this.books3D.find(b => b.mesh === currentObject);
        currentObject = currentObject.parent;
      }

      if (hoveredBook && hoveredBook !== this.hoveredBook) {
        // New book hovered
        if (this.hoveredBook) {
          this.hoveredBook.animateHoverOut();
        }
        this.hoveredBook = hoveredBook;
        this.hoveredBook.animateHoverIn();
      }
    } else {
      // No book hovered
      if (this.hoveredBook) {
        this.hoveredBook.animateHoverOut();
        this.hoveredBook = null;
      }
    }
  }

  onMouseClick(event) {
    // Update mouse position first
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast to detect book clicks
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Get all book meshes (including all nested children recursively)
    const allBookMeshes = [];
    this.books3D.forEach(book3D => {
      if (book3D.mesh) {
        allBookMeshes.push(book3D.mesh);
      }
    });

    // Use recursive: true to detect all nested children (coverPivot, etc.)
    const intersects = this.raycaster.intersectObjects(allBookMeshes, true);

    if (intersects.length > 0) {
      // Find which book was clicked
      let clickedObject = intersects[0].object;

      // If we clicked a child, find the parent book by traversing up
      let clickedBook = null;

      // Traverse up the object hierarchy to find the book
      let currentObject = clickedObject;
      while (currentObject && !clickedBook) {
        clickedBook = this.books3D.find(b => b.mesh === currentObject);
        currentObject = currentObject.parent;
      }

      if (clickedBook) {
        console.log('Book clicked:', clickedBook.bookData.title);
        console.log('Is already selected?', this.selectedBook === clickedBook);

        // If this book is already selected, toggle its open/close state
        if (this.selectedBook === clickedBook) {
          console.log('Toggling book open for:', clickedBook.bookData.title);
          clickedBook.toggleBookOpen();
        } else {
          // Otherwise, pull out the book
          console.log('Opening book (pulling out):', clickedBook.bookData.title);
          this.openBook(clickedBook);
        }
        return;
      }
    }

    // If no book was clicked, close current book
    this.closeBook();
  }

  openBook(book3D) {
    // Close previous book if any
    if (this.selectedBook && this.selectedBook !== book3D) {
      this.selectedBook.animateClose();
    }

    // Clear hover state
    if (this.hoveredBook) {
      this.hoveredBook = null;
    }

    // Move book to center of screen, at proper viewing distance
    const targetPosition = new THREE.Vector3(
      0, // Center horizontally
      2, // Center vertically at comfortable viewing height
      6 // In front of camera at good viewing distance
    );

    // Rotate book to show front cover facing user with spine on left
    // Books on shelf: spine on left (-X), front cover on right (+X)
    // Rotate -90° around Y to turn front cover toward camera
    // Tilt up (X rotation) about 20° to face the viewer better
    const targetRotation = new THREE.Euler(-Math.PI / 9, -Math.PI / 2, 0); // -20° tilt up, -90° turn

    book3D.animateOpen(targetPosition, targetRotation);

    // Store selected book
    this.selectedBook = book3D;

    // Don't show text details - just display the book cover
    // this.showBookDetails(book3D.bookData);
  }

  closeBook() {
    if (this.selectedBook) {
      this.selectedBook.animateClose();
      this.selectedBook = null;
    }

    // Reset hover state
    this.hoveredBook = null;

    // Don't need to hide details since we don't show them
    // this.hideBookDetails();
  }

  showBookDetails(bookData) {
    const overlay = document.getElementById('book-details-overlay');
    const closeBtn = document.getElementById('close-book-details');

    // Populate details
    document.getElementById('detail-title').textContent = bookData.title;
    document.getElementById('detail-author').textContent = `By ${bookData.author}`;
    document.getElementById('detail-genre').textContent = `Genre: ${bookData.genre}`;
    document.getElementById('detail-rating').textContent = `Rating: ${bookData.rating}`;
    document.getElementById('detail-quote').textContent = bookData.quote;
    document.getElementById('detail-description').textContent = bookData.description;

    // Show overlay
    overlay.style.display = 'block';

    // Add close button listener (remove old ones first)
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

    newCloseBtn.addEventListener('click', () => {
      this.closeBook();
    });
  }

  hideBookDetails() {
    const overlay = document.getElementById('book-details-overlay');
    overlay.style.display = 'none';
  }

  // Method to update books based on filters/sorting
  updateBooks(filteredBooks) {
    // Clear existing books from scene
    this.books3D.forEach(book3D => {
      this.scene.remove(book3D.mesh);
    });
    this.books3D = [];

    // Close any open book
    this.selectedBook = null;
    this.hideBookDetails();

    // Temporarily override bookLibrary.books with filtered/sorted books
    const originalBooks = this.bookLibrary.books;
    this.bookLibrary.books = filteredBooks;

    // Recreate books
    this.createBooks();

    // Restore original books array
    this.bookLibrary.books = originalBooks;
  }

  // Public method to be called by bookLibrary when filters/sort change
  refreshDisplay(filteredBooks) {
    this.updateBooks(filteredBooks);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Update all book animations
    this.books3D.forEach(book3D => {
      book3D.update();
    });

    // No controls to update - static camera
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize when DOM is ready and bookLibrary is available
window.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for bookLibrary.js to initialize
  setTimeout(() => {
    const container = document.getElementById('bookshelf-3d-container');
    if (container && window.bookLibrary) {
      window.bookshelf3D = new Bookshelf3D(container, window.bookLibrary);
    } else {
      console.error('Container or bookLibrary not found');
    }
  }, 100);
});
