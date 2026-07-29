import { Handlers } from "$fresh/server.ts";
import { getAllItems, getItemById, createItem, updateItem, deleteItem } from "../../lib/kv.ts";
import { ItemInput } from "../../lib/types.ts";

export const handler: Handlers = {
  // GET items
  async GET(req) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const item = await getItemById(id);
      if (!item) {
        return new Response(JSON.stringify({ error: "Item not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(item), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const items = await getAllItems();
    return new Response(JSON.stringify(items), {
      headers: { "Content-Type": "application/json" },
    });
  },

  // POST create item
  async POST(req) {
    try {
      const body = await req.json() as ItemInput;
      if (!body.name || body.price === undefined || body.quantity === undefined) {
        return new Response(
          JSON.stringify({ error: "Champs obligatoires manquants (name, price, quantity)" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const created = await createItem(body);
      return new Response(JSON.stringify(created), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err.message || "Erreur création article" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },

  // PUT update item
  async PUT(req) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID article manquant" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const body = await req.json() as Partial<ItemInput>;
      const updated = await updateItem(id, body);

      if (!updated) {
        return new Response(
          JSON.stringify({ error: "Article non trouvé" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(updated), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err.message || "Erreur mise à jour" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },

  // DELETE item
  async DELETE(req) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID article manquant" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const success = await deleteItem(id);
    if (!success) {
      return new Response(
        JSON.stringify({ error: "Article non trouvé" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
