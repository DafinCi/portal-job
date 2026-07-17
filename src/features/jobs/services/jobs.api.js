import { supabase } from "@/lib/supabase/client";

export const jobsApi = {
  // Ambil seluruh kecocokan kerja berdasarkan id analisis
  getJobMatches: async (analysisId) => {
    const { data, error } = await supabase
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
          description,
          requirements,
          location,
          experience_level,
          companies (
            id,
            name,
            logo_url
          )
        )
      `,
      )
      .eq("analysis_id", analysisId)
      .order("match_score", { ascending: false });

    if (error) {
      console.error("Error fetching job matches:", error);
      throw new Error("Gagal mengambil rekomendasi lowongan kerja.");
    }

    // Meratakan struktur nested data dari Supabase agar mudah dikonsumsi frontend
    return data.map((match) => ({
      matchId: match.id,
      matchScore: match.match_score,
      reason: match.reason,
      missingSkills: Array.isArray(match.missing_skills)
        ? match.missing_skills
        : typeof match.missing_skills === "string"
          ? JSON.parse(match.missing_skills)
          : [],
      jobId: match.jobs?.id,
      title: match.jobs?.title,
      description: match.jobs?.description,
      requirements: match.jobs?.requirements || [],
      location: match.jobs?.location,
      experienceLevel: match.jobs?.experience_level,
      companyId: match.jobs?.companies?.id,
      companyName: match.jobs?.companies?.name,
      companyLogo: match.jobs?.companies?.logo_url,
    }));
  },

  // Ambil detail pekerjaan langsung (untuk slider/drawer/popup)
  getJobDetail: async (jobId) => {
    const { data, error } = await supabase
      .from("jobs")
      .select(
        `
        id,
        title,
        description,
        requirements,
        location,
        experience_level,
        companies (
          id,
          name,
          logo_url,
          description
        )
      `,
      )
      .eq("id", jobId)
      .single();

    if (error) {
      console.error("Error fetching job detail:", error);
      throw new Error("Gagal mengambil detail pekerjaan.");
    }

    return data;
  },
};
