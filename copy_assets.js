const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

try {
  fs.copyFileSync(
    'C:\\Users\\himan\\.gemini\\antigravity-ide\\brain\\c9011e3a-6c8b-4852-9ca3-26b978a952f0\\wedding_hero_bg_1788172216085.png',
    path.join(assetsDir, 'wedding_hero_bg.png')
  );
  fs.copyFileSync(
    'C:\\Users\\himan\\.gemini\\antigravity-ide\\brain\\c9011e3a-6c8b-4852-9ca3-26b978a952f0\\wedding_anthem_card_1788172234295.png',
    path.join(assetsDir, 'wedding_anthem_card.png')
  );
  fs.copyFileSync(
    'C:\\Users\\himan\\.gemini\\antigravity-ide\\brain\\c9011e3a-6c8b-4852-9ca3-26b978a952f0\\wedding_vinyl_keepsake_1788172252770.png',
    path.join(assetsDir, 'wedding_vinyl_keepsake.png')
  );
  console.log('Assets copied successfully!');
} catch (err) {
  console.error('Error copying assets:', err);
}
