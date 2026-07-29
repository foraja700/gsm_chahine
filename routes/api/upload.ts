import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const formData = await req.formData();
      const file = formData.get("file");

      if (!file || !(file instanceof File)) {
        return new Response(
          JSON.stringify({ error: "Fichier image manquant ou invalide" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Validate image mime type
      if (!file.type.startsWith("image/")) {
        return new Response(
          JSON.stringify({ error: "Le fichier doit être une image (JPEG, PNG, WEBP, etc.)" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Max size: 10MB
      if (file.size > 10 * 1024 * 1024) {
        return new Response(
          JSON.stringify({ error: "L'image ne doit pas dépasser 10 Mo" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Prepare target path in static/uploads
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `upload-${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`;
      const uploadDir = "./static/uploads";

      try {
        await Deno.mkdir(uploadDir, { recursive: true });
      } catch {
        // Directory exists
      }

      const bytes = new Uint8Array(await file.arrayBuffer());
      const targetPath = `${uploadDir}/${filename}`;
      await Deno.writeFile(targetPath, bytes);

      const publicUrl = `/uploads/${filename}`;

      return new Response(
        JSON.stringify({ success: true, url: publicUrl }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    } catch (err: any) {
      console.error("Upload error:", err);
      return new Response(
        JSON.stringify({ error: err.message || "Erreur enregistrement fichier" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};
