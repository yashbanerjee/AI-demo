import type { APIRoute } from "astro";
import { buildPagesSitemap, xmlHeaders } from "../lib/sitemaps";

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response("Site URL is not configured.", { status: 500 });
  }
  return new Response(buildPagesSitemap(site), { headers: xmlHeaders });
};
