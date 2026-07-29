import { Item } from "../lib/types.ts";
import { WhatsAppButton } from "./WhatsAppButton.tsx";

interface ItemCardProps {
  item: Item;
  whatsappPhone?: string;
}

export function ItemCard({ item, whatsappPhone }: ItemCardProps) {
  const isOutOfStock = item.quantity <= 0;
  const formattedPrice = item.price.toLocaleString("fr-FR");

  return (
    <div class="group relative bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col h-full">
      
      {/* Image Container with aspect ratio */}
      <div class="relative w-full aspect-square bg-slate-950 overflow-hidden">
        <img
          src={item.imageUrl || "/static/logo.jpg"}
          alt={item.name}
          loading="lazy"
          class={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isOutOfStock ? "grayscale opacity-60" : ""
          }`}
          onError={(e) => {
            // Fallback image if broken link
            (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80";
          }}
        />

        {/* Category Badge */}
        <div class="absolute top-3 left-3 z-10">
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-[#002357]/90 text-blue-200 border border-blue-400/30 backdrop-blur-md shadow-md">
            {item.category}
          </span>
        </div>

        {/* Out of Stock Overlay / Stock Status */}
        {isOutOfStock ? (
          <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20">
            <span class="bg-red-500/90 text-white font-extrabold text-sm px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg border border-red-400/40">
              Rupture de Stock
            </span>
            <p class="text-xs text-slate-300 mt-2 font-medium">Disponible sur commande</p>
          </div>
        ) : (
          <div class="absolute top-3 right-3 z-10">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
              stock: {item.quantity}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div class="p-5 flex flex-col flex-grow justify-between bg-gradient-to-b from-slate-900 to-slate-950">
        <div>
          <h3 class="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
            {item.name}
          </h3>

          <p class="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {item.notes && (
            <div class="mt-3 p-2.5 rounded-lg bg-blue-950/40 border border-blue-900/60 text-[11px] text-blue-300 flex items-start gap-1.5">
              <span class="shrink-0 text-blue-400 font-bold">ℹ️</span>
              <span class="line-clamp-2">{item.notes}</span>
            </div>
          )}
        </div>

        {/* Price & WhatsApp CTA */}
        <div class="mt-5 pt-4 border-t border-slate-800/80 flex flex-col gap-3">
          <div class="flex items-baseline justify-between">
            <span class="text-xs text-slate-400 uppercase font-semibold">Prix Cash</span>
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                {formattedPrice}
              </span>
              <span class="text-sm font-bold text-blue-400">DH</span>
            </div>
          </div>

          <WhatsAppButton item={item} phone={whatsappPhone} />
        </div>

      </div>

    </div>
  );
}
