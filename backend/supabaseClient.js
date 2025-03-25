import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;

if (!supabaseUrl) {
  throw new Error('VITE_PUBLIC_SUPABASE_URL is not defined in the environment variables.');
}

const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseAnonKey) {
  throw new Error('VITE_PUBLIC_SUPABASE_ANON_KEY is not defined in the environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
