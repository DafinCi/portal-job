import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validasi basic input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi!" },
        { status: 400 },
      );
    }

    // Inisialisasi Supabase Server Client (Mendukung PKCE/Cookies)
    const supabase = await createClient();

    // Panggil method terbaru sesuai docs
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // URL ini nanti akan ditangkap oleh variabel {{ .RedirectTo }} di email template Supabase
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Registrasi berhasil! Silakan cek email kamu untuk verifikasi jika diperlukan.",
        user: data.user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
