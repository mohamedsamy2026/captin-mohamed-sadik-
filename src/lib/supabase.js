import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// لو المفاتيح مش موجودة في .env بيرجع null والموقع بيشتغل ببيانات فولدر data.
export const supabase = url && key ? createClient(url, key) : null
