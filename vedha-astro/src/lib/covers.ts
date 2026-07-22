/**
 * Fallback covers for posts without an uploaded image.
 * The slug hash keeps each post's cover stable across the homepage,
 * blog index, and article page while spreading posts over the pool.
 */
const covers = [
  "/images/photo-lake-reflection.jpg",
  "/images/photo-moraine-lake.jpg",
  "/images/photo-mountain-mist.jpg",
  "/images/photo-waterfall.jpg",
  "/images/photo-cliff-coast.jpg",
  "/images/photo-alpine-glow.jpg",
  "/images/photo-forest-light.jpg",
  "/images/photo-blue-lake.jpg",
  "/images/photo-lake-jetty.jpg",
];

const hash = (s: string) =>
  [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);

export function coverFor(slug: string, image: string | null): string {
  return image || covers[hash(slug) % covers.length];
}
