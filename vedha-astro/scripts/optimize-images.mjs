/**
 * Build delivery images from originals in public/images/_source/ (or IMAGE_SOURCE_DIR).
 *
 * Rules for sharpness:
 * - Section photo JPEGs are copied from the master (no second lossy pass).
 * - WebP is generated at high quality from the master.
 * - Only heroes / posters / work cards / card thumbs are resized.
 *
 * Usage:
 *   IMAGE_SOURCE_DIR=/path node scripts/optimize-images.mjs
 *   node scripts/optimize-images.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = path.join(root, "public", "images");
const localSourceDir = path.join(imagesDir, "_source");
const envSourceRoot = process.env.IMAGE_SOURCE_DIR
  ? path.resolve(process.env.IMAGE_SOURCE_DIR)
  : null;

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

async function resolveSource(relFromPublic) {
  const candidates = [];
  if (envSourceRoot) candidates.push(path.join(envSourceRoot, relFromPublic));
  if (relFromPublic.startsWith("images/")) {
    const base = path.basename(relFromPublic);
    candidates.push(path.join(localSourceDir, base));
    if (/\.jpe?g$/i.test(base)) {
      candidates.push(path.join(localSourceDir, base.replace(/\.jpe?g$/i, ".png")));
    }
  }
  if (relFromPublic.endsWith("hero-3d-poster.jpg")) {
    candidates.push(path.join(root, "public", "videos", "hero-3d-poster.src.jpg"));
  }
  candidates.push(path.join(root, "public", relFromPublic));
  for (const candidate of candidates) {
    if (await exists(candidate)) return candidate;
  }
  return null;
}

async function writeResized(inputPath, outputPath, { width, quality, format }) {
  let pipeline = sharp(inputPath, { failOn: "none" }).rotate().resize({
    width,
    height: width,
    fit: "inside",
    withoutEnlargement: true,
    kernel: sharp.kernel.lanczos3,
  });

  if (format === "webp") {
    pipeline = pipeline.webp({ quality, effort: 4, smartSubsample: true });
  } else if (format === "jpeg") {
    pipeline = pipeline.jpeg({
      quality,
      mozjpeg: true,
      chromaSubsampling: "4:4:4",
      trellisQuantisation: true,
      overshootDeringing: true,
    });
  }

  await pipeline.toFile(outputPath);
  const before = (await fs.stat(inputPath)).size;
  const after = (await fs.stat(outputPath)).size;
  console.log(
    `${path.relative(root, outputPath)}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`
  );
}

async function writeWebpSameSize(inputPath, outputPath, quality) {
  await sharp(inputPath, { failOn: "none" })
    .rotate()
    .webp({ quality, effort: 4, smartSubsample: true })
    .toFile(outputPath);
  const before = (await fs.stat(inputPath)).size;
  const after = (await fs.stat(outputPath)).size;
  console.log(
    `${path.relative(root, outputPath)}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`
  );
}

async function copyMaster(inputPath, outputPath) {
  await fs.copyFile(inputPath, outputPath);
  const size = (await fs.stat(outputPath)).size;
  console.log(`${path.relative(root, outputPath)}: copied master ${(size / 1024).toFixed(0)}KB`);
}

async function optimizeHero() {
  for (const name of heroSlides) {
    const input = await resolveSource(`images/${name}`);
    if (!input) continue;
    const base = name.replace(/\.(jpe?g|png)$/i, "");
    const webp = path.join(imagesDir, `${base}.webp`);
    const jpeg = path.join(imagesDir, `${base}.jpg`);
    const tmpJpeg = path.join(imagesDir, `${base}.opt.jpg`);
    // 2400 ≈ 1.25×–2× common desktop widths; quality high enough to avoid haze
    await writeResized(input, webp, { width: 2400, quality: 92, format: "webp" });
    await writeResized(input, tmpJpeg, { width: 2400, quality: 90, format: "jpeg" });
    await fs.rename(tmpJpeg, jpeg);
  }
}

async function optimizeWork() {
  for (const name of workCards) {
    let input = await resolveSource(`images/${name}`);
    if (!input && /\.png$/i.test(name)) {
      input = await resolveSource(`images/${name.replace(/\.png$/i, ".jpg")}`);
    }
    if (!input) continue;
    const base = name.replace(/\.(jpe?g|png)$/i, "");
    await writeResized(input, path.join(imagesDir, `${base}.webp`), {
      width: 1600,
      quality: 92,
      format: "webp",
    });
    const tmp = path.join(imagesDir, `${base}.opt.jpg`);
    await writeResized(input, tmp, { width: 1600, quality: 90, format: "jpeg" });
    await fs.rename(tmp, path.join(imagesDir, `${base}.jpg`));
  }
}

async function optimizePhotos() {
  const listingDir = (await exists(localSourceDir))
    ? localSourceDir
    : envSourceRoot
      ? path.join(envSourceRoot, "images")
      : imagesDir;
  const files = await fs.readdir(listingDir);
  const photoNames = [
    ...files.filter((n) => /^photo-.*\.(jpe?g|png)$/i.test(n)),
    ...(await fs.readdir(imagesDir)).filter((n) => /^photo-.*\.jpe?g$/i.test(n)),
  ];

  const seen = new Set();
  for (const name of photoNames) {
    const base = name.replace(/\.(jpe?g|png)$/i, "");
    if (seen.has(base) || base.endsWith("-card")) continue;
    seen.add(base);

    const input = await resolveSource(`images/${name}`);
    if (!input) continue;

    // Keep the master JPEG — re-encoding already-compressed photos causes haze
    const jpegOut = path.join(imagesDir, `${base}.jpg`);
    if (path.resolve(input) !== path.resolve(jpegOut)) {
      await copyMaster(input, jpegOut);
    } else {
      console.log(`${path.relative(root, jpegOut)}: already master`);
    }

    await writeWebpSameSize(input, path.join(imagesDir, `${base}.webp`), 92);
    await writeResized(input, path.join(imagesDir, `${base}-card.webp`), {
      width: 1400,
      quality: 90,
      format: "webp",
    });
  }
}

async function optimizePoster() {
  const input = await resolveSource("videos/hero-3d-poster.jpg");
  if (!input) return;
  const poster = path.join(root, "public", "videos", "hero-3d-poster.jpg");
  const webp = path.join(root, "public", "videos", "hero-3d-poster.webp");
  if (path.resolve(input) !== path.resolve(poster)) {
    await copyMaster(input, poster);
  }
  await writeWebpSameSize(input, webp, 92);
}

console.log("Optimizing images (preserve masters, high-quality WebP)…");
if (envSourceRoot) console.log(`Source: ${envSourceRoot}`);
await optimizeHero();
await optimizeWork();
await optimizePhotos();
await optimizePoster();
console.log("Done.");
