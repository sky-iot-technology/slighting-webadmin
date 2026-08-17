const fs = require('fs');
const path = require('path');

const STYLES = {
  light:
    'https://tiles.goong.io/assets/goong_map_web.json?api_key=VoqnNoD8bdeW3Tc9OWM3vx3ebBDXRCEKBBWEkF1o',
  dark: 'https://tiles.goong.io/assets/goong_map_dark.json?api_key=VoqnNoD8bdeW3Tc9OWM3vx3ebBDXRCEKBBWEkF1o',
  marker_light:
    'https://tiles.goong.io/assets/goong_light_v2.json?api_key=VoqnNoD8bdeW3Tc9OWM3vx3ebBDXRCEKBBWEkF1o'
};

const dir = path.join(__dirname, 'map-styles');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

async function downloadAndClean() {
  for (const [name, url] of Object.entries(STYLES)) {
    try {
      console.log(`Downloading style: ${name}...`);
      const response = await fetch(url);
      const style = await response.json();

      if (style && style.layers) {
        const originalLength = style.layers.length;
        style.layers = style.layers.filter((layer) => layer.id !== 'poi-tree');
        console.log(
          `Cleaned ${name}: removed ${originalLength - style.layers.length} layers.`
        );
      }

      const filePath = path.join(dir, `${name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(style, null, 2));
      console.log(`Saved to ${filePath}`);
    } catch (err) {
      console.error(`Error processing ${name}:`, err);
    }
  }
}

downloadAndClean();
