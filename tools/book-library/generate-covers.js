const fs = require('fs');
const path = require('path');

// Create a simple PNG with the specified color #1b161c
// We'll create a minimal PNG by hand since we don't have canvas libraries

function createSolidColorPNG(width, height, r, g, b) {
    // PNG signature
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    // IHDR chunk
    const ihdr = Buffer.alloc(25);
    ihdr.writeUInt32BE(13, 0); // chunk length
    ihdr.write('IHDR', 4);
    ihdr.writeUInt32BE(width, 8);
    ihdr.writeUInt32BE(height, 12);
    ihdr[16] = 8; // bit depth
    ihdr[17] = 2; // color type (RGB)
    ihdr[18] = 0; // compression
    ihdr[19] = 0; // filter
    ihdr[20] = 0; // interlace

    // Calculate CRC for IHDR
    const crc32 = require('crypto').createHash('crc32');

    // Create IDAT chunk with uncompressed data
    const zlib = require('zlib');
    const pixelData = Buffer.alloc(height * (1 + width * 3));

    let offset = 0;
    for (let y = 0; y < height; y++) {
        pixelData[offset++] = 0; // filter type none
        for (let x = 0; x < width; x++) {
            pixelData[offset++] = r;
            pixelData[offset++] = g;
            pixelData[offset++] = b;
        }
    }

    const compressed = zlib.deflateSync(pixelData);
    const idat = Buffer.alloc(12 + compressed.length);
    idat.writeUInt32BE(compressed.length, 0);
    idat.write('IDAT', 4);
    compressed.copy(idat, 8);

    // IEND chunk
    const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

    return Buffer.concat([signature, ihdr, idat, iend]);
}

// Color #1b161c = RGB(27, 22, 28)
const r = 27, g = 22, b = 28;

// Generate spine (200x800)
const spinePNG = createSolidColorPNG(200, 800, r, g, b);
fs.writeFileSync('/Users/zitti/Documents/GitHub/azitti/book-library/assets/books/UniverseInANutshell/Spine.png', spinePNG);

// Generate back cover (600x800)
const backCoverPNG = createSolidColorPNG(600, 800, r, g, b);
fs.writeFileSync('/Users/zitti/Documents/GitHub/azitti/book-library/assets/books/UniverseInANutshell/BackCover.png', backCoverPNG);

console.log('Created Spine.png and BackCover.png with color #1b161c');