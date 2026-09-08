const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

try {
  fs.copyFileSync(
    'C:\\Users\\himan\\.gemini\\antigravity-ide\\brain\\c9011e3a-6c8b-4852-9ca3-26b978a952f0\\indian_couple_hero_1788174231886.png',
    path.join(assetsDir, 'indian_hero.png')
  );
  fs.copyFileSync(
    'C:\\Users\\himan\\.gemini\\antigravity-ide\\brain\\c9011e3a-6c8b-4852-9ca3-26b978a952f0\\indian_couple_mandap_1788174254091.png',
    path.join(assetsDir, 'indian_mandap.png')
  );
  fs.copyFileSync(
    'C:\\Users\\himan\\.gemini\\antigravity-ide\\brain\\c9011e3a-6c8b-4852-9ca3-26b978a952f0\\indian_bride_portrait_1788174271027.png',
    path.join(assetsDir, 'indian_bride.png')
  );
  fs.copyFileSync(
    'C:\\Users\\himan\\.gemini\\antigravity-ide\\brain\\c9011e3a-6c8b-4852-9ca3-26b978a952f0\\indian_wedding_details_1788174290888.png',
    path.join(assetsDir, 'indian_details.png')
  );
  console.log('Indian aesthetic assets copied successfully!');
} catch (err) {
  console.error('Error copying Indian assets:', err);
}
