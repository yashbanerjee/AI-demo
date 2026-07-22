import { defineMiddleware } from "astro:middleware";
import { SESSION_COOKIE, verifyToken } from "./lib/auth";

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  const isAdminPage = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isAdminApi = pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/login");

  if (isAdminPage || isAdminApi) {
    const authorized = verifyToken(context.cookies.get(SESSION_COOKIE)?.value);
    if (!authorized) {
      if (isAdminApi) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      return context.redirect("/admin/login");
    }
  }

  return next();
});
