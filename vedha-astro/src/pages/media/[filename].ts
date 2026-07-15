import type { APIRoute } from "astro";
import { getMedia } from "../../lib/db";

export const GET: APIRoute = async ({ params }) => {
  const media = await getMedia(params.filename!);
  if (!media) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(media.data), {
    headers: {
      "Content-Type": media.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
