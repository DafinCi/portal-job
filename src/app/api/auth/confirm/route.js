import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type"); // Tipe OTP: 'email', 'recovery', dll.
  const next = searchParams.get("next") ?? "/"; // Halaman tujuan setelah sukses

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;

  // Bersihkan query param token_hash agar tidak bocor di URL tujuan
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (token_hash && type) {
    const supabase = await createClient();

    // Tukar token_hash menjadi session aktif sesuai docs v2
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Jika berhasil, redirect user ke halaman tujuan (misal: /dashboard)
      return NextResponse.redirect(redirectTo);
    }
  }

  // Jika gagal/error, lempar user ke halaman error khusus
  redirectTo.pathname = "/auth/auth-code-error";
  return NextResponse.redirect(redirectTo);
}
