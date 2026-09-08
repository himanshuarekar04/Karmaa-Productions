const fs = require('fs');
const path = require('path');

const videosDir = path.join(__dirname, 'assets', 'videos');
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

const videoSources = [
  {
    src: 'C:\\Users\\himan\\Downloads\\92117653999-fyp-foryourpage-unfrezzmyaccount-100kviews-viralvideo-viraltiktok-virtualstylist-pose-fotografia-coppia.mp4',
    dest: path.join(videosDir, 'video1.mp4')
  },
  {
    src: 'C:\\Users\\himan\\Downloads\\dr-priyanka-unique-pre-wedding-shoot-ideas-udaipur-couple-aesthetic-taj-mahal-pre-wedding-shoot.mp4',
    dest: path.join(videosDir, 'video2.mp4')
  },
  {
    src: 'C:\\Users\\himan\\Downloads\\romantic-couple-pose-couple-slow-motion-reels-couple-trending-couple-twirl.mp4',
    dest: path.join(videosDir, 'video3.mp4')
  },
  {
    src: 'C:\\Users\\himan\\Downloads\\royal-aesthetic-video-edits-for-couples-love-sacrifice-royal-romantic-aesthetic.mp4',
    dest: path.join(videosDir, 'video4.mp4')
  }
];

videoSources.forEach((v, index) => {
  try {
    if (fs.existsSync(v.src)) {
      fs.copyFileSync(v.src, v.dest);
      console.log(`Successfully copied Video ${index + 1} to ${v.dest}`);
    } else {
      console.warn(`Video ${index + 1} source not found at: ${v.src}`);
    }
  } catch (err) {
    console.error(`Error copying Video ${index + 1}:`, err);
  }
});
