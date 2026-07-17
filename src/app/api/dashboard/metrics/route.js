import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Ambil session user yang sedang aktif
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized! Sesi telah habis, silakan login kembali." },
        { status: 401 },
      );
    }

    // 2. Ambil data resume terakhir milik user (Diselaraskan ke kolom 'uploaded_at')
    const { data: latestResume, error: resumeError } = await supabase
      .from("resumes")
      .select("id, status, uploaded_at") // <- DIUBAH DARI created_at KE uploaded_at
      .order("uploaded_at", { ascending: false }) // <- DIUBAH DARI created_at KE uploaded_at
      .limit(1)
      .maybeSingle();

    if (resumeError) {
      console.error("Error fetching latest resume:", resumeError);
      throw resumeError;
    }

    // Kasus A: User belum pernah upload resume sama sekali
    if (!latestResume) {
      return NextResponse.json(
        {
          hasResume: false,
          resumeStatus: null,
          metrics: null,
        },
        { status: 200 },
      );
    }

    // Kasus B: Resume ada tapi masih dalam proses analisis AI atau gagal
    if (latestResume.status !== "completed") {
      return NextResponse.json(
        {
          hasResume: true,
          resumeStatus: latestResume.status, // 'uploaded', 'processing' atau 'failed'
          metrics: null,
        },
        { status: 200 },
      );
    }

    // Kasus C: Resume sukses dianalisis, ambil data analisis dan job matches
    const { data: latestAnalysis, error: analysisError } = await supabase
      .from("resume_analysis")
      .select(
        `
        id,
        candidate_data,
        extracted_skills,
        created_at,
        job_matches (
          match_score,
          missing_skills
        )
      `,
      )
      .eq("resume_id", latestResume.id)
      // 🔥 PERBAIKAN 1: Tambahkan order agar `maybeSingle` tidak crash jika ada 2 analisis
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (analysisError) {
      console.error("Error fetching latest analysis:", analysisError);
      throw analysisError;
    }

    if (!latestAnalysis) {
      return NextResponse.json(
        { hasResume: true, resumeStatus: "processing", metrics: null },
        { status: 200 },
      );
    }

    // 3. Transformasi & Kalkulasi Metrik Dinamis
    const skillsCount = latestAnalysis.extracted_skills?.length || 0;
    const jobMatches = latestAnalysis.job_matches || [];
    const totalMatches = jobMatches.length;

    const allMissingSkills = jobMatches.flatMap((m) => m.missing_skills || []);
    const uniqueMissingSkills = [...new Set(allMissingSkills)];
    const missingSkillsCount = uniqueMissingSkills.length;

    // 🔥 PERBAIKAN 2: Perluas pencarian key JSON dan gunakan fallback yang NETRAL
    const candidateProfile = latestAnalysis.candidate_data || {};
    const topRole =
      candidateProfile.title ||
      candidateProfile.role ||
      candidateProfile.profession ||
      candidateProfile.desired_role ||
      candidateProfile.headline ||
      "Professional";

    const scores = jobMatches.map((m) => m.match_score || 0);
    const careerScore = scores.length > 0 ? Math.max(...scores) : 70;

    return NextResponse.json(
      {
        hasResume: true,
        resumeStatus: "completed",
        metrics: {
          careerScore,
          totalMatches,
          skillsCount,
          missingSkillsCount,
          topRole,
          lastAnalyzed: latestAnalysis.created_at,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API GET Dashboard Metrics Error:", error);
    return NextResponse.json(
      { error: "Gagal memproses data metrik dashboard" },
      { status: 500 },
    );
  }
}
