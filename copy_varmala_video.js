const fs = require('fs');
const path = require('path');

const src = `C:\\Users\\himan\\Downloads\\emotional-varmala-moment-varmala-ceremony-ideas-indian-wedding-videos-wedding-reels.mp4`;
const destDir = path.join(__dirname, 'assets', 'videos');
const dest = path.join(destDir, 'varmala_moment.mp4');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('Varmala video copied successfully to', dest);
