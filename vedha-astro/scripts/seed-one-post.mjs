import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import pg from "pg";
import matter from "gray-matter";

const slug = process.argv[2] ?? "ecommerce-mobile-app-features-uae";
const srcImg = process.argv[3];
const outImg = `public/images/blog/${slug}.jpg`;

const env = Object.fromEntries(
  fs
    .readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      let val = l.slice(i + 1);
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      return [l.slice(0, i), val];
    })
);

fs.mkdirSync(path.dirname(outImg), { recursive: true });

if (srcImg) {
  const meta = await sharp(srcImg).metadata();
  console.log("cover source:", meta.format, meta.width, meta.height);
  await sharp(srcImg)
    .resize(1600, 900, { fit: "cover", withoutEnlargement: true })
    .jpeg({ quality: 88 })
    .toFile(outImg);
  console.log("wrote", outImg, fs.statSync(outImg).size);
}

const file = `src/content/blog/${slug}.md`;
const { data, content } = matter(fs.readFileSync(file, "utf8"));
const pool = new pg.Pool({ connectionString: env.DATABASE_URL });

const cover = data.image ?? `/images/blog/${slug}.jpg`;
await pool.query(
  `INSERT INTO posts (slug, title, description, content, author, tags, cover_image, pub_date, draft)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
   ON CONFLICT (slug) DO UPDATE SET
     title = EXCLUDED.title,
     description = EXCLUDED.description,
     content = EXCLUDED.content,
     author = EXCLUDED.author,
     tags = EXCLUDED.tags,
     cover_image = EXCLUDED.cover_image,
     pub_date = EXCLUDED.pub_date,
     draft = EXCLUDED.draft,
     updated_date = now(),
     updated_at = now()`,
  [
    slug,
    data.title ?? slug,
    data.description ?? "",
    content.trim(),
    data.author ?? "Vedha Team",
    data.tags ?? [],
    cover,
    data.pubDate ?? new Date(),
    data.draft ?? false,
  ]
);

const seoTitle = process.argv[4] || null;
const seoDesc = process.argv[5] || data.description || null;
const pagePath = `/blog/${slug}`;
await pool.query(
  `INSERT INTO page_seo (path, title, description, og_image)
   VALUES ($1,$2,$3,$4)
   ON CONFLICT (path) DO UPDATE SET
     title = EXCLUDED.title,
     description = EXCLUDED.description,
     og_image = EXCLUDED.og_image,
     updated_at = now()`,
  [pagePath, seoTitle, seoDesc, cover]
);

const { rows } = await pool.query(
  "SELECT slug, title, left(description, 80) AS description, cover_image, draft FROM posts WHERE slug = $1",
  [slug]
);
console.log("post:", rows[0]);
const seo = await pool.query("SELECT * FROM page_seo WHERE path = $1", [pagePath]);
console.log("seo:", seo.rows[0]);
await pool.end();
