const fs = require('fs');
const path = require('path');

const src = `C:\\Users\\himan\\Downloads\\couple-running-on-beach-at-sunset-couple-running-on-beach-blurry-video-couple-on-the-beach-blurry-love-story-video-aesthetic.mp4`;
const destDir = path.join(__dirname, 'assets', 'videos');
const dest = path.join(destDir, 'beach_sunset.mp4');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('Beach video copied successfully to', dest);
