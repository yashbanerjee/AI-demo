import type { APIRoute } from "astro";
import { buildProductsSitemap, xmlHeaders } from "../lib/sitemaps";

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response("Site URL is not configured.", { status: 500 });
  }
  return new Response(await buildProductsSitemap(site), { headers: xmlHeaders });
};
