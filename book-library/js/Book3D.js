// Book3D.js - 3D Book Component (CLEANED VERSION)
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Book3D {
  constructor(bookData, position, dimensions) {
    this.bookData = bookData;
    this.position = position;
    this.dimensions = dimensions || {
      width: 0.3 + Math.random() * 0.15,
      height: 3.6 + Math.random() * 0.8,
      depth: 2.5 + Math.random() * 1.0
    };

    // Core properties
    this.mesh = null;
    this.gltfModel = null;
    this.mixer = null;
    this.flipAction = null;

    // Position/rotation
    this.originalPosition = new THREE.Vector3(...position);
    this.originalRotation = new THREE.Euler(0, 0, 0);
    this.targetPosition = null;
    this.targetRotation = null;

    // State
    this.isAnimating = false;
    this.isBookOpen = false;
    this.isHovered = false;
    this.isClosingToShelf = false; // Two-step close animation flag
    this.hoverOffset = 0.5; // How far to pull out on hover

    // Animation stages (assuming 24 fps based on 10.375s duration for 250 frames)
    const fps = 24;
    this.animationStages = [
      { frame: 0, time: 0, name: 'closed' },
      { frame: 65, time: 65 / fps, name: 'first_page' },
      { frame: 91, time: 91 / fps, name: 'second_page' },
      { frame: 124, time: 124 / fps, name: 'third_page' },
      { frame: 160, time: 160 / fps, name: 'fourth_page' },
      { frame: 250, time: 250 / fps, name: 'end' }
    ];
    this.currentStage = 0;
  }

  async createMesh(loadTextures = false) {
    this.mesh = new THREE.Group();
    this.texturesLoaded = false;
    await this.loadGLBModel(loadTextures);

    this.mesh.position.copy(this.originalPosition);
    this.mesh.rotation.copy(this.originalRotation);
    this.mesh.userData = { bookData: this.bookData, book3D: this };
  }

  async loadGLBModel(loadTextures = false) {
    const loader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    this.bookMeshes = {}; // Store references to book parts for lazy loading

    return new Promise((resolve, reject) => {
      loader.load('assets/Cover Opening Final BestVersionUVMAPPINGBEST33.glb', (gltf) => {
        this.gltfModel = gltf.scene;

        // Scale to match book dimensions
        const scale = this.dimensions.height / 4;
        this.gltfModel.scale.set(scale, scale, scale);

        // Set orientation for shelf:
        // Goal: Spine faces user (+Z), front cover to the right (+X), back cover to the left (-X)
        this.gltfModel.rotation.order = 'YXZ';

        // Rotate to show spine forward
        this.gltfModel.rotation.x = Math.PI / 2;   // Stand upright
        this.gltfModel.rotation.y = Math.PI / 2;   // Spine faces forward (+Z)
        this.gltfModel.rotation.z = 0;

        // Adjust position to center on shelf
        this.gltfModel.position.x = 0;
        this.gltfModel.position.y = 0;
        this.gltfModel.position.z = 0;

        // Color materials and hide pages
        let totalPages = 0;
        let totalCovers = 0;

        this.gltfModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const name = child.name;

            // Based on testing: Cube = spine, Cube002 = FRONT cover (what we see when pulled out), Cube001 = BACK cover
            if (name === 'Cube') {
              // Spine - Apply texture (UV mapping fixed in Blender)
              if (this.bookData.spineURL) {
                console.log(`  📸 Loading texture for SPINE ${this.bookData.title}: ${this.bookData.spineURL}`);
                textureLoader.load(
                  this.bookData.spineURL,
                  (texture) => {
                    texture.colorSpace = THREE.SRGBColorSpace;
                    texture.wrapS = THREE.ClampToEdgeWrapping;
                    texture.wrapT = THREE.ClampToEdgeWrapping;
                    child.material = new THREE.MeshStandardMaterial({
                      map: texture,
                      roughness: 0.8,
                      metalness: 0.1
                    });
                    console.log(`  ✅ TEXTURE applied to SPINE (Cube) - using Blender UVs`);
                  },
                  undefined,
                  (error) => {
                    console.error(`  ❌ Failed to load spine texture:`, error);
                    child.material = new THREE.MeshStandardMaterial({
                      color: 0xe33c39, roughness: 0.8, metalness: 0.1
                    });
                  }
                );
              } else {
                // Check for specific books that need custom colors
                let spineColor = 0xe33c39; // Default red
                if (this.bookData.title === "The Universe in a Nutshell") {
                  spineColor = 0x000000; // Black for Universe in a Nutshell
                } else if (this.bookData.title === "Brief Answers to the Big Questions") {
                  spineColor = 0xFFFFFF; // White for Brief Answers
                }

                child.material = new THREE.MeshStandardMaterial({
                  color: spineColor, roughness: 0.8, metalness: 0.1
                });
                console.log(`  ✓ Applied color #${spineColor.toString(16)} to SPINE: ${name}`);
              }
              totalCovers++;
            } else if (name === 'Cube002') {
              // FRONT Cover (visible when book is pulled out) - Apply texture simply
              if (this.bookData.frontCoverURL) {
                console.log(`  📸 Loading texture for FRONT COVER ${this.bookData.title}: ${this.bookData.frontCoverURL}`);
                textureLoader.load(
                  this.bookData.frontCoverURL,
                  (texture) => {
                    texture.colorSpace = THREE.SRGBColorSpace;
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.rotation = Math.PI; // Rotate 180 degrees
                    texture.center.set(0.5, 0.5); // Rotate around center
                    child.material = new THREE.MeshStandardMaterial({
                      map: texture,
                      roughness: 0.7,
                      metalness: 0.1
                    });
                    console.log(`  ✅ TEXTURE applied to FRONT COVER (Cube002) - rotated 180°`);
                  },
                  undefined,
                  (error) => {
                    console.error(`  ❌ Failed to load front cover texture:`, error);
                    child.material = new THREE.MeshStandardMaterial({
                      color: 0xff0000, roughness: 0.7, metalness: 0.1
                    });
                  }
                );
              } else {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0xff0000, roughness: 0.7, metalness: 0.1
                });
              }
              totalCovers++;
            } else if (name === 'Cube001') {
              // BACK Cover (facing shelf) - Apply texture if available
              if (this.bookData.backCoverURL) {
                console.log(`  📸 Loading texture for BACK COVER ${this.bookData.title}: ${this.bookData.backCoverURL}`);
                textureLoader.load(
                  this.bookData.backCoverURL,
                  (texture) => {
                    texture.colorSpace = THREE.SRGBColorSpace;
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    child.material = new THREE.MeshStandardMaterial({
                      map: texture,
                      roughness: 0.7,
                      metalness: 0.1
                    });
                    console.log(`  ✅ TEXTURE applied to BACK COVER (Cube001)`);
                  },
                  undefined,
                  (error) => {
                    console.error(`  ❌ Failed to load back cover texture:`, error);
                    child.material = new THREE.MeshStandardMaterial({
                      color: 0xe33c39, roughness: 0.7, metalness: 0.1
                    });
                  }
                );
              } else {
                // Check for specific books that need custom colors
                let backColor = 0xe33c39; // Default red
                if (this.bookData.title === "The Universe in a Nutshell") {
                  backColor = 0x000000; // Black for Universe in a Nutshell
                } else if (this.bookData.title === "Brief Answers to the Big Questions") {
                  backColor = 0xFFFFFF; // White for Brief Answers
                }

                child.material = new THREE.MeshStandardMaterial({
                  color: backColor,
                  roughness: 0.7,
                  metalness: 0.1
                });
                console.log(`  ✓ Applied color #${backColor.toString(16)} to BACK COVER: ${name}`);
              }
              totalCovers++;
            } else if (name.startsWith('Plane')) {
              // Pages - add text texture with variety (title pages and content pages)
              child.visible = true;

              // Determine page type based on page number
              const pageNum = totalPages;
              const isTitlePage = pageNum % 7 === 0; // Every 7th page is a title page

              // Create a canvas to render text
              const canvas = document.createElement('canvas');
              canvas.width = 512;
              canvas.height = 1024;
              const ctx = canvas.getContext('2d');

              // Background
              ctx.fillStyle = '#F5F5DC'; // Beige page color
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              if (isTitlePage) {
                // Title page - centered chapter title
                const chapterNum = Math.floor(pageNum / 7) + 1;

                ctx.fillStyle = '#2c2c2c';
                ctx.font = 'bold 48px Georgia, serif';
                ctx.textAlign = 'center';
                ctx.fillText(`Chapter ${chapterNum}`, canvas.width / 2, canvas.height / 2 - 40);

                ctx.font = '32px Georgia, serif';
                ctx.fillText('The Beginning', canvas.width / 2, canvas.height / 2 + 40);
              } else {
                // Regular page with text
                ctx.fillStyle = '#2c2c2c';
                ctx.font = '24px Georgia, serif';
                ctx.textAlign = 'left';

                // Lorem ipsum text
                const loremText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.';

                // Word wrap function
                const wrapText = (text, x, y, maxWidth, lineHeight) => {
                  const paragraphs = text.split('\n\n');
                  let currentY = y;

                  paragraphs.forEach(paragraph => {
                    const words = paragraph.split(' ');
                    let line = '';

                    words.forEach((word, i) => {
                      const testLine = line + word + ' ';
                      const metrics = ctx.measureText(testLine);

                      if (metrics.width > maxWidth && i > 0) {
                        ctx.fillText(line, x, currentY);
                        line = word + ' ';
                        currentY += lineHeight;
                      } else {
                        line = testLine;
                      }
                    });

                    ctx.fillText(line, x, currentY);
                    currentY += lineHeight * 1.8;
                  });
                };

                wrapText(loremText, 40, 50, canvas.width - 80, 32);

                // Add page number at bottom
                ctx.fillStyle = '#999';
                ctx.font = '14px Georgia, serif';
                ctx.textAlign = 'center';
                ctx.fillText(`${pageNum + 1}`, canvas.width / 2, canvas.height - 30);
              }

              // Create texture from canvas
              const pageTexture = new THREE.CanvasTexture(canvas);
              pageTexture.colorSpace = THREE.SRGBColorSpace;
              pageTexture.flipY = false; // Don't flip - keep text right-side up

              child.material = new THREE.MeshStandardMaterial({
                map: pageTexture,
                roughness: 0.9,
                metalness: 0.0,
                side: THREE.DoubleSide // Render both sides
              });

              totalPages++;
            } else {
              // Unknown mesh
              console.log(`  ⚠️ Unknown mesh: "${child.name}"`);
            }
          }
        });

        console.log(`📚 GLB Model loaded: ${totalCovers} covers, ${totalPages} pages`);

        // Setup animation - DON'T clamp when finished
        if (gltf.animations && gltf.animations.length > 0) {
          console.log('Found animations in GLB:', gltf.animations.length);
          console.log('Animation 0 name:', gltf.animations[0].name);
          console.log('Animation 0 duration:', gltf.animations[0].duration);
          console.log('Animation 0 tracks:', gltf.animations[0].tracks.length);

          // Log what objects are being animated
          console.log('\n🎬 DETAILED ANIMATION ANALYSIS:');
          console.log(`Total animations: ${gltf.animations.length}`);

          // Show first 10 animation names
          console.log('\nFirst 10 animations:');
          gltf.animations.slice(0, 10).forEach((anim, i) => {
            console.log(`  Animation ${i}: "${anim.name}" (${anim.tracks.length} tracks, ${anim.duration.toFixed(2)}s)`);
            // Show what properties each track animates
            anim.tracks.forEach((track, t) => {
              const parts = track.name.split('.');
              console.log(`    Track ${t}: ${parts[1]} (${track.times.length} keyframes)`);
            });
          });

          console.log(`\nAnimation 0 tracks:`);
          gltf.animations[0].tracks.forEach((track, i) => {
            console.log(`  Track ${i}: ${track.name}`);
          });

          // Now check what objects actually exist in the model
          console.log('\n🔍 OBJECTS IN GLB MODEL:');
          const objectNames = new Set();
          const meshNames = [];
          const emptyNames = [];

          gltf.scene.traverse((child) => {
            if (child.name) {
              objectNames.add(child.name);
              if (child.isMesh) {
                meshNames.push(child.name);
              }
              if (child.type === 'Object3D' && !child.isMesh) {
                emptyNames.push(child.name);
              }
            }
          });

          console.log(`  Total named objects: ${objectNames.size}`);
          console.log(`  Total MESH objects: ${meshNames.length}`);
          console.log(`  Total EMPTY objects: ${emptyNames.length}`);
          console.log(`  First 20 MESH names:`, meshNames.slice(0, 20));
          const planeMeshes = meshNames.filter(n => n.toLowerCase().includes('plane'));
          console.log(`  Searching for 'Plane' meshes (${planeMeshes.length}):`, planeMeshes);
          console.log(`  Searching for 'Papers' or 'Practice':`, Array.from(objectNames).filter(n => n.toLowerCase().includes('paper') || n.toLowerCase().includes('practice')));

          // Check for missing page numbers
          console.log(`  Page range: ${planeMeshes[0]} to ${planeMeshes[planeMeshes.length-1]}`);

          // Check if animation track names match any objects
          console.log('\n🎯 TRACK TARGET MATCHING:');
          gltf.animations[0].tracks.forEach((track, i) => {
            const parts = track.name.split('.');
            const objectName = parts[0];
            const found = objectNames.has(objectName);
            console.log(`  Track ${i} targets "${objectName}": ${found ? '✓ FOUND' : '❌ NOT FOUND'}`);
          });
          console.log('🎬 END ANIMATION ANALYSIS\n');

          this.mixer = new THREE.AnimationMixer(this.gltfModel);

          // Play ALL animations together (Spine + all Empties)
          this.allActions = [];
          gltf.animations.forEach((clip, i) => {
            const action = this.mixer.clipAction(clip);
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = false;
            action.paused = true;
            action.time = 0;
            this.allActions.push(action);

            if (i < 5) {
              console.log(`  Created action ${i}: ${clip.name}`);
            }
          });

          // Use the Spine action as the main control
          this.flipAction = this.allActions[0];

          console.log(`✓ Animation setup complete: ${this.allActions.length} actions created for ${this.bookData.title}`);
        } else {
          console.warn('⚠️ No animations found in GLB for:', this.bookData.title);
        }

        this.mesh.add(this.gltfModel);
        resolve();
      }, undefined, reject);
    });
  }

  nextPage() {
    console.log('📖 nextPage() called');
    console.log('  - flipAction exists?', !!this.flipAction);
    console.log('  - currentStage:', this.currentStage);
    console.log('  - max stages:', this.animationStages.length - 1);

    if (!this.flipAction) {
      console.error('❌ No flipAction available!');
      return;
    }

    if (this.currentStage >= this.animationStages.length - 1) {
      console.log('❌ Already at last stage');
      return;
    }

    // First time opening - show pages (don't rotate GLB - it breaks animation!)
    if (this.currentStage === 0) {
      console.log('📖 First page - showing pages');
      console.log('GLB rotation:', this.gltfModel.rotation.x, this.gltfModel.rotation.y, this.gltfModel.rotation.z);
      console.log('Parent rotation:', this.mesh.rotation.x, this.mesh.rotation.y, this.mesh.rotation.z);

      // DON'T rotate the GLB - the animation is already in the correct coordinate space
      // Changing rotation breaks the animation orientation

      let pageCount = 0;
      this.gltfModel.traverse((child) => {
        if (child.isMesh && child.name.toLowerCase().includes('plane')) {
          child.visible = true;

          // DON'T modify rotation - the animation needs the original rotation!
          // The 90° rotation is intentional for the animation to work correctly

          pageCount++;

          // Log detailed info for first few pages
          if (pageCount <= 3) {
            console.log(`  Page ${pageCount} (${child.name}):`);
            console.log(`    - Position:`, child.position);
            console.log(`    - Rotation FIXED:`, child.rotation);
            console.log(`    - Scale:`, child.scale);
            console.log(`    - Visible:`, child.visible);
            console.log(`    - Material:`, child.material);
            console.log(`    - Geometry vertices:`, child.geometry.attributes.position.count);
          }
        }
      });
      console.log(`✅ Total pages made visible: ${pageCount}`);

      // Store reference to first page to monitor during animation
      // Pages are numbered backwards: 103 is first, 073 is last
      this.gltfModel.traverse((child) => {
        if (child.isMesh && child.name === 'Plane103') {
          this._debugPage = child;
          console.log('📍 Tracking Plane103 (FIRST page) for animation debugging');
        }
      });
    }

    this.currentStage++;
    const targetStage = this.animationStages[this.currentStage];

    console.log(`✓ Next page: stage ${this.currentStage}, target time ${targetStage.time.toFixed(2)}s`);

    // Play ALL actions together (spine + all empty controllers)
    if (this.allActions) {
      console.log(`▶️ Playing ${this.allActions.length} animations simultaneously`);
      this.allActions.forEach(action => {
        action.paused = false;
        action.timeScale = 1.2; // Faster page turn (was 1.0)
        action.play();
      });
    } else {
      // Fallback to single action
      this.flipAction.paused = false;
      this.flipAction.timeScale = 1.2; // Faster page turn (was 1.0)
      this.flipAction.play();
    }

    this.animationTargetTime = targetStage.time;
    this.isAnimatingForward = true;
    this.isBookOpen = true;
  }

  previousPage() {
    if (!this.flipAction || this.currentStage <= 0) {
      return;
    }

    this.currentStage--;
    const targetStage = this.animationStages[this.currentStage];

    console.log(`Previous page: stage ${this.currentStage}, target time ${targetStage.time.toFixed(2)}s`);

    this.flipAction.paused = false;
    this.flipAction.timeScale = -1;
    this.flipAction.play();
    this.animationTargetTime = targetStage.time;
    this.isAnimatingBackward = true;

    if (this.currentStage === 0) {
      this.isBookOpen = false;
    }
  }

  animateOpen(targetPosition, targetRotation) {
    // Clear hover state before opening
    this.isHovered = false;
    this.hoverTargetZ = undefined;

    this.targetPosition = targetPosition.clone();
    this.targetRotation = targetRotation.clone();
    this.isAnimating = true;
  }

  animateClose() {
    // Reset animation and hide pages
    if (this.currentStage > 0) {
      this.currentStage = 0;
      if (this.flipAction) {
        this.flipAction.time = 0;
        this.flipAction.paused = true;
      }
      if (this.allActions) {
        this.allActions.forEach(action => {
          action.time = 0;
          action.paused = true;
        });
      }
      // Note: Pages stay visible on shelf to fill the book
      // The animation reset to time=0 will put them back in closed position
    }
    this.isBookOpen = false;

    // First rotate to spine-forward (closed orientation) before returning to shelf
    // Current position: book is at center, showing cover (rotation Y = -90°)
    // Target: rotate to spine forward (rotation Y = 0°) while staying at center
    const currentPosition = this.mesh.position.clone();
    const closedRotation = new THREE.Euler(0, 0, 0); // Spine forward orientation

    this.targetPosition = currentPosition; // Stay at current position
    this.targetRotation = closedRotation;
    this.isAnimating = true;
    this.isClosingToShelf = true; // Flag to trigger second animation step
  }

  returnToShelf() {
    this.targetPosition = this.originalPosition.clone();
    this.targetRotation = this.originalRotation.clone();
    this.isAnimating = true;
  }

  // Hover methods - pull book out slightly
  animateHoverIn() {
    if (this.isBookOpen) return; // Don't hover if book is open
    this.isHovered = true;
    this.hoverTargetZ = this.originalPosition.z + this.hoverOffset;
  }

  animateHoverOut() {
    this.isHovered = false;
    this.hoverTargetZ = this.originalPosition.z;
  }

  update(deltaTime) {
    // Animate book position/rotation (opening/closing)
    if (this.isAnimating && this.targetPosition && this.targetRotation) {
      // Faster animation for picking up and putting down books
      const lerpFactor = this.isClosingToShelf || !this.isBookOpen ? 0.12 : 0.08; // Much faster (was 0.05)
      this.mesh.position.lerp(this.targetPosition, lerpFactor);
      this.mesh.rotation.x += (this.targetRotation.x - this.mesh.rotation.x) * lerpFactor;
      this.mesh.rotation.y += (this.targetRotation.y - this.mesh.rotation.y) * lerpFactor;
      this.mesh.rotation.z += (this.targetRotation.z - this.mesh.rotation.z) * lerpFactor;

      const positionClose = this.mesh.position.distanceTo(this.targetPosition) < 0.01;
      const rotationClose = Math.abs(this.mesh.rotation.y - this.targetRotation.y) < 0.01;

      if (positionClose && rotationClose) {
        this.mesh.position.copy(this.targetPosition);
        this.mesh.rotation.copy(this.targetRotation);
        this.isAnimating = false;

        // If this was step 1 of closing (rotate to spine-forward), now do step 2 (return to shelf)
        if (this.isClosingToShelf) {
          this.isClosingToShelf = false;
          this.returnToShelf(); // Now animate back to shelf
        }
      }
    }

    // Animate hover effect (pull out on Z axis)
    if (!this.isAnimating && this.hoverTargetZ !== undefined) {
      const lerpFactor = 0.25; // Even faster for hover (was 0.15)
      const currentZ = this.mesh.position.z;
      const newZ = currentZ + (this.hoverTargetZ - currentZ) * lerpFactor;

      // Only update Z, keep X and Y at original position
      this.mesh.position.z = newZ;

      // Stop animating when close enough
      if (Math.abs(newZ - this.hoverTargetZ) < 0.001) {
        this.mesh.position.z = this.hoverTargetZ;
      }
    }

    // Update animation mixer
    if (this.mixer && deltaTime && this.flipAction) {
      this.mixer.update(deltaTime);

      // Log animation state occasionally for debugging
      if (this.isAnimatingForward || this.isAnimatingBackward) {
        if (!this._lastLogTime || Date.now() - this._lastLogTime > 500) {
          console.log(`⏩ Animation: ${this.flipAction.time.toFixed(2)}s / ${this.flipAction.getClip().duration.toFixed(2)}s (target: ${this.animationTargetTime.toFixed(2)}s, deltaTime: ${(deltaTime * 1000).toFixed(1)}ms, paused: ${this.flipAction.paused})`);

          // Check if the page is actually moving
          if (this._debugPage) {
            console.log(`   📄 Plane103 (first page) position: (${this._debugPage.position.x.toFixed(3)}, ${this._debugPage.position.y.toFixed(3)}, ${this._debugPage.position.z.toFixed(3)})`);
            console.log(`   📄 Plane103 (first page) rotation: (${this._debugPage.rotation.x.toFixed(2)}, ${this._debugPage.rotation.y.toFixed(2)}, ${this._debugPage.rotation.z.toFixed(2)})`);
          }

          this._lastLogTime = Date.now();
        }
      }

      // Check if reached target time (forward)
      if (this.isAnimatingForward && this.flipAction.time >= this.animationTargetTime) {
        // Pause all actions at target time
        if (this.allActions) {
          this.allActions.forEach(action => {
            action.time = this.animationTargetTime;
            action.paused = true;
          });
        } else {
          this.flipAction.time = this.animationTargetTime;
          this.flipAction.paused = true;
        }
        this.isAnimatingForward = false;
        console.log(`✓ Paused all ${this.allActions?.length || 1} animations at stage ${this.currentStage}, time ${this.flipAction.time.toFixed(2)}s`);
      }

      // Check if reached target time (backward)
      if (this.isAnimatingBackward && this.flipAction.time <= this.animationTargetTime) {
        this.flipAction.time = this.animationTargetTime;
        this.flipAction.paused = true;
        this.flipAction.timeScale = 1;
        this.isAnimatingBackward = false;
        console.log(`✓ Paused at stage ${this.currentStage}, time ${this.flipAction.time.toFixed(2)}s`);

        // Pages stay visible even at stage 0 (they're in closed position at time=0)
        // This makes the book look filled on the shelf
      }
    }
  }
}

export default Book3D;
