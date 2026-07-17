import { supabase } from "@/lib/supabase/client";

/**
 * 1. Memicu proses analisis AI di backend (LLM Call 1 & 2)
 * @param {string} resumeId - ID resume dari tabel resumes
 * @param {string} rawText - Teks hasil ekstraksi PDF
 * @returns {Promise<Object>} { success: true, analysisId }
 */
export async function startAnalysis(resumeId, rawText) {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resumeId, rawText }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Terjadi kesalahan saat menganalisis resume.",
      );
    }

    return data; // Mengembalikan { success: true, analysisId }
  } catch (error) {
    console.error("Client Service Analysis Error:", error);
    throw error;
  }
}

/**
 * 2. Mengambil detail data profil hasil ekstrak AI beserta hasil job matching-nya
 * @param {string} analysisId - ID dari tabel resume_analysis
 * @returns {Promise<Object>} Data lengkap profil dan daftar lowongan yang cocok
 */
export async function fetchAnalysisData(analysisId) {
  try {
    // 💡 Langsung gunakan objek `supabase` tanpa memanggil fungsi lagi
    const { data: analysis, error: analysisError } = await supabase
      .from("resume_analysis")
      .select("id, candidate_data, extracted_skills, created_at")
      .eq("id", analysisId)
      .single();

    if (analysisError) throw analysisError;

    // Ambil daftar pekerjaan yang cocok (job matches) beserta relasi data lowongannya
    const { data: matches, error: matchesError } = await supabase
      .from("job_matches")
      .select(
        `
        id,
        match_score,
        reason,
        missing_skills,
        jobs (
          id,
          title,
          requirements,
          company_id
        )
      `,
      )
      .eq("analysis_id", analysisId)
      .order("match_score", { ascending: false });

    if (matchesError) throw matchesError;

    return {
      profile: analysis.candidate_data,
      skills: analysis.extracted_skills,
      jobMatches: matches || [],
      created_at: analysis.created_at,
    };
  } catch (error) {
    console.error("Client Service Fetch Data Error:", error);
    throw new Error("Gagal mengambil data analisis dari database.");
  }
}

/**
 * 3. Mengambil riwayat analisis terbaru berdasarkan ID Resume (untuk kebutuhan UI)
 * @param {string} resumeId
 */
export async function fetchLatestAnalysis(resumeId) {
  try {
    const { data, error } = await supabase
      .from("resume_analysis")
      .select("id")
      .eq("resume_id", resumeId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data; // Mengembalikan { id } atau null jika belum pernah dianalisis
  } catch (error) {
    console.error("Client Service Fetch Latest Error:", error);
    throw error;
  }
}

/**
 * 4. Mengambil ID analisis terbaru milik user secara global
 * Mengandalkan RLS Supabase tanpa butuh resumeId.
 */
export async function fetchUserLatestAnalysis() {
  try {
    const { data, error } = await supabase
      .from("resume_analysis")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data; // Mengembalikan { id } atau null
  } catch (error) {
    console.error("Client Service Fetch User Latest Error:", error);
    throw error;
  }
}
