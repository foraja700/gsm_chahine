import { normalizeWhatsAppPhone } from "../lib/whatsapp.ts";

interface HeaderProps {
  whatsappPhone?: string;
}

export function Header({ whatsappPhone }: HeaderProps) {
  const phone = normalizeWhatsAppPhone(whatsappPhone);
  const waUrl = `https://wa.me/${phone}`;

  return (
    <header class="sticky top-0 z-50 bg-[#002357]/95 backdrop-blur-md border-b border-white/10 text-white shadow-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <a href="/" class="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.02]">
            <div class="bg-white p-1.5 rounded-xl shadow-md border border-blue-100 flex items-center justify-center">
              <img 
                src="/logo.jpg" 
                alt="GSM CHAHINE Logo" 
                class="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  // Fallback icon if logo image fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                }}
              />
            </div>
          </a>

          {/* Right Navigation */}
          <div class="flex items-center gap-3 sm:gap-4">
            {/* Quick Contact Badge */}
            <a 
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="hidden md:flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2 rounded-full font-semibold text-xs transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.754zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
              </svg>
              <span>WhatsApp Direct</span>
            </a>

            {/* Admin Portal Button */}
            <a 
              href="/admin" 
              class="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-white/15 transition-all duration-200 backdrop-blur-sm"
              title="Accès Panneau d'Administration"
            >
              <svg class="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <span>Espace Admin</span>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
