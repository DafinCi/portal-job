import { createBrowserClient } from "@supabase/ssr";

// Menggunakan browser client khusus SSR
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
