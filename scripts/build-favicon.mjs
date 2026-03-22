import sharp from 'sharp';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

/** Source compass.png is 676×369; center-crop to square so the mark fills the tab slot. */
const SRC_W = 676;
const SRC_H = 369;
const CROP = Math.min(SRC_W, SRC_H);
const CROP_LEFT = Math.floor((SRC_W - CROP) / 2);

const SIZE = 256;
/** Scale mark to fill most of the canvas (tab icons are tiny; maximize legibility). */
const INNER = Math.round(SIZE * 0.92);

const srcPath = join(root, 'src/assets/compass.png');
const outPath = join(root, 'public/favicon.png');

const mark = await sharp(srcPath)
  .extract({ left: CROP_LEFT, top: 0, width: CROP, height: CROP })
  .resize(INNER, INNER, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: SIZE,
    height: SIZE,
    channels: 4,
    background: { r: 255, g: 245, b: 238, alpha: 1 },
  },
})
  .composite([{ input: mark, gravity: 'center' }])
  .png()
  .toFile(outPath);

console.log('Wrote', outPath);
