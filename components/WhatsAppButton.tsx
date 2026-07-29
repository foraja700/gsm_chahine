import { Item } from "../lib/types.ts";
import { buildWhatsAppUrl } from "../lib/whatsapp.ts";

interface WhatsAppButtonProps {
  item: Item;
  phone?: string;
  className?: string;
}

export function WhatsAppButton({ item, phone, className }: WhatsAppButtonProps) {
  const isOutOfStock = item.quantity <= 0;
  const whatsappUrl = buildWhatsAppUrl(item, phone);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      class={`w-full inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-md ${
        isOutOfStock
          ? "bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer"
          : "bg-[#25D366] hover:bg-[#1ebd5a] text-white hover:shadow-emerald-500/30 active:scale-[0.98]"
      } ${className || ""}`}
    >
      <svg class="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.754zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
      </svg>
      <span>Contact via WhatsApp</span>
    </a>
  );
}
