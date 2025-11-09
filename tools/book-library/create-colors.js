const fs = require('fs');

// Base64 encoded 1x1 pixel PNGs
// Black pixel PNG
const blackPNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNgYGBgAAAABQABXvMqOgAAAABJRU5ErkJggg==';

// White pixel PNG
const whitePNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

// Update Universe in a Nutshell back cover to black
const blackBuffer = Buffer.from(blackPNG, 'base64');
fs.writeFileSync('/Users/zitti/Documents/GitHub/azitti/book-library/assets/books/UniverseInANutshell/BackCover.png', blackBuffer);
console.log('Updated Universe in a Nutshell BackCover.png to black');

// Create white spine and back cover for Brief Answers
const whiteBuffer = Buffer.from(whitePNG, 'base64');
fs.writeFileSync('/Users/zitti/Documents/GitHub/azitti/book-library/assets/books/BriefAnswersToBigQuestions/Spine.png', whiteBuffer);
fs.writeFileSync('/Users/zitti/Documents/GitHub/azitti/book-library/assets/books/BriefAnswersToBigQuestions/BackCover.png', whiteBuffer);
console.log('Created white Spine.png and BackCover.png for Brief Answers to Big Questions');