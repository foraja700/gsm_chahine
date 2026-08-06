import { Item, ItemInput } from "./types.ts";

const KV_KEY_ITEMS = "items";

export async function getKv() {
  if (typeof Deno.openKv !== "function") {
    throw new Error(
      "Deno KV is disabled. Please run Deno with the `--unstable-kv` flag or set your hosting start command to 'deno task start'."
    );
  }
  return await Deno.openKv();
}


export async function getAllItems(): Promise<Item[]> {
  const kv = await getKv();

  // Check if database has been seeded before
  const seededFlag = await kv.get<boolean>(["has_seeded"]);
  if (!seededFlag.value) {
    const seeded = await seedInitialItems();
    await kv.set(["has_seeded"], true);
    return seeded;
  }

  const iter = kv.list<Item>({ prefix: [KV_KEY_ITEMS] });
  const items: Item[] = [];
  
  for await (const res of iter) {
    if (res.value) {
      items.push(res.value);
    }
  }
  
  // Sort by updatedAt descending
  items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  
  return items;
}

export async function getItemById(id: string): Promise<Item | null> {
  const kv = await getKv();
  const res = await kv.get<Item>([KV_KEY_ITEMS, id]);
  return res.value;
}

export async function createItem(input: ItemInput): Promise<Item> {
  const kv = await getKv();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  const newItem: Item = {
    id,
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  await kv.set([KV_KEY_ITEMS, id], newItem);
  return newItem;
}

async function removeLocalImageFile(imageUrl?: string) {
  if (!imageUrl || !imageUrl.startsWith("/uploads/")) return;
  const filename = imageUrl.replace("/uploads/", "");
  const filePath = `./static/uploads/${filename}`;
  try {
    await Deno.remove(filePath);
    console.log(`Successfully removed local upload file: ${filePath}`);
  } catch (err) {
    console.warn(`Could not remove local image file ${filePath}:`, err);
  }
}

export async function updateItem(id: string, input: Partial<ItemInput>): Promise<Item | null> {
  const kv = await getKv();
  const existing = await getItemById(id);
  
  if (!existing) {
    return null;
  }

  // If image URL changed and old one was a local upload, clean up old file
  if (input.imageUrl && input.imageUrl !== existing.imageUrl) {
    await removeLocalImageFile(existing.imageUrl);
  }

  const updated: Item = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };

  await kv.set([KV_KEY_ITEMS, id], updated);
  return updated;
}

export async function deleteItem(id: string): Promise<boolean> {
  const kv = await getKv();
  const existing = await getItemById(id);
  if (!existing) return false;
  
  // Clean up uploaded image file if present
  await removeLocalImageFile(existing.imageUrl);

  await kv.delete([KV_KEY_ITEMS, id]);
  return true;
}

export async function seedInitialItems(): Promise<Item[]> {
  const sampleItems: ItemInput[] = [
    {
      name: "iPhone 15 Pro Max 256GB - Blue Titanium",
      description: "Neuf sous emballage avec garantie officielle. Puce A17 Pro, écran Super Retina XDR 120Hz, appareil photo 48 MP.",
      price: 13900,
      quantity: 4,
      imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
      category: "Smartphones",
      notes: "Livraison gratuite à domicile. Facture et garantie de 1 an incluses.",
    },
    {
      name: "Samsung Galaxy S24 Ultra 512GB - Titanium Black",
      description: "Design premium en titane, S Pen intégré, Galaxy AI, Zoom 100x et processeur Snapdragon 8 Gen 3.",
      price: 12500,
      quantity: 3,
      imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
      category: "Smartphones",
      notes: "Possibilité d'échange avec ancien téléphone.",
    },
    {
      name: "Apple AirPods Pro (2ème Génération) USB-C",
      description: "Réduction active du bruit 2x plus efficace, Audio Spatial personnalisé, boîtier MagSafe USB-C.",
      price: 2450,
      quantity: 12,
      imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
      category: "Audio",
      notes: "Produit 100% Original Apple avec code de série vérifiable.",
    },
    {
      name: "Chargeur Rapide Anker 67W USB-C GaN",
      description: "Chargeur ultra-compact à 3 ports pour iPhone, Samsung, MacBook et tablettes.",
      price: 390,
      quantity: 0, // Out of stock example
      imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
      category: "Accessories",
      notes: "Rupture de stock momentanée - Réapprovisionnement prévu sous 3 jours.",
    },
    {
      name: "iPad Air M2 11 pouces - 128GB Wi-Fi (Gris Sidéral)",
      description: "Puce M2 surpuissante, compatible avec Apple Pencil Pro et Magic Keyboard.",
      price: 7490,
      quantity: 2,
      imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
      category: "Tablets & Laptops",
      notes: "Disponible en magasin GSM Chahine.",
    },
    {
      name: "Verre Trempé Incassable 9H Spigen pour iPhone",
      description: "Protection d'écran haute définition avec kit de pose facile sans bulles.",
      price: 120,
      quantity: 25,
      imageUrl: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80",
      category: "Accessories",
      notes: "Pose gratuite en magasin GSM Chahine.",
    },
  ];

  const kv = await getKv();
  const createdItems: Item[] = [];

  for (const input of sampleItems) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const item: Item = {
      id,
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    await kv.set([KV_KEY_ITEMS, id], item);
    createdItems.push(item);
  }

  return createdItems;
}
