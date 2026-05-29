/**
 * Preloads an image asynchronously
 * @param {string} src 
 * @returns {Promise<HTMLImageElement>}
 */
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`Failed to load sprite: ${src}`));
    img.src = src;
  });
};

/**
 * Programmatically blends two sprite images based on the selected genetic matrix mode.
 * @param {string} spriteAUrl - Path/URL of sprite A
 * @param {string} spriteBUrl - Path/URL of sprite B
 * @param {'overlay' | 'scanline' | 'dominant'} mode - Splicing blend mode
 * @returns {Promise<string>} - Base64 Data URL of the blended image
 */
export async function blendSprites(spriteAUrl, spriteBUrl, mode) {
  // Load both images in parallel
  const [imgA, imgB] = await Promise.all([
    loadImage(spriteAUrl),
    loadImage(spriteBUrl)
  ]);

  // Determine standard bounds to overlay correctly
  const width = Math.max(imgA.width, imgB.width);
  const height = Math.max(imgA.height, imgB.height);

  // Setup offscreen canvas for rendering Sprite A
  const canvasA = document.createElement('canvas');
  canvasA.width = width;
  canvasA.height = height;
  const ctxA = canvasA.getContext('2d');
  // Center Image A inside bounding box
  const dxA = (width - imgA.width) / 2;
  const dyA = (height - imgA.height) / 2;
  ctxA.drawImage(imgA, dxA, dyA);
  const dataA = ctxA.getImageData(0, 0, width, height).data;

  // Setup offscreen canvas for rendering Sprite B
  const canvasB = document.createElement('canvas');
  canvasB.width = width;
  canvasB.height = height;
  const ctxB = canvasB.getContext('2d');
  // Center Image B inside bounding box
  const dxB = (width - imgB.width) / 2;
  const dyB = (height - imgB.height) / 2;
  ctxB.drawImage(imgB, dxB, dyB);
  const dataB = ctxB.getImageData(0, 0, width, height).data;

  // Setup offscreen canvas for target output
  const canvasDest = document.createElement('canvas');
  canvasDest.width = width;
  canvasDest.height = height;
  const ctxDest = canvasDest.getContext('2d');
  const imgDataDest = ctxDest.createImageData(width, height);
  const dataDest = imgDataDest.data;

  // Perform pixel manipulation loop
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Extract pixel info for Sprite A
      const rA = dataA[idx];
      const gA = dataA[idx + 1];
      const bA = dataA[idx + 2];
      const aA = dataA[idx + 3];

      // Extract pixel info for Sprite B
      const rB = dataB[idx];
      const gB = dataB[idx + 1];
      const bB = dataB[idx + 2];
      const aB = dataB[idx + 3];

      // Check if pixels are solid
      const isSolidA = aA > 10;
      const isSolidB = aB > 10;

      if (isSolidA && isSolidB) {
        // OVERLAP AREA: Both genes present. Apply distinct blend logic!
        if (mode === 'scanline') {
          // Alternating horizontal strips of 6px
          if (Math.floor(y / 6) % 2 === 0) {
            dataDest[idx] = rA;
            dataDest[idx + 1] = gA;
            dataDest[idx + 2] = bA;
            dataDest[idx + 3] = aA;
          } else {
            dataDest[idx] = rB;
            dataDest[idx + 1] = gB;
            dataDest[idx + 2] = bB;
            dataDest[idx + 3] = aB;
          }
        } else if (mode === 'dominant') {
          // Checkerboard mosaic puzzle blocks of 20px
          const blockX = Math.floor(x / 20);
          const blockY = Math.floor(y / 20);
          // Deterministic hash to keep structure stable
          const hash = Math.sin(blockX * 12.9898 + blockY * 78.233) * 43758.5453123;
          const isA = (hash - Math.floor(hash)) > 0.5;

          if (isA) {
            dataDest[idx] = rA;
            dataDest[idx + 1] = gA;
            dataDest[idx + 2] = bA;
            dataDest[idx + 3] = aA;
          } else {
            dataDest[idx] = rB;
            dataDest[idx + 1] = gB;
            dataDest[idx + 2] = bB;
            dataDest[idx + 3] = aB;
          }
        } else {
          // Ghostly Overlay: 50% opacity blend
          dataDest[idx] = Math.round(rA * 0.5 + rB * 0.5);
          dataDest[idx + 1] = Math.round(gA * 0.5 + gB * 0.5);
          dataDest[idx + 2] = Math.round(bA * 0.5 + bB * 0.5);
          dataDest[idx + 3] = Math.max(aA, aB);
        }
        
        // Add a micro-glow or neon matrix highlights to the overlapping genetic grid
        // e.g. add a subtle cyan hue shift where they merge
        if (mode === 'overlay') {
          dataDest[idx] = Math.min(255, dataDest[idx] * 0.95);
          dataDest[idx + 1] = Math.min(255, dataDest[idx + 1] * 1.05 + 10); // slightly boost green/cyan
          dataDest[idx + 2] = Math.min(255, dataDest[idx + 2] * 1.1 + 15);
        }
      } else if (isSolidA) {
        // Sprite A exclusive pixel (retain exact original details)
        dataDest[idx] = rA;
        dataDest[idx + 1] = gA;
        dataDest[idx + 2] = bA;
        dataDest[idx + 3] = aA;
      } else if (isSolidB) {
        // Sprite B exclusive pixel (retain exact original details)
        dataDest[idx] = rB;
        dataDest[idx + 1] = gB;
        dataDest[idx + 2] = bB;
        dataDest[idx + 3] = aB;
      } else {
        // Fully transparent pixel
        dataDest[idx] = 0;
        dataDest[idx + 1] = 0;
        dataDest[idx + 2] = 0;
        dataDest[idx + 3] = 0;
      }
    }
  }

  // Draw processed image data back to destination canvas and export base64
  ctxDest.putImageData(imgDataDest, 0, 0);
  return canvasDest.toDataURL('image/png');
}

/**
 * Chroma-keys out standard screen backdrops (hot pink/neon magenta #FF00FF or electric green #00FF00)
 * on the fly in the browser to deliver a perfect transparent PNG style.
 * @param {string} srcUrl - Absolute or relative URL of the image
 * @returns {Promise<string>} - Base64 Data URL with background keyed out
 */
export async function chromaKeyBackground(srcUrl) {
  const img = await loadImage(srcUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // Pixel loop to transparently key out the backdrops
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Chroma key #1: Hot Pink / Neon Magenta (#FF00FF)
    const isMagenta = r > 180 && g < 100 && b > 180;

    // Chroma key #2: Chroma Green (#00FF00)
    const isGreen = r < 100 && g > 180 && b < 100;

    if (isMagenta || isGreen) {
      data[i + 3] = 0; // Fully transparent alpha
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

