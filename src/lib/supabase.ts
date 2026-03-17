import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase client error: Missing URL or Anon Key. Check your .env.local file.")
}

export const supabase = createBrowserClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
)
