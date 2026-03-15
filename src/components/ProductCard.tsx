import { Database } from "@/types/database";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Edit2, Trash2 } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="card group hover:border-primary transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-text-primary leading-tight">
            {product.name}
          </h3>
          <p className="text-xs text-text-secondary mt-0.5 uppercase tracking-wider font-medium">
            {product.category || "General"}
          </p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 hover:bg-white rounded-md text-text-secondary hover:text-primary transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-1.5 hover:bg-white rounded-md text-text-secondary hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.05em] font-medium mb-1">
            Precio
          </p>
          <p className="text-xl font-bold text-text-primary">
            Q {product.price.toFixed(2)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.05em] font-medium mb-1">
            Stock
          </p>
          <span
            className={cn(
              "px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider",
              isOutOfStock
                ? "bg-red-50 text-red-600"
                : isLowStock
                  ? "bg-alert-bg text-alert-text"
                  : "bg-success-bg text-success-text",
            )}
          >
            {isOutOfStock ? "Agotado" : `${product.stock} unidades`}
          </span>
        </div>
      </div>
    </div>
  );
}
