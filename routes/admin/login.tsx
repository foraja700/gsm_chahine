import { Handlers, PageProps } from "$fresh/server.ts";
import { Header } from "../../components/Header.tsx";
import { Footer } from "../../components/Footer.tsx";
import { getEnvPhoneNumber } from "../../lib/whatsapp.ts";

interface LoginData {
  error?: string;
  whatsappPhone: string;
}

export const handler: Handlers<LoginData> = {
  GET(_req, ctx) {
    const whatsappPhone = getEnvPhoneNumber();
    return ctx.render({ whatsappPhone });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const password = form.get("password")?.toString();
    const expectedPassword = Deno.env.get("ADMIN_PASSWORD") || "chahine2026";
    const whatsappPhone = getEnvPhoneNumber();

    if (password === expectedPassword) {
      const headers = new Headers();
      headers.set("Location", "/admin");
      // Set secure cookie valid for 7 days
      headers.append(
        "Set-Cookie",
        `admin_session=authenticated; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
      );
      return new Response(null, {
        status: 303,
        headers,
      });
    }

    return ctx.render({ error: "Mot de passe incorrect. Veuillez réessayer.", whatsappPhone });
  },
};

export default function AdminLogin({ data }: PageProps<LoginData>) {
  return (
    <div class="flex flex-col min-h-screen">
      <Header whatsappPhone={data.whatsappPhone} />

      <main class="flex-grow flex items-center justify-center px-4 py-16">
        <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          
          <div class="text-center space-y-2">
            <div class="w-12 h-12 bg-[#003882]/40 text-blue-400 rounded-2xl flex items-center justify-center mx-auto text-2xl border border-blue-500/30">
              🔒
            </div>
            <h1 class="text-2xl font-bold text-white">Connexion Administration</h1>
            <p class="text-xs text-slate-400">
              Accès réservé aux administrateurs GSM CHAHINE
            </p>
          </div>

          {data?.error && (
            <div class="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold text-center">
              ⚠️ {data.error}
            </div>
          )}

          <form method="POST" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Mot de passe Admin
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="Saisissez le mot de passe..."
                class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm"
              />
            
            </div>

            <button
              type="submit"
              class="w-full py-3 rounded-xl bg-[#003882] hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-lg hover:shadow-blue-500/20"
            >
              Se Connecter
            </button>
          </form>

        </div>
      </main>

      <Footer whatsappPhone={data.whatsappPhone} />
    </div>
  );
}
