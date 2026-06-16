import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import png2icons from 'png2icons';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.resolve(__dirname, '../build');

const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect x="64" y="64" width="896" height="896" rx="192" fill="url(#bg)"/>
  <circle cx="512" cy="512" r="220" fill="none" stroke="#ffffff" stroke-width="48" opacity="0.95"/>
  <circle cx="512" cy="512" r="36" fill="#ffffff"/>
  <path d="M512 292 L512 732 M292 512 L732 512" stroke="#ffffff" stroke-width="40" stroke-linecap="round" opacity="0.9"/>
  <path d="M320 704 L512 560 L704 704" fill="none" stroke="#93c5fd" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

async function generateIcons() {
  fs.mkdirSync(buildDir, { recursive: true });

  const pngBuffer = await sharp(Buffer.from(iconSvg)).png().resize(1024, 1024).toBuffer();

  const icoBuffer = png2icons.createICO(pngBuffer, png2icons.BICUBIC, 0, false);
  const icnsBuffer = png2icons.createICNS(pngBuffer, png2icons.BICUBIC, 0);

  if (!icoBuffer || !icnsBuffer) {
    throw new Error('图标转换失败');
  }

  fs.writeFileSync(path.join(buildDir, 'icon.png'), pngBuffer);
  fs.writeFileSync(path.join(buildDir, 'icon.ico'), icoBuffer);
  fs.writeFileSync(path.join(buildDir, 'icon.icns'), icnsBuffer);
  fs.writeFileSync(path.join(buildDir, 'icon-source.svg'), iconSvg.trim());

  console.log('已生成打包图标:');
  console.log('  build/icon.png   (1024x1024, Linux / 源图)');
  console.log('  build/icon.ico   (Windows)');
  console.log('  build/icon.icns  (macOS)');
  console.log('  build/icon-source.svg (可编辑源文件)');
}

generateIcons().catch((error) => {
  console.error(error);
  process.exit(1);
});
