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
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2a2520); // Warm dark brown

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
    this.camera.position.set(0, 1, 14);
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
    this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this));
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));

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
    // Skip HDRI loading - use simple color background
    this.scene.background = new THREE.Color(0x2a2520); // Warm dark brown
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

    for (let i = 0; i < shelfCount; i++) {
      const shelfGeometry = new THREE.BoxGeometry(10, 0.15, 2);
      const shelfMesh = new THREE.Mesh(shelfGeometry, this.materials.wood);

      // Position shelves vertically
      shelfMesh.position.y = -i * shelfSpacing;
      shelfMesh.receiveShadow = true;

      this.scene.add(shelfMesh);
    }
  }

  createBooks() {
    const books = this.bookLibrary.books;
    const booksPerShelf = this.bookLibrary.booksPerShelf;
    const shelfSpacing = 4.5;
    const shelfWidth = 9; // Usable width for books
    const bookSpacing = 0.1; // Gap between books

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

      // Create random dimensions for variety
      const dimensions = {
        width: 0.3 + Math.random() * 0.15,
        height: 3.6 + Math.random() * 0.8,
        depth: 2.5 + Math.random() * 1.0
      };

      // Calculate Y position (shelf height)
      // Shelf is at -shelfIndex * shelfSpacing
      // Shelf thickness is 0.15, so top of shelf is at shelf.y + 0.075
      // Book bottom should be at shelf top
      // Since book position is at its center, book.y = shelfTop + book.height/2
      const shelfY = -shelfIndex * shelfSpacing;
      const shelfTop = shelfY + 0.075; // Half of shelf thickness (0.15/2)
      const bookY = shelfTop + dimensions.height / 2;

      // Calculate position (books stand on shelf, centered on Z)
      const position = [
        xPosition + dimensions.width / 2,
        bookY, // Properly positioned on shelf
        0 // Centered on shelf depth
      ];

      // Create book
      const book3D = new Book3D(bookData, position, dimensions);

      // Add to scene
      this.scene.add(book3D.mesh);

      // Store reference
      this.books3D.push(book3D);

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

  onMouseMove(event) {
    // Get canvas bounding rect for accurate mouse position
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  onMouseClick(event) {
    // Update mouse position first
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast to detect book clicks
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Get all book meshes (including children)
    const allBookMeshes = [];
    this.books3D.forEach(book3D => {
      allBookMeshes.push(book3D.mesh);
      book3D.mesh.children.forEach(child => allBookMeshes.push(child));
    });

    const intersects = this.raycaster.intersectObjects(allBookMeshes, false);

    if (intersects.length > 0) {
      // Find which book was clicked
      let clickedObject = intersects[0].object;

      // If we clicked a child, find the parent book
      const clickedBook = this.books3D.find(b => {
        return b.mesh === clickedObject || b.mesh.children.includes(clickedObject);
      });

      if (clickedBook) {
        console.log('Book clicked:', clickedBook.bookData.title);
        this.openBook(clickedBook);
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

    // Animate book forward and rotate slightly
    const targetPosition = book3D.originalPosition.clone();
    targetPosition.z += 2; // Pull forward

    const targetRotation = new THREE.Euler(0, 0.2, 0); // Slight rotation

    book3D.animateOpen(targetPosition, targetRotation);

    // Store selected book
    this.selectedBook = book3D;

    // Show book details
    this.showBookDetails(book3D.bookData);
  }

  closeBook() {
    if (this.selectedBook) {
      this.selectedBook.animateClose();
      this.selectedBook = null;
    }

    // Hide book details
    this.hideBookDetails();
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
