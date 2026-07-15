import type { APIRoute } from "astro";
import { SESSION_COOKIE, checkPassword, createToken } from "../../../lib/auth";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");

  if (!checkPassword(password)) {
    return redirect("/admin/login?error=1");
  }

  cookies.set(SESSION_COOKIE, createToken(), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    maxAge: 7 * 24 * 60 * 60,
  });
  return redirect("/admin");
};
