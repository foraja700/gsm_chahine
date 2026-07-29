import { useState, useMemo } from "preact/hooks";
import { Item, CATEGORIES } from "../lib/types.ts";
import { ItemCard } from "../components/ItemCard.tsx";

interface CatalogExplorerProps {
  initialItems: Item[];
  whatsappPhone?: string;
}

export default function CatalogExplorer({ initialItems, whatsappPhone }: CatalogExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);

  // Smart / Fuzzy matching search algorithm
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      // Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }

      // Stock filter
      if (showOnlyInStock && item.quantity <= 0) {
        return false;
      }

      // Search query fuzzy matching
      if (!searchQuery.trim()) return true;

      const queryTerms = searchQuery.toLowerCase().trim().split(/\s+/);
      const targetText = `${item.name} ${item.description} ${item.category} ${item.notes || ""}`.toLowerCase();

      // Every word in search query should match somewhere in target text
      return queryTerms.every((term) => targetText.includes(term));
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [initialItems, searchQuery, selectedCategory, sortBy, showOnlyInStock]);

  const activeCategoryCount = (cat: string) => {
    if (cat === "All") return initialItems.length;
    return initialItems.filter(i => i.category === cat).length;
  };

  return (
    <div class="space-y-8">
      
      {/* Hero / Search Section */}
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002357] via-[#003882] to-slate-900 border border-blue-800/60 p-6 sm:p-10 shadow-2xl">
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-3xl mx-auto text-center space-y-4">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/80 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Stock En Temps Réel • GSM CHAHINE
          </div>

          <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Trouvez votre smartphone au <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-white">Meilleur Prix</span>
          </h1>
          <p class="text-sm sm:text-base text-blue-100/90 font-normal max-w-xl mx-auto">
            Recherchez parmi nos derniers arrivages et commandez directement par WhatsApp en un clic.
          </p>

          {/* Interactive Search Bar */}
          <div class="pt-4 max-w-2xl mx-auto">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <input
                type="text"
                value={searchQuery}
                onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
                placeholder="Rechercher par nom (ex: iPhone, Samsung S24, AirPods, chargeur...)"
                class="w-full pl-12 pr-10 py-4 rounded-2xl bg-slate-950/80 text-white placeholder-slate-400 border border-blue-500/40 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 text-sm sm:text-base transition-all shadow-inner"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        
        {/* Category Pills */}
        <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedCategory("All")}
            class={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === "All"
                ? "bg-[#003882] text-white shadow-lg border border-blue-400/40"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            Tous ({activeCategoryCount("All")})
          </button>

          {CATEGORIES.map((cat) => {
            const count = activeCategoryCount(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                class={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-[#003882] text-white shadow-lg border border-blue-400/40"
                    : "bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Sort & Stock Toggles */}
        <div class="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
          
          <label class="flex items-center gap-2 text-xs text-slate-300 font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOnlyInStock}
              onChange={(e) => setShowOnlyInStock((e.target as HTMLInputElement).checked)}
              class="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-blue-500"
            />
            <span>stock uniquement</span>
          </label>

          <select
            value={sortBy}
            onChange={(e) => setSortBy((e.target as HTMLSelectElement).value as any)}
            class="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="newest">Plus récents</option>
            <option value="price-asc">Prix: Croissant</option>
            <option value="price-desc">Prix: Décroissant</option>
          </select>

        </div>

      </div>

      {/* Results Header */}
      <div class="flex items-center justify-between px-1">
        <p class="text-xs text-slate-400 font-medium">
          Affichage de <span class="text-white font-bold">{filteredItems.length}</span> produit(s)
          {searchQuery && <span> pour la recherche "<span class="text-cyan-400">{searchQuery}</span>"</span>}
        </p>

        {(searchQuery || selectedCategory !== "All" || showOnlyInStock) && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setShowOnlyInStock(false);
            }}
            class="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Item Grid */}
      {filteredItems.length > 0 ? (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} whatsappPhone={whatsappPhone} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div class="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div class="w-16 h-16 bg-blue-900/30 text-blue-400 rounded-full flex items-center justify-center mx-auto text-3xl">
            🔍
          </div>
          <h3 class="text-lg font-bold text-white">Aucun produit trouvé</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Nous n'avons pas trouvé de produit correspondant à vos critères de recherche. Essayez de modifier votre mot-clé ou vos filtres.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setShowOnlyInStock(false);
            }}
            class="px-5 py-2.5 rounded-xl bg-[#003882] hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-lg"
          >
            Voir tout le catalogue
          </button>
        </div>
      )}

    </div>
  );
}
