import type { APIRoute } from "astro";
import {
  createEstimatorAddon,
  createEstimatorBase,
  deleteEstimatorAddon,
  deleteEstimatorBase,
  setAddonRecommendedBases,
  slugifyId,
  updateEstimatorAddon,
  updateEstimatorBase,
  type AddonGroup,
} from "../../../lib/estimator-catalog";

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get("_action") ?? "");
  const fallback = String(form.get("_return") ?? "/admin/estimator/");
  const wantsJson = (request.headers.get("Accept") || "").includes("application/json");
  const done = (path: string, payload: Record<string, unknown> = { ok: true }) =>
    wantsJson ? Response.json(payload) : redirect(path);
  const fail = (code: string, status = 400) =>
    wantsJson
      ? Response.json({ ok: false, error: code }, { status })
      : redirect(`${fallback}?error=${code}`);

  try {
    if (action === "create-base" || action === "update-base") {
      const name = String(form.get("name") ?? "").trim();
      if (!name) return fail("missing");
      const input = {
        id: slugifyId(String(form.get("id") ?? "") || name),
        name,
        description: String(form.get("description") ?? "").trim(),
        priceAed: Number(form.get("priceAed") ?? 0),
        image: String(form.get("image") ?? "").trim(),
        weeksMin: Number(form.get("weeksMin") ?? 2),
        weeksMax: Number(form.get("weeksMax") ?? 4),
        sortOrder: Number(form.get("sortOrder") ?? 0),
        recommendedIds: form.getAll("recommended").map(String),
      };
      if (action === "create-base") {
        const id = await createEstimatorBase(input);
        return done(`/admin/estimator/?saved=1`, { ok: true, id, type: "base" });
      }
      const id = String(form.get("id") ?? "");
      await updateEstimatorBase(id, input);
      return done(`/admin/estimator/?saved=1`, { ok: true, id, type: "base" });
    }

    if (action === "delete-base") {
      await deleteEstimatorBase(String(form.get("id") ?? ""));
      return done("/admin/estimator/?saved=1", { ok: true, deleted: true, type: "base" });
    }

    if (action === "create-addon" || action === "update-addon") {
      const name = String(form.get("name") ?? "").trim();
      if (!name) return fail("missing");
      const input = {
        id: slugifyId(String(form.get("id") ?? "") || name),
        name,
        description: String(form.get("description") ?? "").trim(),
        priceAed: Number(form.get("priceAed") ?? 0),
        group: String(form.get("group") ?? "platform") as AddonGroup,
        image: String(form.get("image") ?? "").trim(),
        weeksExtra: Number(form.get("weeksExtra") ?? 0),
        popular: form.get("popular") === "on",
        sortOrder: Number(form.get("sortOrder") ?? 0),
      };
      const recommendFor = form.getAll("recommendFor").map(String);
      if (action === "create-addon") {
        const id = await createEstimatorAddon(input);
        await setAddonRecommendedBases(id, recommendFor);
        return done(`/admin/estimator/?saved=1`, { ok: true, id, type: "addon" });
      }
      const id = String(form.get("id") ?? "");
      await updateEstimatorAddon(id, input);
      await setAddonRecommendedBases(id, recommendFor);
      return done(`/admin/estimator/?saved=1`, { ok: true, id, type: "addon" });
    }

    if (action === "delete-addon") {
      await deleteEstimatorAddon(String(form.get("id") ?? ""));
      return done("/admin/estimator/?saved=1", { ok: true, deleted: true, type: "addon" });
    }

    return fail("unknown", 400);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const code =
      message.includes("already exists") || message.includes("duplicate") || message.includes("unique")
        ? "exists"
        : "save";
    return fail(code, 500);
  }
};
