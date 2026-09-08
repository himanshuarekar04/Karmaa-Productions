const fs = require('fs');
const path = require('path');

const src = `C:\\Users\\himan\\Downloads\\jhuk-gaya-aasman-jo-tere-naam-sa-bruno-e-marrone-canzoni-d-amore-foto-romantiche.mp4`;
const destDir = path.join(__dirname, 'assets', 'videos');
const dest = path.join(destDir, 'music_video_story.mp4');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('Service 3 video copied successfully to', dest);
