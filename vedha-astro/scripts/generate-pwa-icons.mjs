import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "public", "icons");
fs.mkdirSync(dir, { recursive: true });

const mark = fs
  .readFileSync(path.join(process.cwd(), "public", "images", "vedha-mark.svg"), "utf8")
  .replace(/fill="#E5FF00"/g, 'fill="#F4F4F2"');

async function makeIcon(size, filename) {
  const pad = Math.round(size * 0.18);
  const inner = size - pad * 2;
  const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#0E0E0E"/>
  <g transform="translate(${pad}, ${pad})">
    <svg width="${inner}" height="${inner}" viewBox="0 0 566 493" preserveAspectRatio="xMidYMid meet">
      ${mark.replace(/<\/?svg[^>]*>/g, "")}
    </svg>
  </g>
</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(dir, filename));
  console.log("wrote", filename);
}

await makeIcon(192, "icon-192.png");
await makeIcon(512, "icon-512.png");
await makeIcon(512, "icon-512-maskable.png");
await makeIcon(180, "apple-touch-icon.png");
