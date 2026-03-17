"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { Plus, Search, Loader2 } from "lucide-react";

import useSWR, { useSWRConfig } from "swr";

type Product = Database["public"]["Tables"]["products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

export default function ProductsPage() {
  const { mutate } = useSWRConfig();
  const { data: products, error, isValidating } = useSWR("products", async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return data || [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loading = !products && !error;

  const handleSaveProduct = async (productData: ProductInsert) => {
    console.log("Iniciando guardado de producto:", productData);
    try {
      if (editingProduct) {
        console.log("Actualizando producto existente, ID:", editingProduct.id);
        const { error } = await (supabase.from("products") as any)
          .update(productData)
          .eq("id", editingProduct.id);
        
        if (error) throw error;
      } else {
        console.log("Insertando nuevo producto...");
        const { error } = await (supabase.from("products") as any)
          .insert([productData]);
        
        if (error) throw error;
      }
      mutate("products");
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error guardando producto:", error);
      alert("Error al guardar: " + (error.message || "Error desconocido"));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      
      if (error) {
        alert("No se pudo eliminar el producto. Podría tener ventas asociadas.");
      } else {
        mutate("products");
      }
    }
  };

  const filteredProducts = (products || []).filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Inventario de Productos</h1>
          <p className="text-sm text-text-secondary">Administra el stock y precios de tus materiales.</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Buscar producto por nombre o categoría..."
          className="input-field pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <p>Cargando productos...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={(p) => {
                setEditingProduct(p);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-lg border border-dashed border-border">
          <p className="text-text-secondary">No se encontraron productos.</p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="text-primary text-sm font-medium mt-2 hover:underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
}
