export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
          price: number
          stock: number
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
          price: number
          stock?: number
          user_id?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
          price?: number
          stock?: number
          user_id?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          id: string
          user_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          total: number
          sold_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          total: number
          sold_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          unit_price?: number
          total?: number
          sold_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_sale_v2: {
        Args: {
          p_product_id: string
          p_product_name: string
          p_quantity: number
          p_unit_price: number
          p_total: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
