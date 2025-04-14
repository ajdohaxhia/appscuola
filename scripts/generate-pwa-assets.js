const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const iconsDir = path.join(__dirname, '../public/icons');
const screenshotsDir = path.join(__dirname, '../public/screenshots');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Icon sizes from manifest
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate icons
async function generateIcons() {
  const sourceIcon = path.join(__dirname, '../public/icon.png');
  
  if (!fs.existsSync(sourceIcon)) {
    console.error('Source icon not found at:', sourceIcon);
    return;
  }

  for (const size of iconSizes) {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    await sharp(sourceIcon)
      .resize(size, size)
      .toFile(outputPath);
    console.log(`Generated ${size}x${size} icon`);
  }

  // Generate shortcut icons
  const shortcuts = [
    { name: 'dashboard', size: 96 },
    { name: 'ai', size: 96 },
    { name: 'flashcards', size: 96 }
  ];

  for (const shortcut of shortcuts) {
    const outputPath = path.join(iconsDir, `${shortcut.name}-${shortcut.size}x${shortcut.size}.png`);
    await sharp(sourceIcon)
      .resize(shortcut.size, shortcut.size)
      .toFile(outputPath);
    console.log(`Generated ${shortcut.name} shortcut icon`);
  }
}

// Generate screenshots
async function generateScreenshots() {
  const screenshots = [
    { name: 'home', width: 1280, height: 720 },
    { name: 'dashboard', width: 1280, height: 720 },
    { name: 'ai-chat', width: 1280, height: 720 }
  ];

  // Note: This is a placeholder. In a real scenario, you would:
  // 1. Use a headless browser to capture screenshots
  // 2. Or manually create and place screenshots in the public/screenshots directory
  console.log('Please manually create screenshots and place them in public/screenshots/');
  console.log('Required screenshots:', screenshots.map(s => `${s.name}.png`).join(', '));
}

// Run the generation
async function main() {
  try {
    await generateIcons();
    await generateScreenshots();
    console.log('PWA assets generation complete!');
  } catch (error) {
    console.error('Error generating PWA assets:', error);
    process.exit(1);
  }
}

main(); 