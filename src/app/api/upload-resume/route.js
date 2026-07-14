import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PDFParse } from "pdf-parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    // 🔥 AUTENTIKASI: Ambil user dari cookies (Tidak bisa dimanipulasi)
    const supabaseAuth = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized! Sesi telah habis, silakan login kembali." },
        { status: 401 },
      );
    }

    const userId = user.id; // 🔥 Dapatkan ID asli dari server

    // ---------------------------------------------------------

    const formData = await req.formData();
    const file = formData.get("file");
    // const userId = formData.get("userId"); // ❌ HAPUS BARIS INI

    // --- LAPIS 1 & 2: Validasi Dasar ---
    if (!file) {
      // Hapus validasi userId karena sudah divalidasi di atas
      return NextResponse.json(
        { error: "File PDF wajib dikirim!" },
        { status: 400 },
      );
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Format file harus PDF!" },
        { status: 400 },
      );
    }

    // --- LAPIS 3: Konversi & Ekstraksi PDF (v2 Syntax) ---
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let rawText = "";
    let parser;

    try {
      parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      rawText = result.text.trim();
    } catch (parseError) {
      console.error("PDF Parse Error:", parseError);
      return NextResponse.json(
        { error: "Gagal membaca teks dari PDF. File corrupt atau dipasword." },
        { status: 400 },
      );
    } finally {
      if (parser) {
        await parser.destroy();
      }
    }

    // --- LAPIS 4: Cek Teks Kosong (Image/Scan) ---
    if (!rawText || rawText.length < 50) {
      return NextResponse.json(
        {
          error:
            "PDF kosong atau berupa hasil scan gambar. AI membutuhkan teks murni.",
        },
        { status: 400 },
      );
    }

    // --- LAPIS 5: Upload ke Supabase Storage ---
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const storagePath = `${userId}/${timestamp}_${safeFileName}`; // Tetap aman pakai userId dari sesi

    const { data: storageData, error: storageError } =
      await supabaseAdmin.storage.from("resumes").upload(storagePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (storageError) {
      console.error("Storage Upload Error:", storageError);
      return NextResponse.json(
        { error: "Gagal mengunggah file ke Supabase Storage." },
        { status: 500 },
      );
    }

    // --- LAPIS 6 & 7: Insert DB & Auto-Rollback ---
    const { data: resumeRecord, error: dbError } = await supabaseAdmin
      .from("resumes")
      .insert({
        profile_id: userId,
        file_name: file.name,
        storage_path: storagePath,
        raw_text: rawText,
        status: "uploaded",
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Database Insert Error:", dbError);
      await supabaseAdmin.storage.from("resumes").remove([storagePath]);
      return NextResponse.json(
        { error: "Gagal menyimpan metadata ke database." },
        { status: 500 },
      );
    }

    // --- BERHASIL ---
    return NextResponse.json(
      {
        success: true,
        message: "Upload dan ekstraksi teks berhasil",
        resumeId: resumeRecord.id,
        rawText: rawText,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Unhandled Upload Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem internal server." },
      { status: 500 },
    );
  }
}
