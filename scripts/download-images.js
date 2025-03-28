import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  {
    url: 'https://img.freepik.com/free-vector/memory-game-landing-page_23-2148690459.jpg',
    name: 'memory-game.jpg'
  },
  {
    url: 'https://img.freepik.com/free-vector/puzzle-pieces-background-flat-design_23-2148182068.jpg',
    name: 'puzzle-game.jpg'
  },
  {
    url: 'https://img.freepik.com/free-vector/gradient-tetris-background_23-2149105331.jpg',
    name: 'tetris-game.jpg'
  },
  {
    url: 'https://img.freepik.com/free-vector/snake-game-concept_23-2148537119.jpg',
    name: 'snake-game.jpg'
  },
  {
    url: 'https://img.freepik.com/free-vector/2048-game-concept_23-2148538333.jpg',
    name: '2048-game.jpg'
  },
  {
    url: 'https://img.freepik.com/free-vector/memory-game-concept-illustration_114360-5760.jpg',
    name: 'memory-pro-game.jpg'
  },
  {
    url: 'https://img.freepik.com/free-vector/word-search-puzzle-game-concept_23-2148538334.jpg',
    name: 'word-puzzle-game.jpg'
  },
  {
    url: 'https://img.freepik.com/free-vector/sudoku-game-concept_23-2148538335.jpg',
    name: 'sudoku-game.jpg'
  },
  {
    url: 'https://img.freepik.com/free-vector/memory-game-concept_23-2148538332.jpg',
    name: 'memory-game-2.jpg'
  },
  {
    url: 'https://img.freepik.com/free-vector/coming-soon-construction-illustration-design_24877-145730.jpg',
    name: 'coming-soon-1.jpg'
  },
  {
    url: 'https://img.freepik.com/free-vector/coming-soon-background-with-focus-light-effect_1017-27277.jpg',
    name: 'coming-soon-2.jpg'
  },
  {
    url: 'https://img.freepik.com/free-vector/gaming-banner-with-glitch-effect_23-2148537131.jpg',
    name: 'banner-bg.jpg'
  }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Downloaded: ${filepath}`);
          resolve();
        });
      } else {
        response.resume();
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
};

async function downloadAllImages() {
  const imagesDir = path.join(__dirname, '../public/images');
  
  // Create images directory if it doesn't exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  for (const image of images) {
    const filepath = path.join(imagesDir, image.name);
    try {
      await downloadImage(image.url, filepath);
    } catch (error) {
      console.error(`Error downloading ${image.name}:`, error.message);
    }
  }
}

downloadAllImages().then(() => {
  console.log('All images downloaded successfully!');
}).catch((error) => {
  console.error('Error downloading images:', error);
}); 