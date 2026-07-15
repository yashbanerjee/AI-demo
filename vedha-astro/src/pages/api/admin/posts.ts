import type { APIRoute } from "astro";
import { createPost, deletePost, getPostById, updatePost, type PostInput } from "../../../lib/db";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePost(form: FormData): PostInput {
  const title = String(form.get("title") ?? "").trim();
  const slugRaw = String(form.get("slug") ?? "").trim();
  return {
    title,
    slug: slugify(slugRaw || title),
    description: String(form.get("description") ?? "").trim(),
    content: String(form.get("content") ?? ""),
    author: String(form.get("author") ?? "Vedha Team").trim() || "Vedha Team",
    tags: String(form.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    cover_image: String(form.get("cover_image") ?? "").trim() || null,
    pub_date: form.get("pub_date") ? new Date(String(form.get("pub_date"))) : new Date(),
    draft: form.get("draft") === "on" || form.get("draft") === "true",
  };
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get("_action") ?? "create");

  try {
    if (action === "create") {
      const input = parsePost(form);
      if (!input.title || !input.slug) return redirect("/admin/posts/new?error=missing");
      const id = await createPost(input);
      return redirect(`/admin/posts/${id}?saved=1`);
    }

    const id = Number(form.get("id"));
    const existing = await getPostById(id);
    if (!existing) return new Response("Not found", { status: 404 });

    if (action === "update") {
      const input = parsePost(form);
      if (!input.title || !input.slug) return redirect(`/admin/posts/${id}?error=missing`);
      await updatePost(id, input);
      return redirect(`/admin/posts/${id}?saved=1`);
    }

    if (action === "delete") {
      await deletePost(id);
      return redirect("/admin");
    }

    return new Response("Unknown action", { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("posts_slug_key")) {
      return new Response("A post with this slug already exists.", { status: 409 });
    }
    return new Response(message, { status: 500 });
  }
};
