import type { APIRoute } from "astro";
import crypto from "node:crypto";
import path from "node:path";
import { saveMedia } from "../../../lib/db";

const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);
const MAX_BYTES = 8 * 1024 * 1024;

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return Response.json({ error: `Unsupported file type: ${file.type}` }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File too large (max 8 MB)" }, { status: 413 });
  }

  const ext = path.extname(file.name).toLowerCase() || ".png";
  const base = path
    .basename(file.name, path.extname(file.name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "image";
  const filename = `${base}-${crypto.randomBytes(4).toString("hex")}${ext}`;

  await saveMedia(filename, file.type, Buffer.from(await file.arrayBuffer()));

  return Response.json({ url: `/media/${filename}` });
};
