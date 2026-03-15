"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Database } from "@/types/database";

type Product = Database["public"]["Tables"]["products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductInsert) => Promise<void>;
  product?: Product | null;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
}: ProductModalProps) {
  const [formData, setFormData] = useState<ProductInsert>({
    name: "",
    price: 0,
    stock: 0,
    category: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category || "",
      });
    } else {
      setFormData({
        name: "",
        price: 0,
        stock: 0,
        category: "",
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
          <h2 className="text-lg font-bold text-text-primary">
            {product ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white rounded-md transition-colors text-text-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1.5">
              Nombre del Producto
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="input-field"
              placeholder="Ej. Cuaderno de espiral"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1.5">
                Precio (Q)
              </label>
              <input
                type="number"
                step="0.01"
                required
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                className="input-field"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1.5">
                Stock Inicial
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: parseInt(e.target.value) })
                }
                className="input-field"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1.5">
              Categoría (Opcional)
            </label>
            <input
              type="text"
              value={formData.category || ""}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="input-field"
              placeholder="Ej. Papelería, Escritura"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? "Guardando..." : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
