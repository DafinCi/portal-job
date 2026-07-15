import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabaseAuth = await createClient();

    // 1. Cek Sesi User
    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized! Silakan login terlebih dahulu." },
        { status: 401 },
      );
    }

    // 2. Lakukan "Nested Query" untuk menarik semua data relasional
    // Kita filter otomatis dengan RLS dan eksplisit dengan eq('profile_id', user.id)
    const { data: resumes, error: dbError } = await supabaseAuth
      .from("resumes")
      .select(
        `
        id,
        file_name,
        status,
        uploaded_at,
        resume_analysis (
          id,
          job_matches (
            match_score,
            jobs (
              title,
              companies (
                name,
                logo_url
              )
            )
          )
        )
      `,
      )
      .eq("profile_id", user.id)
      .order("uploaded_at", { ascending: false });

    if (dbError) {
      console.error("Database Fetch Error:", dbError);
      return NextResponse.json(
        { error: "Gagal mengambil data riwayat resume." },
        { status: 500 },
      );
    }

    // 3. Bersihkan & Format Data untuk Frontend
    // Frontend gak butuh struktur nested yang rumit, kita bantu proses di backend
    const formattedHistory = resumes.map((resume) => {
      let bestMatch = null;

      // Jika resume sudah selesai dianalisis dan punya data analisis
      if (resume.status === "completed" && resume.resume_analysis?.length > 0) {
        // Ambil analisis terakhir (biasanya elemen pertama/satu-satunya)
        const latestAnalysis = resume.resume_analysis[0];

        if (latestAnalysis?.job_matches?.length > 0) {
          // Cari match_score paling tinggi dari array job_matches
          const topMatch = latestAnalysis.job_matches.reduce((prev, current) =>
            current.match_score > prev.match_score ? current : prev,
          );

          // Susun objek best match untuk dikirim ke frontend
          if (topMatch) {
            bestMatch = {
              score: topMatch.match_score,
              jobTitle: topMatch.jobs?.title,
              companyName: topMatch.jobs?.companies?.name,
              companyLogo: topMatch.jobs?.companies?.logo_url,
            };
          }
        }
      }

      return {
        id: resume.id,
        fileName: resume.file_name,
        status: resume.status,
        uploadedAt: resume.uploaded_at,
        bestMatch: bestMatch, // Akan berisi null jika belum completed / gagal
      };
    });

    // 4. Kirim respons yang sudah bersih ke frontend
    return NextResponse.json(
      {
        success: true,
        data: formattedHistory,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("History API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server." },
      { status: 500 },
    );
  }
}
