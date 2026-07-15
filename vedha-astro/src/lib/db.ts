import pg from "pg";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const connectionString =
  import.meta.env.DATABASE_URL ??
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@localhost:5433/vedha";

// Survive dev-server HMR without leaking connection pools
const g = globalThis as unknown as { __vedhaPool?: pg.Pool; __vedhaReady?: Promise<void> };

export const pool: pg.Pool = (g.__vedhaPool ??= new pg.Pool({ connectionString, max: 10 }));

export function ensureDb(): Promise<void> {
  return (g.__vedhaReady ??= init());
}

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT 'Vedha Team',
      tags TEXT[] NOT NULL DEFAULT '{}',
      cover_image TEXT,
      pub_date TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_date TIMESTAMPTZ,
      draft BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS page_seo (
      path TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      og_image TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS media (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      mime TEXT NOT NULL,
      data BYTEA NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  const { rows } = await pool.query("SELECT count(*)::int AS n FROM posts");
  if (rows[0].n === 0) await seedFromMarkdown();
}

/** One-time import of the original markdown posts into the database. */
async function seedFromMarkdown() {
  const dir = path.join(process.cwd(), "src", "content", "blog");
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const slug = file.replace(/\.md$/, "");
    const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
    await pool.query(
      `INSERT INTO posts (slug, title, description, content, author, tags, cover_image, pub_date, draft)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (slug) DO NOTHING`,
      [
        slug,
        data.title ?? slug,
        data.description ?? "",
        content.trim(),
        data.author ?? "Vedha Team",
        data.tags ?? [],
        data.image ?? null,
        data.pubDate ?? new Date(),
        data.draft ?? false,
      ]
    );
  }
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  tags: string[];
  cover_image: string | null;
  pub_date: Date;
  updated_date: Date | null;
  draft: boolean;
}

export async function listPosts(opts: { includeDrafts?: boolean } = {}): Promise<Post[]> {
  await ensureDb();
  const where = opts.includeDrafts ? "" : "WHERE NOT draft";
  const { rows } = await pool.query(`SELECT * FROM posts ${where} ORDER BY pub_date DESC`);
  return rows;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  await ensureDb();
  const { rows } = await pool.query("SELECT * FROM posts WHERE slug = $1", [slug]);
  return rows[0] ?? null;
}

export async function getPostById(id: number): Promise<Post | null> {
  await ensureDb();
  const { rows } = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export interface PostInput {
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  tags: string[];
  cover_image: string | null;
  pub_date: Date;
  draft: boolean;
}

export async function createPost(p: PostInput): Promise<number> {
  await ensureDb();
  const { rows } = await pool.query(
    `INSERT INTO posts (slug, title, description, content, author, tags, cover_image, pub_date, draft)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
    [p.slug, p.title, p.description, p.content, p.author, p.tags, p.cover_image, p.pub_date, p.draft]
  );
  return rows[0].id;
}

export async function updatePost(id: number, p: PostInput): Promise<void> {
  await ensureDb();
  await pool.query(
    `UPDATE posts SET slug=$2, title=$3, description=$4, content=$5, author=$6, tags=$7,
       cover_image=$8, pub_date=$9, draft=$10, updated_date=now(), updated_at=now()
     WHERE id=$1`,
    [id, p.slug, p.title, p.description, p.content, p.author, p.tags, p.cover_image, p.pub_date, p.draft]
  );
}

export async function deletePost(id: number): Promise<void> {
  await ensureDb();
  await pool.query("DELETE FROM posts WHERE id = $1", [id]);
}

export interface PageSeo {
  path: string;
  title: string | null;
  description: string | null;
  og_image: string | null;
}

/** Normalize a pathname so lookups are stable: no trailing slash except root. */
export function normalizePath(pathname: string): string {
  if (pathname !== "/" && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

export async function getSeoForPath(pathname: string): Promise<PageSeo | null> {
  try {
    await ensureDb();
    const { rows } = await pool.query("SELECT * FROM page_seo WHERE path = $1", [
      normalizePath(pathname),
    ]);
    return rows[0] ?? null;
  } catch {
    // If the database is unreachable the public site must still render
    return null;
  }
}

export async function listSeo(): Promise<PageSeo[]> {
  await ensureDb();
  const { rows } = await pool.query("SELECT * FROM page_seo ORDER BY path");
  return rows;
}

export async function upsertSeo(seo: PageSeo): Promise<void> {
  await ensureDb();
  await pool.query(
    `INSERT INTO page_seo (path, title, description, og_image)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (path) DO UPDATE SET title=$2, description=$3, og_image=$4, updated_at=now()`,
    [normalizePath(seo.path), seo.title, seo.description, seo.og_image]
  );
}

export async function deleteSeo(pathname: string): Promise<void> {
  await ensureDb();
  await pool.query("DELETE FROM page_seo WHERE path = $1", [normalizePath(pathname)]);
}

export async function saveMedia(filename: string, mime: string, data: Buffer): Promise<void> {
  await ensureDb();
  await pool.query(
    "INSERT INTO media (filename, mime, data) VALUES ($1,$2,$3)",
    [filename, mime, data]
  );
}

export async function getMedia(
  filename: string
): Promise<{ mime: string; data: Buffer } | null> {
  await ensureDb();
  const { rows } = await pool.query("SELECT mime, data FROM media WHERE filename = $1", [filename]);
  return rows[0] ?? null;
}

export async function listMedia(): Promise<{ filename: string; mime: string; created_at: Date }[]> {
  await ensureDb();
  const { rows } = await pool.query(
    "SELECT filename, mime, created_at FROM media ORDER BY created_at DESC"
  );
  return rows;
}
