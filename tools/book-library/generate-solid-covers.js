const fs = require('fs');
const path = require('path');

// Simple PNG generator for solid color images
function createSolidPNG(width, height, r, g, b) {
    // PNG file structure
    const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    // IHDR chunk
    function createIHDR(width, height) {
        const data = Buffer.alloc(13);
        data.writeUInt32BE(width, 0);
        data.writeUInt32BE(height, 4);
        data[8] = 8;  // bit depth
        data[9] = 2;  // color type (RGB)
        data[10] = 0; // compression
        data[11] = 0; // filter
        data[12] = 0; // interlace
        return createChunk('IHDR', data);
    }

    // Create chunk with type and data
    function createChunk(type, data) {
        const chunk = Buffer.alloc(12 + data.length);
        chunk.writeUInt32BE(data.length, 0);
        chunk.write(type, 4);
        data.copy(chunk, 8);

        // Calculate CRC
        const crc = crc32(chunk.slice(4, 8 + data.length));
        chunk.writeUInt32BE(crc, 8 + data.length);
        return chunk;
    }

    // Simple CRC32 implementation
    function crc32(buf) {
        let crc = 0xFFFFFFFF;
        for (let i = 0; i < buf.length; i++) {
            crc = crc ^ buf[i];
            for (let j = 0; j < 8; j++) {
                if (crc & 1) {
                    crc = (crc >>> 1) ^ 0xEDB88320;
                } else {
                    crc = crc >>> 1;
                }
            }
        }
        return crc ^ 0xFFFFFFFF;
    }

    // Create IDAT chunk with uncompressed data
    const zlib = require('zlib');
    const pixels = Buffer.alloc(height * (1 + width * 3));
    let idx = 0;
    for (let y = 0; y < height; y++) {
        pixels[idx++] = 0; // filter type
        for (let x = 0; x < width; x++) {
            pixels[idx++] = r;
            pixels[idx++] = g;
            pixels[idx++] = b;
        }
    }

    const compressed = zlib.deflateSync(pixels);
    const idat = createChunk('IDAT', compressed);

    // IEND chunk
    const IEND = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

    return Buffer.concat([
        PNG_SIGNATURE,
        createIHDR(width, height),
        idat,
        IEND
    ]);
}

// Create directories if they don't exist
const universeDir = '/Users/zitti/Documents/GitHub/azitti/book-library/assets/books/UniverseInANutshell';
const briefDir = '/Users/zitti/Documents/GitHub/azitti/book-library/assets/books/BriefAnswersToBigQuestions';

// Black covers for Universe in a Nutshell (RGB: 0, 0, 0)
const blackSpine = createSolidPNG(200, 800, 0, 0, 0);
const blackBack = createSolidPNG(600, 800, 0, 0, 0);

fs.writeFileSync(path.join(universeDir, 'Spine.png'), blackSpine);
fs.writeFileSync(path.join(universeDir, 'BackCover.png'), blackBack);
console.log('✅ Created black spine and back cover for Universe in a Nutshell');

// White covers for Brief Answers (RGB: 255, 255, 255)
const whiteSpine = createSolidPNG(200, 800, 255, 255, 255);
const whiteBack = createSolidPNG(600, 800, 255, 255, 255);

fs.writeFileSync(path.join(briefDir, 'Spine.png'), whiteSpine);
fs.writeFileSync(path.join(briefDir, 'BackCover.png'), whiteBack);
console.log('✅ Created white spine and back cover for Brief Answers to Big Questions');

console.log('\nGenerated files:');
console.log('- UniverseInANutshell/Spine.png (200x800, black)');
console.log('- UniverseInANutshell/BackCover.png (600x800, black)');
console.log('- BriefAnswersToBigQuestions/Spine.png (200x800, white)');
console.log('- BriefAnswersToBigQuestions/BackCover.png (600x800, white)');