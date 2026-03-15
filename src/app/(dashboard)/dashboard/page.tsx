"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import { Search, Loader2, Package, TrendingUp, Calendar } from "lucide-react";
import ProductCard from "@/components/ProductCard";

import useSWR from "swr";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Sale = Database["public"]["Tables"]["sales"]["Row"];

export default function DashboardPage() {
  const { data: products, error: productsError } = useSWR("products", async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });
    return data || [];
  });

  const { data: sales, error: salesError } = useSWR("dashboard-sales", async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const { data } = await supabase
      .from("sales")
      .select("total, sold_at")
      .gte("sold_at", startOfMonth.toISOString());
    return data || [];
  });

  const [searchQuery, setSearchQuery] = useState("");

  const loading = !products && !productsError || !sales && !salesError;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const summary = {
    stockCount: products?.length || 0,
    dailySales: (sales as any[])?.filter((s) => new Date(s.sold_at) >= today)
      .reduce((sum, s) => sum + s.total, 0) || 0,
    monthlySales: (sales as any[])?.filter((s) => new Date(s.sold_at) >= startOfMonth)
      .reduce((sum, s) => sum + s.total, 0) || 0,
  };

  const filteredProducts = (products || []).filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Resumen General</h1>
        <p className="text-sm text-text-secondary">
          Vista rápida del estado de tu negocio hoy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider font-medium">
              Productos Registrados
            </p>
            <p className="text-2xl font-bold text-text-primary">
              {summary.stockCount}
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-success-bg rounded-lg">
            <TrendingUp className="w-6 h-6 text-success-text" />
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider font-medium">
              Ventas de Hoy
            </p>
            <p className="text-2xl font-bold text-text-primary">
              Q {summary.dailySales.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider font-medium">
              Ventas del Mes
            </p>
            <p className="text-2xl font-bold text-text-primary">
              Q {summary.monthlySales.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Buscador de Productos</h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar por nombre, categoría o precio..."
            className="input-field pl-10 h-12 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-text-secondary" />
          </div>
        ) : searchQuery ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={() => {}} // Could link to products page
                  onDelete={() => {}} // Could link to products page
                />
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-text-secondary bg-surface rounded-lg border border-dashed border-border">
                No se encontraron resultados para "{searchQuery}"
              </div>
            )}
          </div>
        ) : (
          <div className="py-10 text-center text-text-secondary bg-surface rounded-lg border border-dashed border-border">
            Escribe el nombre de un producto para buscar su disponibilidad.
          </div>
        )}
      </div>
    </div>
  );
}
