import { Handlers, PageProps } from "$fresh/server.ts";
import { Item } from "../../lib/types.ts";
import { getAllItems, deleteItem } from "../../lib/kv.ts";
import { Header } from "../../components/Header.tsx";
import { Footer } from "../../components/Footer.tsx";
import AdminItemsList from "../../islands/AdminItemsList.tsx";
import { getEnvPhoneNumber } from "../../lib/whatsapp.ts";

interface AdminPageData {
  items: Item[];
  whatsappPhone: string;
}

export const handler: Handlers<AdminPageData> = {
  async GET(req, ctx) {
    const url = new URL(req.url);

    // Logout handling
    if (url.searchParams.get("logout") === "true") {
      const headers = new Headers();
      headers.set("Location", "/admin/login");
      headers.append(
        "Set-Cookie",
        "admin_session=; Path=/; HttpOnly; Max-Age=0"
      );
      return new Response(null, { status: 303, headers });
    }

    // Check cookie authentication
    const cookies = req.headers.get("cookie") || "";
    const isAuthenticated = cookies.includes("admin_session=authenticated");

    if (!isAuthenticated) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/admin/login" },
      });
    }

    const items = await getAllItems();
    const whatsappPhone = getEnvPhoneNumber();
    return ctx.render({ items, whatsappPhone });
  },

  async POST(req) {
    const cookies = req.headers.get("cookie") || "";
    const isAuthenticated = cookies.includes("admin_session=authenticated");

    if (!isAuthenticated) {
      return new Response(null, { status: 303, headers: { Location: "/admin/login" } });
    }

    try {
      const form = await req.formData();
      const action = form.get("action")?.toString();
      const id = form.get("id")?.toString();

      if (action === "delete" && id) {
        await deleteItem(id);
      }
    } catch (err) {
      console.error("Form POST action error:", err);
    }

    return new Response(null, {
      status: 303,
      headers: { Location: "/admin" },
    });
  },
};

export default function AdminIndex({ data }: PageProps<AdminPageData>) {
  return (
    <div class="flex flex-col min-h-screen">
      
      {/* Top Admin Status Banner */}
      <div class="bg-[#003882] text-white text-xs py-2 px-4 border-b border-blue-600/40">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <span class="flex items-center gap-2 font-medium">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            Espace d'administration GSM CHAHINE connecté
          </span>
          <a
            href="/admin?logout=true"
            class="text-blue-200 hover:text-white font-bold underline transition-colors"
          >
            Se déconnecter 🚪
          </a>
        </div>
      </div>

      <Header whatsappPhone={data.whatsappPhone} />

      <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminItemsList initialItems={data.items} />
      </main>

      <Footer whatsappPhone={data.whatsappPhone} />
    </div>
  );
}
