import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { extractCandidateProfile } from "@/lib/ai-service";
import { analyzeJobMatches } from "@/lib/match-service";

export async function POST(req) {
  try {
    const body = await req.json();
    const { resumeId, rawText, userId } = body;

    if (!resumeId || !rawText) {
      return NextResponse.json(
        { error: "resumeId dan rawText wajib dikirim" },
        { status: 400 },
      );
    }
    await supabaseAdmin
      .from("resumes")
      .update({ status: "processing" })
      .eq("id", resumeId);

    const aiCandidateData = await extractCandidateProfile(rawText);

    // Simpan hasil The Big JSON ke database
    const { data: analysisData, error: analysisError } = await supabaseAdmin
      .from("resume_analysis")
      .insert({
        resume_id: resumeId,
        model_version: "gemini-flash-lite",
        prompt_version: "v1.0",
        candidate_data: aiCandidateData.json_profile,
        extracted_skills: aiCandidateData.extracted_skills,
      })
      .select("id")
      .single();

    if (analysisError) throw analysisError;
    const analysisId = analysisData.id;

    // ==========================================
    // TAHAP 2: PRE-FILTERING JOBS (FAST POSTGRES QUERY)
    // ==========================================
    // Ambil top 10 jobs yang punya irisan skill dengan kandidat menggunakan && (overlap)
    const { data: topJobs, error: jobsError } = await supabaseAdmin
      .from("jobs")
      .select("id, title, description, requirements, company_id")
      .filter(
        "requirements",
        "ov",
        `{${aiCandidateData.extracted_skills.join(",")}}`,
      ) // ov = overlap
      .limit(10);

    if (jobsError) throw jobsError;

    // ==========================================
    // TAHAP 3: DEEP AI MATCHING (LLM CALL 2)
    // ==========================================
    if (topJobs && topJobs.length > 0) {
      // AI membandingkan profil kandidat dengan 10 lowongan yang terfilter
      const matchResults = await analyzeJobMatches(
        aiCandidateData.json_profile,
        topJobs,
      );

      // Siapkan array data untuk di-insert sekaligus (bulk insert) ke job_matches
      const matchInsertData = matchResults.map((match) => ({
        analysis_id: analysisId,
        job_id: match.job_id,
        match_score: match.score,
        reason: match.reason,
        missing_skills: match.missing_skills,
      }));

      // Simpan hasil matching ke database
      await supabaseAdmin.from("job_matches").insert(matchInsertData);
    }

    // ==========================================
    // TAHAP 4: SELESAI
    // ==========================================
    // Update status resume jadi 'completed'
    await supabaseAdmin
      .from("resumes")
      .update({ status: "completed" })
      .eq("id", resumeId);

    // Kirim response sukses ke frontend
    return NextResponse.json(
      {
        success: true,
        message: "Analisis selesai",
        analysisId: analysisId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API Analyze Error:", error);

    if (typeof resumeId !== "undefined") {
      await supabaseAdmin
        .from("resumes")
        .update({ status: "failed" })
        .eq("id", resumeId);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
