import { Handlers, PageProps } from "$fresh/server.ts";
import { Item } from "../lib/types.ts";
import { getAllItems } from "../lib/kv.ts";
import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import CatalogExplorer from "../islands/CatalogExplorer.tsx";

import { getEnvPhoneNumber } from "../lib/whatsapp.ts";

interface HomePageData {
  items: Item[];
  whatsappPhone: string;
}

export const handler: Handlers<HomePageData> = {
  async GET(_req, ctx) {
    try {
      const items = await getAllItems();
      const whatsappPhone = getEnvPhoneNumber();
      return ctx.render({ items, whatsappPhone });
    } catch (err) {
      console.error("Error loading home catalog:", err);
      return ctx.render({ items: [], whatsappPhone: getEnvPhoneNumber() });
    }
  },
};

export default function Home({ data }: PageProps<HomePageData>) {
  return (
    <div class="flex flex-col min-h-screen">
      <Header whatsappPhone={data.whatsappPhone} />

      <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CatalogExplorer 
          initialItems={data.items} 
          whatsappPhone={data.whatsappPhone} 
        />
      </main>

      <Footer whatsappPhone={data.whatsappPhone} />
    </div>
  );
}
