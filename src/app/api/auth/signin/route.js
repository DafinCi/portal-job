import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi!" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Panggil method login terbaru sesuai docs
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Biasanya error karena password salah atau email belum diverifikasi
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Di balik layar, helper createClient() sudah otomatis menyisipkan session token ke Cookies browser
    return NextResponse.json(
      {
        success: true,
        message: "Login sukses!",
        user: data.user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Signin Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
