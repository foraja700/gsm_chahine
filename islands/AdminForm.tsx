import { useState } from "preact/hooks";
import { Item, ItemInput, CATEGORIES } from "../lib/types.ts";

interface AdminFormProps {
  initialItem?: Item | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function AdminForm({ initialItem, onSuccess, onCancel }: AdminFormProps) {
  const isEditing = !!initialItem;

  const [name, setName] = useState(initialItem?.name || "");
  const [description, setDescription] = useState(initialItem?.description || "");
  const [price, setPrice] = useState(initialItem?.price?.toString() || "");
  const [quantity, setQuantity] = useState(initialItem?.quantity?.toString() || "1");
  const [category, setCategory] = useState(initialItem?.category || CATEGORIES[0]);
  const [notes, setNotes] = useState(initialItem?.notes || "");
  const [imageUrl, setImageUrl] = useState(initialItem?.imageUrl || "");
  
  const [imageOption, setImageOption] = useState<"url" | "upload">("url");
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Veuillez saisir le nom de l'article.");
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      setError("Veuillez saisir un prix valide en DH.");
      return;
    }
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) < 0) {
      setError("Veuillez saisir une quantité valide.");
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = imageUrl;

      // Handle file upload if user chose upload option
      if (imageOption === "upload" && fileToUpload) {
        const formData = new FormData();
        formData.append("file", fileToUpload);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.error || "Échec du téléchargement de l'image");
        }

        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
      }

      // Default fallback placeholder if no image provided
      if (!finalImageUrl.trim()) {
        finalImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80";
      }

      const itemPayload: ItemInput = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        quantity: Number(quantity),
        category,
        notes: notes.trim(),
        imageUrl: finalImageUrl,
      };

      const url = isEditing ? `/api/items?id=${initialItem.id}` : "/api/items";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemPayload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Une erreur s'est produite lors de l'enregistrement.");
      }

      // Success
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Erreur serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-4">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <span>{isEditing ? "✏️ Modifier l'Article" : "➕ Ajouter un Nouvel Article"}</span>
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            class="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800"
          >
            Fermer
          </button>
        )}
      </div>

      {error && (
        <div class="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Name */}
        <div class="sm:col-span-2">
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Nom de l'article *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: iPhone 15 Pro Max 256GB"
            value={name}
            onInput={(e) => setName((e.target as HTMLInputElement).value)}
            class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        {/* Category */}
        <div>
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Catégorie *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory((e.target as HTMLSelectElement).value as any)}
            class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Price in DH */}
        <div>
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Prix (en DH) *
          </label>
          <input
            type="number"
            min="0"
            step="1"
            required
            placeholder="Ex: 12500"
            value={price}
            onInput={(e) => setPrice((e.target as HTMLInputElement).value)}
            class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        {/* Quantity */}
        <div>
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Quantité disponible *
          </label>
          <input
            type="number"
            min="0"
            required
            placeholder="Ex: 5"
            value={quantity}
            onInput={(e) => setQuantity((e.target as HTMLInputElement).value)}
            class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        {/* Image Source Options */}
        <div class="sm:col-span-2 space-y-3">
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Image du produit
          </label>

          <div class="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="imageOption"
                checked={imageOption === "url"}
                onChange={() => setImageOption("url")}
                class="text-blue-600"
              />
              <span>Lien URL d'image</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="imageOption"
                checked={imageOption === "upload"}
                onChange={() => setImageOption("upload")}
                class="text-blue-600"
              />
              <span>Télécharger une image locale</span>
            </label>
          </div>

          {imageOption === "url" ? (
            <input
              type="url"
              placeholder="https://domaine.com/image.jpg"
              value={imageUrl}
              onInput={(e) => setImageUrl((e.target as HTMLInputElement).value)}
              class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm"
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files && files.length > 0) {
                  setFileToUpload(files[0]);
                }
              }}
              class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          )}
        </div>

        {/* Description */}
        <div class="sm:col-span-2">
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Description complète
          </label>
          <textarea
            rows={3}
            placeholder="Détails techniques, état, accessoires fournis..."
            value={description}
            onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
            class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        {/* Notes (WhatsApp & Internal) */}
        <div class="sm:col-span-2">
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Notes supplémentaires (Visibles dans le message WhatsApp)
          </label>
          <input
            type="text"
            placeholder="Ex: Garantie de 1 an inclus, livraison express..."
            value={notes}
            onInput={(e) => setNotes((e.target as HTMLInputElement).value)}
            class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

      </div>

      {/* Action Buttons */}
      <div class="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          class="px-6 py-2.5 rounded-xl bg-[#003882] hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Ajouter au catalogue"}
        </button>
      </div>

    </form>
  );
}
