import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req) {
  try {
    // 1. Ambil parameter query dari URL (misal: /api/matches?analysisId=123...)
    const { searchParams } = new URL(req.url);
    const analysisId = searchParams.get("analysisId");

    if (!analysisId) {
      return NextResponse.json(
        { error: "Parameter analysisId wajib disertakan di URL" },
        { status: 400 },
      );
    }

    // 2. Query data dengan relasi (JOIN) ala Supabase
    // Mengambil job_matches beserta detail jobs dan companies-nya
    const { data: matches, error } = await supabaseAdmin
      .from("job_matches")
      .select(
        `
        match_score,
        reason,
        missing_skills,
        jobs (
          id,
          title,
          location,
          experience_level,
          requirements,
          companies (
            id,
            name,
            logo_url
          )
        )
      `,
      )
      .eq("analysis_id", analysisId)
      .order("match_score", { ascending: false }); // Urutkan dari skor paling gede

    if (error) {
      console.error("Supabase Query Error:", error);
      throw new Error("Gagal mengambil data dari database");
    }

    // 3. (Opsional tapi sangat disarankan) Merapikan struktur JSON untuk Frontend
    // Supabase mereturn array bersarang, kita ratakan biar frontend tinggal map() aja
    const formattedData = matches.map((match) => ({
      score: match.match_score,
      reason: match.reason,
      missingSkills: match.missing_skills,
      job: {
        id: match.jobs.id,
        title: match.jobs.title,
        location: match.jobs.location,
        level: match.jobs.experience_level,
        requirements: match.jobs.requirements,
      },
      company: {
        id: match.jobs.companies.id,
        name: match.jobs.companies.name,
        logoUrl: match.jobs.companies.logo_url,
      },
    }));

    // 4. Kembalikan response sukses
    return NextResponse.json(
      {
        success: true,
        data: formattedData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API GET Matches Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server" },
      { status: 500 },
    );
  }
}
