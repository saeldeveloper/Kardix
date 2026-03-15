"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import { Calendar, TrendingUp, Loader2, Trash2 } from "lucide-react";

import useSWR, { useSWRConfig } from "swr";

type Sale = Database["public"]["Tables"]["sales"]["Row"];

export default function ReportsPage() {
  const { mutate: globalMutate } = useSWRConfig();
  const { data: sales, error: salesError, mutate } = useSWR("reports-sales", async () => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .gte("sold_at", threeMonthsAgo.toISOString())
      .order("sold_at", { ascending: false });

    if (error) throw error;
    return data || [];
  });

  const [activeTab, setActiveTab] = useState<"daily" | "monthly">("daily");
  const loading = !sales && !salesError;

  const handleDeleteSale = async (sale: any) => {
    if (
      !confirm(
        `¿Estás seguro de que deseas anular esta venta de "${sale.product_name}"? Las unidades se devolverán al inventario.`,
      )
    ) {
      return;
    }

    try {
      // 1. Restaurar stock si el producto aún existe
      if (sale.product_id) {
        const { data: product, error: findError } = await (supabase.from("products") as any)
          .select("stock")
          .eq("id", sale.product_id)
          .single();

        if (!findError && product) {
          await (supabase.from("products") as any)
            .update({ stock: product.stock + sale.quantity })
            .eq("id", sale.product_id);
        }
      }

      // 2. Eliminar la venta
      const { error: deleteError } = await supabase
        .from("sales")
        .delete()
        .eq("id", sale.id);

      if (deleteError) throw deleteError;

      alert("Venta anulada y stock restaurado.");
      mutate();
      globalMutate("products");
    } catch (error) {
      console.error("Error al borrar venta:", error);
      alert("No se pudo anular la venta.");
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dailySales = (sales || []).filter((s) => new Date(s.sold_at) >= today);

  // Group by month
  const monthlySummary = (sales || []).reduce((acc: any, sale) => {
    const date = new Date(sale.sold_at);
    const month = date.toLocaleString("es-GT", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) acc[month] = 0;
    acc[month] += sale.total;
    return acc;
  }, {});

  const currentMonth = today.toLocaleString("es-GT", {
    month: "long",
    year: "numeric",
  });
  const currentMonthTotal = monthlySummary[currentMonth] || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Reportes y Estadísticas</h1>
        <p className="text-sm text-text-secondary">
          Análisis de ventas diarias y acumulado mensual.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white border-l-4 border-l-primary">
          <p className="text-xs text-text-secondary uppercase tracking-wider font-bold mb-1">
            Total Hoy
          </p>
          <p className="text-3xl font-bold text-text-primary">
            Q {dailySales.reduce((sum, s) => sum + s.total, 0).toFixed(2)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-text-secondary">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span>{dailySales.length} transacciones</span>
          </div>
        </div>

        <div className="card bg-white border-l-4 border-l-green-600">
          <p className="text-xs text-text-secondary uppercase tracking-wider font-bold mb-1">
            Total Mes ({currentMonth})
          </p>
          <p className="text-3xl font-bold text-text-primary">
            Q {currentMonthTotal.toFixed(2)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-text-secondary">
            <Calendar className="w-3 h-3 text-primary" />
            <span>Actualizado al instante</span>
          </div>
        </div>
      </div>

      <div className="card bg-white p-0 overflow-hidden">
        <div className="flex border-b border-border bg-surface">
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "daily"
                ? "border-primary text-primary bg-white"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            Ventas del Día
          </button>
          <button
            onClick={() => setActiveTab("monthly")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "monthly"
                ? "border-primary text-primary bg-white"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            Resumen Mensual
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-text-secondary">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Cargando datos...</p>
            </div>
          ) : activeTab === "daily" ? (
            <div className="space-y-4">
              {dailySales.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-text-secondary uppercase text-[10px] tracking-widest border-b border-border">
                        <th className="pb-3 font-bold">Producto</th>
                        <th className="pb-3 font-bold">Cantidad</th>
                        <th className="pb-3 font-bold">Precio Unit.</th>
                        <th className="pb-3 font-bold text-right">Total</th>
                        <th className="pb-3 font-bold text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {dailySales.map((sale) => (
                        <tr
                          key={sale.id}
                          className="hover:bg-surface transition-colors group"
                        >
                          <td className="py-3 font-medium text-text-primary">
                            {sale.product_name}
                          </td>
                          <td className="py-3 text-text-secondary">
                            {sale.quantity}
                          </td>
                          <td className="py-3 text-text-secondary">
                            Q {sale.unit_price.toFixed(2)}
                          </td>
                          <td className="py-3 font-bold text-right text-text-primary">
                            Q {sale.total.toFixed(2)}
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <span className="text-[11px] text-text-secondary uppercase">
                                {new Date(sale.sold_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <button
                                onClick={() => handleDeleteSale(sale)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-text-secondary hover:text-red-500 transition-all"
                                title="Anular venta"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-10 text-center text-text-secondary">
                  Aún no hay ventas registradas el día de hoy.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(monthlySummary).map(([month, total]) => (
                  <div
                    key={month}
                    className="flex items-center justify-between p-4 border border-border rounded-lg bg-surface"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded flex items-center justify-center border border-border">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <span className="capitalize font-medium text-text-primary">
                        {month}
                      </span>
                    </div>
                    <span className="font-bold text-lg">
                      Q {(total as number).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
