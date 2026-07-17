// src/features/resume/services/resume.service.js
import { supabase } from "@/lib/supabase/client";

export const resumeService = {
  // 1. Upload & Ekstrak Teks
  uploadPdf: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-resume", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Gagal mengunggah resume.");
    }

    return res.json();
  },

  // 2. Mulai AI Analysis & Job Matching
  startAnalysis: async (resumeId, rawText) => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId, rawText }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Gagal menganalisis resume.");
    }

    return res.json();
  },

  // 3. Ambil Hasil Analisis Berdasarkan ID (Dipakai saat proses upload baru selesai)
  fetchAnalysisData: async (analysisId) => {
    const { data, error } = await supabase
      .from("resume_analysis")
      .select(
        `
        candidate_data,
        extracted_skills,
        job_matches (
          match_score,
          reason,
          missing_skills,
          jobs ( id, title, company_id )
        )
      `,
      )
      .eq("id", analysisId)
      .single();

    if (error) throw new Error("Gagal mengambil data hasil analisis.");
    return data;
  },

  // 4. NEW: Ambil Analisis Terakhir User (Dipakai saat halaman pertama kali di-load)
  fetchLatestAnalysis: async () => {
    // Supabase RLS akan otomatis memfilter data berdasarkan user yang sedang login
    const { data, error } = await supabase
      .from("resume_analysis")
      .select(
        `
        id,
        created_at,
        candidate_data,
        extracted_skills,
        job_matches (
          match_score,
          reason,
          missing_skills,
          jobs ( id, title, company_id )
        )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(); // maybeSingle() digunakan agar mengembalikan null (bukan error) jika belum ada data

    if (error) throw new Error("Gagal memeriksa riwayat resume.");
    return data;
  },
};
