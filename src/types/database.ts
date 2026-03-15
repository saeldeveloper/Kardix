export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          price: number
          stock: number
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          stock?: number
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          stock?: number
          category?: string | null
          created_at?: string
        }
      }
      sales: {
        Row: {
          id: string
          product_id: string
          quantity: number
          unit_price: number
          total: number
          sold_at: string
        }
        Insert: {
          id?: string
          product_id: string
          quantity: number
          unit_price: number
          total: number
          sold_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total?: number
          sold_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
