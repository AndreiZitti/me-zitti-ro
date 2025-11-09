import { NodeIO } from '@gltf-transform/core';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const glbPath = join(__dirname, 'assets', 'Cover Opening Final CLEAN25.glb');

const io = new NodeIO();

console.log('Loading GLB file...\n');

io.read(glbPath).then((document) => {
    console.log('=== GLB FILE ANALYSIS ===\n');

    const root = document.getRoot();

    // Basic document info
    console.log('--- DOCUMENT INFO ---');
    console.log(`Asset Generator: ${root.getAsset().generator || 'Unknown'}`);
    console.log(`Asset Version: ${root.getAsset().version || 'Unknown'}`);
    console.log('');

    // Scenes
    console.log('--- SCENES ---');
    const scenes = root.listScenes();
    console.log(`Total Scenes: ${scenes.length}`);
    scenes.forEach((scene, i) => {
        console.log(`\nScene ${i}: ${scene.getName() || 'Unnamed'}`);
        console.log(`  Children: ${scene.listChildren().length}`);
    });
    console.log('');

    // Nodes
    console.log('--- NODES ---');
    const nodes = root.listNodes();
    console.log(`Total Nodes: ${nodes.length}`);
    nodes.forEach((node, i) => {
        console.log(`\nNode ${i}: ${node.getName() || 'Unnamed'}`);
        const translation = node.getTranslation();
        const rotation = node.getRotation();
        const scale = node.getScale();
        console.log(`  Translation: [${translation.map(v => v.toFixed(3)).join(', ')}]`);
        console.log(`  Rotation: [${rotation.map(v => v.toFixed(3)).join(', ')}]`);
        console.log(`  Scale: [${scale.map(v => v.toFixed(3)).join(', ')}]`);

        const mesh = node.getMesh();
        if (mesh) {
            console.log(`  Mesh: ${mesh.getName() || 'Unnamed'}`);
            console.log(`    Primitives: ${mesh.listPrimitives().length}`);
        }

        const children = node.listChildren();
        if (children.length > 0) {
            console.log(`  Children: ${children.length}`);
            children.forEach(child => {
                console.log(`    - ${child.getName() || 'Unnamed'}`);
            });
        }
    });
    console.log('');

    // Meshes
    console.log('--- MESHES ---');
    const meshes = root.listMeshes();
    console.log(`Total Meshes: ${meshes.length}`);
    meshes.forEach((mesh, i) => {
        console.log(`\nMesh ${i}: ${mesh.getName() || 'Unnamed'}`);
        const primitives = mesh.listPrimitives();
        console.log(`  Primitives: ${primitives.length}`);
        primitives.forEach((prim, j) => {
            console.log(`    Primitive ${j}:`);
            console.log(`      Mode: ${prim.getMode()}`);
            const indices = prim.getIndices();
            console.log(`      Indices: ${indices ? indices.getCount() : 'None'}`);

            // Attributes
            const attributes = prim.listAttributes();
            console.log(`      Attributes: ${attributes.length}`);
            attributes.forEach(attr => {
                console.log(`        - ${attr.getName()}: ${attr.getCount()} items`);
            });

            const material = prim.getMaterial();
            if (material) {
                console.log(`      Material: ${material.getName() || 'Unnamed'}`);
            }
        });
    });
    console.log('');

    // Materials
    console.log('--- MATERIALS ---');
    const materials = root.listMaterials();
    console.log(`Total Materials: ${materials.length}`);
    materials.forEach((material, i) => {
        console.log(`\nMaterial ${i}: ${material.getName() || 'Unnamed'}`);
        const baseColor = material.getBaseColorFactor();
        console.log(`  Base Color: [${baseColor.map(v => v.toFixed(3)).join(', ')}]`);
        console.log(`  Metallic: ${material.getMetallicFactor()}`);
        console.log(`  Roughness: ${material.getRoughnessFactor()}`);
        console.log(`  Alpha Mode: ${material.getAlphaMode()}`);
        console.log(`  Double Sided: ${material.getDoubleSided()}`);

        const baseColorTexture = material.getBaseColorTexture();
        if (baseColorTexture) {
            console.log(`  Base Color Texture: ${baseColorTexture.getName() || 'Unnamed'}`);
        }
    });
    console.log('');

    // Animations
    console.log('--- ANIMATIONS ---');
    const animations = root.listAnimations();
    console.log(`Total Animations: ${animations.length}`);
    animations.forEach((animation, i) => {
        console.log(`\nAnimation ${i}: ${animation.getName() || 'Unnamed'}`);
        const channels = animation.listChannels();
        const samplers = animation.listSamplers();
        console.log(`  Channels: ${channels.length}`);
        console.log(`  Samplers: ${samplers.length}`);

        channels.forEach((channel, j) => {
            const targetNode = channel.getTargetNode();
            const targetPath = channel.getTargetPath();
            const sampler = channel.getSampler();

            console.log(`\n  Channel ${j}:`);
            console.log(`    Target Node: ${targetNode?.getName() || 'Unnamed'}`);
            console.log(`    Target Path: ${targetPath}`);

            if (sampler) {
                const input = sampler.getInput();
                const output = sampler.getOutput();
                console.log(`    Sampler Interpolation: ${sampler.getInterpolation()}`);
                console.log(`    Keyframes: ${input?.getCount() || 0}`);

                if (input) {
                    const times = input.getArray();
                    const minTime = Math.min(...times);
                    const maxTime = Math.max(...times);
                    console.log(`    Duration: ${minTime.toFixed(3)}s to ${maxTime.toFixed(3)}s (${(maxTime - minTime).toFixed(3)}s total)`);
                }
            }
        });
    });
    console.log('');

    // Textures
    console.log('--- TEXTURES ---');
    const textures = root.listTextures();
    console.log(`Total Textures: ${textures.length}`);
    textures.forEach((texture, i) => {
        console.log(`  Texture ${i}: ${texture.getName() || 'Unnamed'}`);
        const image = texture.getImage();
        if (image) {
            console.log(`    Size: ${image.byteLength} bytes`);
        }
    });
    console.log('');

    console.log('=== END ANALYSIS ===\n');
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
