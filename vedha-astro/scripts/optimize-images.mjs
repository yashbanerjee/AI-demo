/**
 * Compress and resize public images for page-speed.
 * Usage: node scripts/optimize-images.mjs
 *
 * - Hero slides → max 1920w WebP + JPEG (quality ~72)
 * - Work cards → max 900w WebP (+ JPEG fallback for .png sources)
 * - Section photos → max 1600w WebP + recompressed JPEG
 * - Card thumbs → max 720w WebP for service grids
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = path.join(root, "public", "images");

const heroSlides = [
  "hero-slide-city.jpg",
  "hero-slide-mountains.jpg",
  "hero-slide-interchange.jpg",
  "hero-slide-fields.jpg",
];

const workCards = ["work-cop28.png", "work-dunkin.png", "work-det.jpg", "work-baskin.jpg"];

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function writeVariant(inputPath, outputPath, { width, quality = 72, format = "webp" }) {
  const pipeline = sharp(inputPath).rotate().resize({
    width,
    height: width,
    fit: "inside",
    withoutEnlargement: true,
  });

  if (format === "webp") {
    await pipeline.webp({ quality, effort: 5 }).toFile(outputPath);
  } else if (format === "jpeg") {
    await pipeline.jpeg({ quality, mozjpeg: true }).toFile(outputPath);
  } else if (format === "png") {
    await pipeline.png({ quality, compressionLevel: 9 }).toFile(outputPath);
  }

  const before = (await fs.stat(inputPath)).size;
  const after = (await fs.stat(outputPath)).size;
  const rel = path.relative(root, outputPath);
  console.log(
    `${rel}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`
  );
}

async function optimizeHero() {
  for (const name of heroSlides) {
    const input = path.join(imagesDir, name);
    if (!(await exists(input))) continue;
    const base = name.replace(/\.(jpe?g|png)$/i, "");
    const webp = path.join(imagesDir, `${base}.webp`);
    const jpeg = path.join(imagesDir, `${base}.jpg`);
    // Write to temp then replace jpeg so we don't read/write same file mid-stream
    const tmpJpeg = path.join(imagesDir, `${base}.opt.jpg`);
    await writeVariant(input, webp, { width: 1920, quality: 70, format: "webp" });
    await writeVariant(input, tmpJpeg, { width: 1920, quality: 72, format: "jpeg" });
    await fs.rename(tmpJpeg, jpeg);
  }
}

async function optimizeWork() {
  for (const name of workCards) {
    const input = path.join(imagesDir, name);
    if (!(await exists(input))) continue;
    const base = name.replace(/\.(jpe?g|png)$/i, "");
    await writeVariant(input, path.join(imagesDir, `${base}.webp`), {
      width: 900,
      quality: 72,
      format: "webp",
    });
    const tmp = path.join(imagesDir, `${base}.opt.jpg`);
    await writeVariant(input, tmp, { width: 900, quality: 75, format: "jpeg" });
    await fs.rename(tmp, path.join(imagesDir, `${base}.jpg`));
  }
}

async function optimizePhotos() {
  const files = await fs.readdir(imagesDir);
  for (const name of files) {
    if (!/^photo-.*\.jpe?g$/i.test(name)) continue;
    const input = path.join(imagesDir, name);
    const base = name.replace(/\.(jpe?g|png)$/i, "");
    await writeVariant(input, path.join(imagesDir, `${base}.webp`), {
      width: 1600,
      quality: 72,
      format: "webp",
    });
    await writeVariant(input, path.join(imagesDir, `${base}-card.webp`), {
      width: 720,
      quality: 70,
      format: "webp",
    });
    const tmp = path.join(imagesDir, `${base}.opt.jpg`);
    await writeVariant(input, tmp, { width: 1600, quality: 74, format: "jpeg" });
    await fs.rename(tmp, path.join(imagesDir, `${base}.jpg`));
  }
}

async function optimizePoster() {
  const poster = path.join(root, "public", "videos", "hero-3d-poster.jpg");
  if (!(await exists(poster))) return;
  const webp = path.join(root, "public", "videos", "hero-3d-poster.webp");
  const tmp = path.join(root, "public", "videos", "hero-3d-poster.opt.jpg");
  await writeVariant(poster, webp, { width: 1600, quality: 70, format: "webp" });
  await writeVariant(poster, tmp, { width: 1600, quality: 72, format: "jpeg" });
  await fs.rename(tmp, poster);
}

console.log("Optimizing images…");
await optimizeHero();
await optimizeWork();
await optimizePhotos();
await optimizePoster();
console.log("Done.");
