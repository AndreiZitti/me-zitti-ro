import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Analyze the GLB file
const loader = new GLTFLoader();
const glbPath = join(__dirname, 'assets', 'Cover Opening Final CLEAN25.glb');

// Read file as ArrayBuffer
const data = readFileSync(glbPath);
const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

// Parse the GLB
loader.parse(arrayBuffer, '',
    (gltf) => {
        console.log('\n=== GLB FILE ANALYSIS ===\n');

        // Scene structure
        console.log('--- SCENE STRUCTURE ---');
        console.log('Scene:', gltf.scene);
        console.log('Number of children:', gltf.scene.children.length);

        // Traverse and log all objects
        console.log('\n--- OBJECTS IN SCENE ---');
        gltf.scene.traverse((object) => {
            console.log(`\nObject: ${object.name || 'unnamed'}`);
            console.log(`  Type: ${object.type}`);
            console.log(`  Position: x=${object.position.x.toFixed(3)}, y=${object.position.y.toFixed(3)}, z=${object.position.z.toFixed(3)}`);
            console.log(`  Rotation: x=${object.rotation.x.toFixed(3)}, y=${object.rotation.y.toFixed(3)}, z=${object.rotation.z.toFixed(3)}`);
            console.log(`  Scale: x=${object.scale.x.toFixed(3)}, y=${object.scale.y.toFixed(3)}, z=${object.scale.z.toFixed(3)}`);

            if (object.isMesh) {
                console.log(`  Geometry: ${object.geometry.type}`);
                if (object.geometry.boundingBox) {
                    const bbox = object.geometry.boundingBox;
                    console.log(`  Bounding Box: min(${bbox.min.x.toFixed(3)}, ${bbox.min.y.toFixed(3)}, ${bbox.min.z.toFixed(3)})`);
                    console.log(`                max(${bbox.max.x.toFixed(3)}, ${bbox.max.y.toFixed(3)}, ${bbox.max.z.toFixed(3)})`);
                } else {
                    object.geometry.computeBoundingBox();
                    const bbox = object.geometry.boundingBox;
                    console.log(`  Bounding Box: min(${bbox.min.x.toFixed(3)}, ${bbox.min.y.toFixed(3)}, ${bbox.min.z.toFixed(3)})`);
                    console.log(`                max(${bbox.max.x.toFixed(3)}, ${bbox.max.y.toFixed(3)}, ${bbox.max.z.toFixed(3)})`);
                }
                console.log(`  Material: ${object.material.type}`);
            }
        });

        // Animations
        console.log('\n--- ANIMATIONS ---');
        if (gltf.animations && gltf.animations.length > 0) {
            console.log(`Total animations: ${gltf.animations.length}`);
            gltf.animations.forEach((clip, index) => {
                console.log(`\nAnimation ${index}:`);
                console.log(`  Name: ${clip.name}`);
                console.log(`  Duration: ${clip.duration}s`);
                console.log(`  Tracks: ${clip.tracks.length}`);
                clip.tracks.forEach((track) => {
                    console.log(`    - ${track.name} (${track.ValueTypeName})`);
                    console.log(`      Times: [${track.times.slice(0, 5).map(t => t.toFixed(3)).join(', ')}...]`);
                });
            });
        } else {
            console.log('No animations found');
        }

        // Compute overall bounding box
        console.log('\n--- OVERALL BOUNDING BOX ---');
        const box = new THREE.Box3().setFromObject(gltf.scene);
        console.log(`Min: x=${box.min.x.toFixed(3)}, y=${box.min.y.toFixed(3)}, z=${box.min.z.toFixed(3)}`);
        console.log(`Max: x=${box.max.x.toFixed(3)}, y=${box.max.y.toFixed(3)}, z=${box.max.z.toFixed(3)}`);
        const size = new THREE.Vector3();
        box.getSize(size);
        console.log(`Size: width=${size.x.toFixed(3)}, height=${size.y.toFixed(3)}, depth=${size.z.toFixed(3)}`);

        // Cameras
        console.log('\n--- CAMERAS ---');
        if (gltf.cameras && gltf.cameras.length > 0) {
            console.log(`Total cameras: ${gltf.cameras.length}`);
            gltf.cameras.forEach((camera, index) => {
                console.log(`Camera ${index}:`, camera);
            });
        } else {
            console.log('No cameras found');
        }

        console.log('\n=== END ANALYSIS ===\n');
        process.exit(0);
    },
    (progress) => {
        console.log('Loading:', Math.round(progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
        console.error('Error loading GLB:', error);
        process.exit(1);
    }
);
