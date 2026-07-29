import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const filename = ctx.params.name;
    const filePath = `./static/uploads/${filename}`;
    try {
      const file = await Deno.open(filePath, { read: true });
      const stat = await file.stat();

      let contentType = "image/jpeg";
      const lower = filename.toLowerCase();
      if (lower.endsWith(".png")) contentType = "image/png";
      else if (lower.endsWith(".webp")) contentType = "image/webp";
      else if (lower.endsWith(".gif")) contentType = "image/gif";
      else if (lower.endsWith(".svg")) contentType = "image/svg+xml";

      return new Response(file.readable, {
        headers: {
          "Content-Type": contentType,
          "Content-Length": stat.size.toString(),
          "Cache-Control": "public, max-age=31536000",
        },
      });
    } catch {
      return new Response("File not found", { status: 404 });
    }
  },
};
