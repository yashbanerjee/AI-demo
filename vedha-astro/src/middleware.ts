import { defineMiddleware } from "astro:middleware";
import { SESSION_COOKIE, verifyToken } from "./lib/auth";

/*
 * The old WordPress site on this domain was hacked and thousands of casino
 * spam pages got indexed by Google. Returning "410 Gone" (instead of 404)
 * tells crawlers those URLs are permanently deleted, which deindexes them
 * faster. None of these patterns overlap with real routes.
 */
const realRoutes = /^\/(blog|services|products|contact|llms|admin|api|media|images|icons|fonts|videos|favicon|robots\.txt|sitemap|rss|manifest)(\/|$|\.|-)/i;
const wpLeftovers = /^\/(wp-(admin|content|includes|json|login)|xmlrpc\.php|feed|comments|tag|category|author|hello-world|thank-you)(\/|$|\.)/i;
const spamKeywords = /(casino|slots?|roulette|blackjack|bingo|gambl|jackpot|no-deposit|free-spins?|bet365|betting|baccarat|craps|gamstop|bookmaker)/i;

const gone = () =>
  new Response("410 Gone — this page has been permanently removed.", {
    status: 410,
    headers: { "Content-Type": "text/plain" },
  });

export const onRequest = defineMiddleware((context, next) => {
  const { pathname, searchParams } = context.url;

  const wpPostId = searchParams.get("p") ?? searchParams.get("page_id");
  if (wpPostId && /^\d+$/.test(wpPostId)) return gone();
  if (wpLeftovers.test(pathname)) return gone();
  if (pathname !== "/" && !realRoutes.test(pathname) && spamKeywords.test(pathname)) return gone();

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
