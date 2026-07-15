import type { APIRoute } from "astro";
import { deleteSeo, upsertSeo } from "../../../lib/db";

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get("_action") ?? "upsert");
  const path = String(form.get("path") ?? "").trim();

  if (!path.startsWith("/")) {
    return redirect("/admin/seo?error=path");
  }

  if (action === "delete") {
    await deleteSeo(path);
  } else {
    await upsertSeo({
      path,
      title: String(form.get("title") ?? "").trim() || null,
      description: String(form.get("description") ?? "").trim() || null,
      og_image: String(form.get("og_image") ?? "").trim() || null,
    });
  }

  return redirect("/admin/seo?saved=1");
};
