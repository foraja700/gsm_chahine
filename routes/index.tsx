import { Handlers, PageProps } from "$fresh/server.ts";
import { Item } from "../lib/types.ts";
import { getAllItems } from "../lib/kv.ts";
import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import CatalogExplorer from "../islands/CatalogExplorer.tsx";

import { getEnvPhoneNumber, getEnvStoreLocation } from "../lib/whatsapp.ts";

interface HomePageData {
  items: Item[];
  whatsappPhone: string;
  storeLocation: string;
}

export const handler: Handlers<HomePageData> = {
  async GET(_req, ctx) {
    const storeLocation = getEnvStoreLocation();
    try {
      const items = await getAllItems();
      const whatsappPhone = getEnvPhoneNumber();
      return ctx.render({ items, whatsappPhone, storeLocation });
    } catch (err) {
      console.error("Error loading home catalog:", err);
      return ctx.render({ items: [], whatsappPhone: getEnvPhoneNumber(), storeLocation });
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

      <Footer whatsappPhone={data.whatsappPhone} storeLocationQuery={data.storeLocation} />
    </div>
  );
}

