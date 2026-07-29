export interface Item {
  id: string;
  name: string;
  description: string;
  price: number; // in DH
  quantity: number;
  imageUrl: string;
  category: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ItemInput = Omit<Item, "id" | "createdAt" | "updatedAt">;

export type Category = 
  | "Smartphones"
  | "Accessories"
  | "Audio"
  | "Tablets & Laptops"
  | "Smartwatches"
  | "Repairs & Services"
  | "Other";

export const CATEGORIES: Category[] = [
  "Smartphones",
  "Accessories",
  "Audio",
  "Tablets & Laptops",
  "Smartwatches",
  "Repairs & Services",
  "Other",
];
