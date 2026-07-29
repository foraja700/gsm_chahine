import { useState } from "preact/hooks";
import { Item } from "../lib/types.ts";
import AdminForm from "./AdminForm.tsx";

interface AdminItemsListProps {
  initialItems: Item[];
}

export default function AdminItemsList({ initialItems }: AdminItemsListProps) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<Item | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to refresh items:", err);
    }
  };

  const executeDelete = async (itemToDelete: Item) => {
    setDeletingId(itemToDelete.id);
    try {
      const res = await fetch(`/api/items?id=${itemToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== itemToDelete.id));
        if (editingItem?.id === itemToDelete.id) {
          setEditingItem(null);
        }
        setConfirmDeleteTarget(null);
      } else {
        // Fallback: submit standard HTML form
        const formEl = document.getElementById(`delete-form-${itemToDelete.id}`) as HTMLFormElement;
        if (formEl) {
          formEl.submit();
        } else {
          alert("Erreur lors de la suppression.");
        }
      }
    } catch (err) {
      console.error("Fetch delete error, falling back to form submit:", err);
      const formEl = document.getElementById(`delete-form-${itemToDelete.id}`) as HTMLFormElement;
      if (formEl) {
        formEl.submit();
      }
    } finally {
      setDeletingId(null);
    }
  };

  const filteredItems = items.filter((item) =>
    `${item.name} ${item.category} ${item.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div class="space-y-6">
      
      {/* Top Header Actions */}
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 class="text-2xl font-bold text-white">Gestion des Produits</h1>
          <p class="text-xs text-slate-400 mt-1">
            Gérez votre stock, ajoutez ou modifiez des produits GSM Chahine.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setShowAddForm(!showAddForm);
          }}
          class="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#003882] hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          <span>{showAddForm ? "✖️ Fermer le Formulaire" : "➕ Ajouter un Produit"}</span>
        </button>
      </div>

      {/* Form Drawer (Add or Edit) */}
      {(showAddForm || editingItem) && (
        <div class="animate-fadeIn">
          <AdminForm
            initialItem={editingItem}
            onSuccess={() => {
              setShowAddForm(false);
              setEditingItem(null);
              fetchItems();
            }}
            onCancel={() => {
              setShowAddForm(false);
              setEditingItem(null);
            }}
          />
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {confirmDeleteTarget && (
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div class="bg-slate-900 border border-red-800/80 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-red-950 text-red-400 flex items-center justify-center text-xl font-bold border border-red-800">
                🗑️
              </div>
              <div>
                <h3 class="text-base font-bold text-white">Confirmer la suppression</h3>
                <p class="text-xs text-slate-400">Cette action est irréversible.</p>
              </div>
            </div>

            <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
              <img
                src={confirmDeleteTarget.imageUrl || "/logo.jpg"}
                alt={confirmDeleteTarget.name}
                class="w-12 h-12 object-cover rounded-lg bg-slate-900 shrink-0"
              />
              <div>
                <p class="text-xs font-bold text-white">{confirmDeleteTarget.name}</p>
                <p class="text-[11px] text-cyan-400 font-semibold">{confirmDeleteTarget.price} DH</p>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteTarget(null)}
                class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => executeDelete(confirmDeleteTarget)}
                disabled={deletingId === confirmDeleteTarget.id}
                class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-lg hover:shadow-red-500/20 disabled:opacity-50"
              >
                {deletingId === confirmDeleteTarget.id ? "Suppression en cours..." : "Oui, Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div class="flex items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div class="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Filtrer la liste d'articles..."
            value={search}
            onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-700 focus:outline-none focus:border-blue-500"
          />
          <span class="absolute left-3.5 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>
        
        <span class="text-xs text-slate-400 font-semibold whitespace-nowrap">
          Total: <strong class="text-white">{filteredItems.length}</strong> article(s)
        </span>
      </div>

      {/* Table of Items */}
      <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th class="p-4">Produit</th>
                <th class="p-4">Catégorie</th>
                <th class="p-4">Prix (DH)</th>
                <th class="p-4">Stock</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} class="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Item Thumbnail & Name */}
                    <td class="p-4">
                      <div class="flex items-center gap-3">
                        <img
                          src={item.imageUrl || "/logo.jpg"}
                          alt={item.name}
                          class="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-700 shrink-0"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/logo.jpg";
                          }}
                        />
                        <div>
                          <p class="font-bold text-white text-sm line-clamp-1">{item.name}</p>
                          <p class="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td class="p-4">
                      <span class="px-2.5 py-1 rounded-md bg-blue-950 text-blue-300 border border-blue-800/50 font-semibold text-[11px]">
                        {item.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td class="p-4 font-extrabold text-cyan-300 text-sm">
                      {item.price.toLocaleString("fr-FR")} DH
                    </td>

                    {/* Quantity */}
                    <td class="p-4">
                      {item.quantity > 0 ? (
                        <span class="px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/50 font-bold">
                          {item.quantity} stock
                        </span>
                      ) : (
                        <span class="px-2.5 py-1 rounded-md bg-red-950 text-red-300 border border-red-800/50 font-bold">
                          Épuisé (0)
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td class="p-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        {/* Hidden HTML Form for fallback server-side deletion */}
                        <form
                          id={`delete-form-${item.id}`}
                          method="POST"
                          action="/admin"
                          class="hidden"
                        >
                          <input type="hidden" name="action" value="delete" />
                          <input type="hidden" name="id" value={item.id} />
                        </form>

                        <button
                          type="button"
                          onClick={() => {
                            setShowAddForm(false);
                            setEditingItem(item);
                          }}
                          class="px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700/50 font-bold text-xs transition-colors"
                        >
                          Éditer
                        </button>

                        <button
                          type="button"
                          onClick={() => setConfirmDeleteTarget(item)}
                          class="px-3 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800/50 font-bold text-xs transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} class="p-8 text-center text-slate-500">
                    Aucun produit enregistré. Cliquez sur "Ajouter un Produit" pour démarrer votre catalogue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
