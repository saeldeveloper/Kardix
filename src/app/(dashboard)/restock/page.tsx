"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import {
  AlertTriangle,
  Package,
  Loader2,
  Search,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function RestockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("stock", { ascending: true });

    if (error) console.error(error);
    else setProducts(data || []);
    setLoading(false);
  };

  const lowStockProducts = products.filter((p) => p.stock <= threshold);

  const filteredProducts = lowStockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-alert-text" />
            Productos por Comprar
          </h1>
          <p className="text-sm text-text-secondary">
            Lista de materiales con bajo inventario para reposición.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-surface p-2 rounded-lg border border-border">
          <span className="text-xs font-bold uppercase text-text-secondary px-2">
            Avisar si hay menos de:
          </span>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
            className="w-20 px-3 py-1.5 rounded border border-border focus:ring-2 focus:ring-primary/20 outline-none font-bold text-center"
            min="0"
          />
          <span className="text-xs text-text-secondary pr-2">unidades</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Filtrar por nombre o categoría..."
          className="input-field pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-text-secondary text-sm">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          Cargando inventario...
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="card bg-white p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface border-b border-border text-text-secondary uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-bold">Producto</th>
                  <th className="px-6 py-4 font-bold">Categoría</th>
                  <th className="px-6 py-4 font-bold text-center">
                    Stock Actual
                  </th>
                  <th className="px-6 py-4 font-bold text-right">
                    Precio Sugerido
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-surface/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-primary">
                        {product.name}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {product.category || "General"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          product.stock === 0
                            ? "bg-red-50 text-red-600"
                            : "bg-alert-bg text-alert-text"
                        }`}
                      >
                        {product.stock} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      Q {product.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-lg border border-dashed border-border flex flex-col items-center">
          <Package className="w-12 h-12 text-text-secondary opacity-20 mb-4" />
          <p className="text-text-secondary font-medium">
            No hay productos criticos que reponer.
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Todos tus materiales están por encima de {threshold} unidades.
          </p>
        </div>
      )}

      <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-lg border border-primary/20">
            <ShoppingCart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-bold text-text-primary">
              ¿Listo para abastecer?
            </p>
            <p className="text-sm text-text-secondary">
              Una vez compres los materiales, actualiza el stock en la sección
              de Productos.
            </p>
          </div>
        </div>
        <Link href="/products" className="btn-primary flex items-center gap-2">
          Ir a Productos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
