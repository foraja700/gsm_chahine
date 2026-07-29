import { Item } from "./types.ts";

/**
 * Formats a WhatsApp link for a given product according to exact requirements:
 * "Bonjour! Je suis intéressé(e) par: [ITEM NAME] - Prix: [PRICE] DH - Quantité: [QUANTITY]. [OPTIONAL NOTES]"
 */
export function buildWhatsAppMessage(item: Item): string {
  const priceFormatted = item.price.toLocaleString("fr-FR");
  let message = `Bonjour! Je suis intéressé(e) par: ${item.name} - Prix: ${priceFormatted} DH - Quantité: ${item.quantity}.`;
  
  if (item.notes && item.notes.trim().length > 0) {
    message += ` ${item.notes.trim()}`;
  }

  return message;
}

export function getEnvPhoneNumber(): string {
  let envPhone = Deno.env.get("WHATSAPP_PHONE_NUMBER");
  if (!envPhone) {
    try {
      const text = Deno.readTextFileSync("./.env");
      const match = text.match(/WHATSAPP_PHONE_NUMBER\s*=\s*(.+)/);
      if (match && match[1]) {
        envPhone = match[1].trim();
      }
    } catch {
      // Ignore read error
    }
  }
  return envPhone || "0690091037";
}

export function normalizeWhatsAppPhone(phone?: string): string {
  const envPhone = phone || getEnvPhoneNumber();
  let cleaned = envPhone.replace(/[^0-9]/g, "");

  // If local Moroccan format starting with '0' (e.g. 0690091037), convert to international '212690091037'
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "212" + cleaned.substring(1);
  }

  return cleaned;
}

export function formatPhoneDisplay(phone?: string): string {
  const envPhone = phone || getEnvPhoneNumber();
  const cleaned = envPhone.replace(/[^0-9]/g, "");
  
  if (cleaned.length === 10 && cleaned.startsWith("0")) {
    return `${cleaned.substring(0, 2)} ${cleaned.substring(2, 4)} ${cleaned.substring(4, 6)} ${cleaned.substring(6, 8)} ${cleaned.substring(8, 10)}`;
  }
  
  if (cleaned.length === 12 && cleaned.startsWith("212")) {
    return `+212 ${cleaned.substring(3, 4)} ${cleaned.substring(4, 6)} ${cleaned.substring(6, 8)} ${cleaned.substring(8, 10)} ${cleaned.substring(10, 12)}`;
  }

  return envPhone;
}

export function buildWhatsAppUrl(item: Item, phoneOverride?: string): string {
  const phone = normalizeWhatsAppPhone(phoneOverride);
  const text = buildWhatsAppMessage(item);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
