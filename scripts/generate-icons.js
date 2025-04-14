const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Ensure the icons directory exists
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes required for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  try {
    // Convert SVG to PNG
    await sharp(path.join(__dirname, '../public/icon.svg'))
      .png()
      .toFile(path.join(__dirname, '../public/icon.png'));

    // Generate icons in all required sizes
    for (const size of sizes) {
      await sharp(path.join(__dirname, '../public/icon.svg'))
        .resize(size, size)
        .png()
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
    }

    console.log('Icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 