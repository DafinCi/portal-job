import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validasi ketat: Kalau kunci nggak kebaca, langsung stop dan kasih tau!
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "TOLONG CEK .ENV LU! Supabase URL atau Service Role Key kosong/tidak terbaca.",
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  // Konfigurasi tambahan wajib untuk backend supaya memori nggak bocor
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
