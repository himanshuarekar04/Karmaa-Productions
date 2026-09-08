const fs = require('fs');
const path = require('path');

const imgs = [
  { src: `C:\\Users\\himan\\Downloads\\6b8553d5613d0ff5947583e62724958f.jpg`, dest: 'film35mm_still_3.jpg' },
  { src: `C:\\Users\\himan\\Downloads\\9105a8c8ee80abff386925db2861a114.jpg`, dest: 'film35mm_still_4.jpg' },
];

const destDir = path.join(__dirname, 'assets', 'images');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

imgs.forEach(({ src, dest }) => {
  fs.copyFileSync(src, path.join(destDir, dest));
  console.log(`Copied: ${dest}`);
});
console.log('All 35mm images ready!');
