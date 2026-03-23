"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Loader2,
  CheckCircle2,
  Search,
  PlusCircle,
  X,
} from "lucide-react";

import useSWR, { useSWRConfig } from "swr";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface CartItem {
  product: Product;
  quantity: number;
  isManual?: boolean;
}

export default function SalesPage() {
  const { mutate } = useSWRConfig();
  const { data: products, error } = useSWR("products", async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .gt("stock", 0)
      .order("name", { ascending: true });
    if (error) throw error;
    return data || [];
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [manualQuantity, setManualQuantity] = useState("1");

  const loading = !products && !error;

  const filteredProducts =
    searchQuery.trim() === ""
      ? []
      : (products || []).filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.category?.toLowerCase() || "").includes(
              searchQuery.toLowerCase(),
            ),
        );

  const addToCart = (product: Product, isManual = false) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing && !isManual) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      // Para productos manuales, simplemente los agregamos como nuevos items si queremos,
      // o los agrupamos por nombre. Por simplicidad, los agrupamos por ID generado.
      return [...prev, { product, quantity: isManual ? parseInt(manualQuantity || "1") : 1, isManual }];
    });
    if (isManual) {
      setIsManualModalOpen(false);
      setManualName("");
      setManualPrice("");
      setManualQuantity("1");
    }
  };

  const addManualProduct = () => {
    if (!manualName || !manualPrice) return;
    
    const manualProduct: Product = {
      id: `manual-${Date.now()}`,
      name: manualName,
      price: parseFloat(manualPrice),
      stock: 999999, // Dummy stock for manual
      category: "Manual",
      user_id: "", // Will be handled by DB or ignored
      created_at: new Date().toISOString(),
    };

    addToCart(manualProduct, true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty < 1 || (!item.isManual && newQty > item.product.stock)) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    );
  };

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  const handleCompleteSale = async () => {
    if (cart.length === 0) return;
    setProcessing(true);

    try {
      // Complete sales using the RPC function for atomicity
      for (const item of cart) {
        // Para productos manuales, necesitamos un ID de producto válido si el RPC lo requiere.
        // Intentaremos usar un ID nulo o vacío, o un ID especial si existe.
        const isManual = item.isManual;
        const productId = isManual ? null : item.product.id;

        const { error: rpcError } = await supabase.rpc("complete_sale_v2", {
          p_product_id: productId as any, // Bypass TS for manual
          p_product_name: item.product.name,
          p_quantity: item.quantity,
          p_unit_price: item.product.price,
          p_total: item.product.price * item.quantity,
        });

        if (rpcError) throw rpcError;
      }

      setSuccess(true);
      setCart([]);
      mutate("products");

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error completing sale:", error);
      alert("Hubo un error al procesar la venta.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Registro de Ventas</h1>
          <p className="text-sm text-text-secondary">
            Selecciona los productos y completa la transacción.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
          <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b border-border bg-surface flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="font-bold text-sm uppercase tracking-wider text-text-secondary">
                Productos Disponibles
              </h2>
               <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    className="input-field pl-9 py-1.5 text-xs h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setIsManualModalOpen(true)}
                  className="btn-outline flex items-center justify-center gap-2 h-9 text-xs py-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Producto Manual
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-10 flex justify-center text-text-secondary">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary hover:bg-surface transition-all text-left group"
                  >
                    <div>
                      <p className="font-bold text-text-primary group-hover:text-primary transition-colors">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-text-secondary uppercase tracking-tight">
                        {product.category || "General"}
                      </p>
                      <p className="text-xs text-text-secondary mt-1 font-medium">
                        Stock: {product.stock}
                      </p>
                    </div>
                    <p className="font-bold text-primary">
                      Q {product.price.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center text-text-secondary flex flex-col items-center justify-center">
                <Search className="w-8 h-8 opacity-20 mb-3" />
                {searchQuery.trim() === "" ? (
                  <p>
                    Escribe el nombre de un producto para empezar a agregar.
                  </p>
                ) : (
                  <>
                    <p>No se encontraron productos para "{searchQuery}".</p>
                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-text-secondary text-xs hover:underline font-medium"
                      >
                        Limpiar búsqueda
                      </button>
                      <button
                        onClick={() => {
                          setManualName(searchQuery);
                          setIsManualModalOpen(true);
                        }}
                        className="text-primary text-xs hover:underline font-bold flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Agregar "{searchQuery}" manualmente
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cart / Summary */}
        <div className="space-y-4 order-1 lg:order-2">
          <div className="card p-6 sticky top-8">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Resumen de Venta
            </h2>

            {cart.length === 0 ? (
              <p className="text-sm text-text-secondary py-10 text-center">
                El carrito está vacío.
              </p>
            ) : (
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex flex-col gap-2 pb-4 border-b border-border last:border-0"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium">{item.product.name}</p>
                          {item.isManual && (
                            <span className="text-[9px] bg-alert-bg text-alert-text px-1 rounded font-bold uppercase tracking-tighter">Manual</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-text-secondary hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="p-1 border border-border rounded hover:bg-surface"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="p-1 border border-border rounded hover:bg-surface"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-sm font-bold">
                        Q {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Total</span>
                <span className="text-2xl font-bold">Q {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCompleteSale}
              disabled={cart.length === 0 || processing}
              className="w-full btn-primary mt-6 py-3 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Completar Venta"
              )}
            </button>

            {success && (
              <div className="mt-4 p-3 bg-success-bg text-success-text text-sm rounded-lg flex items-center justify-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                ¡Venta registrada con éxito!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Product Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-surface w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg">Agregar Producto Manual</h3>
              <button onClick={() => setIsManualModalOpen(false)} className="text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">Nombre del Producto</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ej. Servicio de Envío"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">Precio Unitario (Q)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="0.00"
                    value={manualPrice}
                    onChange={(e) => setManualPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">Cantidad</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    min="1"
                    value={manualQuantity}
                    onChange={(e) => setManualQuantity(e.target.value)}
                  />
                </div>
              </div>
              <button 
                onClick={addManualProduct}
                disabled={!manualName || !manualPrice}
                className="w-full btn-primary py-3 mt-2 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
