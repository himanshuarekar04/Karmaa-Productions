const fs = require('fs');
const path = require('path');

const img1 = `C:\\Users\\himan\\Downloads\\d1be9bc40fa4d0c5071acdf249acc639.jpg`;
const img2 = `C:\\Users\\himan\\Downloads\\06e6d0ac796f81ac769e60d3493c780e.jpg`;

const destDir = path.join(__dirname, 'assets', 'images');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(img1, path.join(destDir, 'film35mm_still_1.jpg'));
fs.copyFileSync(img2, path.join(destDir, 'film35mm_still_2.jpg'));

console.log('35mm images copied successfully to', destDir);
