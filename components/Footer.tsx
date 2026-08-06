import { formatPhoneDisplay, normalizeWhatsAppPhone } from "../lib/whatsapp.ts";

interface FooterProps {
  whatsappPhone?: string;
  storeLocationQuery?: string;
}

export function Footer({ whatsappPhone, storeLocationQuery = "GSM Chahine, Maroc" }: FooterProps) {
  const displayPhone = formatPhoneDisplay(whatsappPhone);
  const waUrl = `https://wa.me/${normalizeWhatsAppPhone(whatsappPhone)}`;
  const encodedQuery = encodeURIComponent(storeLocationQuery);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const googleMapsDirectUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

  return (
    <footer class="bg-[#001D48] text-slate-300 border-t border-blue-900/50 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="bg-white p-1 rounded-lg">
                <img src="/logo.jpg" alt="GSM Chahine Logo" class="h-8 w-auto object-contain" />
              </div>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed">
              Vente, achat et réparation de tous types de smartphones, tablettes et accessoires informatiques au Maroc. Produits garantis au meilleur prix.
            </p>
          </div>

          {/* Contact Details */}
          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider">Contact & Horaires</h3>
            <ul class="space-y-2 text-xs text-slate-400">
              <li class="flex items-center gap-2">
                <span class="text-emerald-400">📍</span> Magasin GSM Chahine, Maroc
              </li>
              <li class="flex items-center gap-2">
                <span class="text-blue-400">⏰</span> Lundi - Samedi: 09:30 - 21:00
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-400">📲</span> WhatsApp: <a href={waUrl} target="_blank" rel="noopener noreferrer" class="text-emerald-400 font-bold hover:underline">{displayPhone}</a>
              </li>
            </ul>
          </div>

          {/* Fast Order Info */}
          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider">Commande Rapide</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Sélectionnez un article dans notre catalogue et cliquez sur <strong class="text-emerald-400">"Contact via WhatsApp"</strong> pour envoyer une demande directe pré-remplie.
            </p>
            <div class="pt-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-900/60 text-blue-300 border border-blue-700/50">
                ⚡ Service Client Ultra Rapide
              </span>
            </div>
          </div>

          {/* Localisation / Google Map */}
          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider flex items-center justify-between">
              <span>📍 Notre Magasin</span>
              <a 
                href={googleMapsDirectUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-[10px] text-blue-400 hover:text-blue-300 underline font-normal capitalize"
              >
                Ouvrir dans Maps ↗
              </a>
            </h3>
            <div class="relative w-full h-44 rounded-xl overflow-hidden border border-blue-800/60 shadow-lg bg-slate-900 group">
              <iframe
                title="Localisation Magasin GSM Chahine"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={mapEmbedUrl}
                class="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
              ></iframe>
            </div>
          </div>

        </div>

        <div class="mt-12 pt-6 border-t border-blue-900/50 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} GSM CHAHINE. Tous droits réservés.</p>
          <div class="flex gap-4 text-xs">
            <a href="/" class="hover:text-white transition-colors">Accueil</a>
            <a href="/admin" class="hover:text-white transition-colors">Administration</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

