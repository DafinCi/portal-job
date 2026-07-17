import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Groq from "groq-sdk";

export async function GET(request) {
  try {
    const supabase = await createClient();

    // 1. Ambil query parameter "?force=true" jika ada
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("force") === "true";

    // 2. Get current authenticated user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Ambil data analisis terakhir
    const { data: latestAnalysis, error: analysisError } = await supabase
      .from("resume_analysis")
      .select(
        `
        id,
        candidate_data,
        extracted_skills,
        ai_insight,
        job_matches (
          match_score,
          missing_skills
        )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (analysisError) {
      console.error("Error fetching analysis for insight:", analysisError);
      throw analysisError;
    }

    // Jika belum ada data analisis, berikan CTA default
    if (!latestAnalysis) {
      return NextResponse.json(
        {
          insightText:
            "Selamat datang di Finder! Silakan unggah resume Anda terlebih dahulu agar AI kami dapat menganalisis kesiapan karier dan memberikan saran yang dipersonalisasi.",
          quickActions: [
            {
              id: "upload_resume",
              label: "Upload Resume Pertama Anda",
              type: "action",
              priority: "high",
              path: "/resume",
            },
          ],
        },
        { status: 200 },
      );
    }

    // CACHING LAYER: Jika sudah di-cache & user TIDAK force refresh, gunakan cache!
    if (latestAnalysis.ai_insight && !forceRefresh) {
      return NextResponse.json(latestAnalysis.ai_insight, { status: 200 });
    }

    // 4. Temukan kesenjangan skill (skill gap)
    const missingSkillsMap = {};
    latestAnalysis.job_matches?.forEach((m) => {
      m.missing_skills?.forEach((skill) => {
        missingSkillsMap[skill] = (missingSkillsMap[skill] || 0) + 1;
      });
    });

    const sortedMissing = Object.entries(missingSkillsMap)
      .sort((a, b) => b[1] - a[1])
      .map(([skill]) => skill);

    const primaryMissingSkill = sortedMissing[0] || null;

    // Default fallback text jika AI gagal
    let insightText = `Berdasarkan analisis profil Anda sebagai ${latestAnalysis.candidate_data?.title || "Tech Professional"}, Anda memiliki fondasi yang kuat. Melengkapi beberapa keahlian tambahan akan membuat portofolio Anda semakin menonjol di pasar kerja saat ini.`;

    // 🔥 PERBAIKAN 2: Inisialisasi Groq & Generate Content
    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey) {
      try {
        const groq = new Groq({ apiKey: groqApiKey });

        const prompt = `
      Kamu adalah Elit Career Advisor yang bekerja di platform Finder.
      Tugasmu adalah menulis 1 paragraf ringkasan eksekutif (maksimal 3 kalimat) dalam Bahasa Indonesia untuk dashboard pengguna.
      
      Data Kandidat:
      - Target Peran: ${latestAnalysis.candidate_data?.title || "Professional"}
      - Keahlian Saat Ini: ${latestAnalysis.extracted_skills?.slice(0, 7).join(", ")}
      - Skill Paling Dibutuhkan Pasar Yang Belum Dimiliki: ${sortedMissing.slice(0, 3).join(", ") || "Semua skill sudah sangat cocok!"}
      
      Aturan Penulisan (WAJIB DIPATUHI):
      - LANGSUNG tulis paragraf rekomendasi akhir. 
      - Hubungkan keahlian yang mereka miliki dengan apa yang harus mereka pelajari agar bisa meningkatkan daya saing (gunakan angka persuasif, misal: 'meningkatkan kecocokan profil Anda hingga 15%').
      - Gunakan gaya bahasa yang ramah, profesional, dan mendorong tindakan (actionable).
    `;

        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "openai/gpt-oss-20b",
          temperature: 0.8,
          max_tokens: 1000,
        });

        let generatedText =
          chatCompletion.choices[0]?.message?.content?.trim() || "";

        if (generatedText.includes("<think>")) {
          generatedText = generatedText
            .replace(/<think>[\s\S]*?<\/think>/g, "")
            .trim();
        }

        if (generatedText) {
          insightText = generatedText;
        }
      } catch (groqError) {
        console.error("Groq Advisor Fallback Triggered:", groqError);
        if (primaryMissingSkill) {
          insightText = `Anda memiliki kecocokan yang sangat baik untuk peran ${latestAnalysis.candidate_data?.title || "Tech Professional"}. Fokus mempelajari keahlian ${primaryMissingSkill} akan menjadi langkah paling strategis untuk mendongkrak skor kecocokan Anda di berbagai lowongan kerja aktif kami.`;
        }
      }
    }

    // 6. Buat Quick Actions
    const quickActions = [];

    if (primaryMissingSkill) {
      quickActions.push({
        id: "learn_skill",
        label: `Cari Lowongan ${primaryMissingSkill}`,
        type: "action",
        priority: "high",
        path: `/jobs?search=${encodeURIComponent(primaryMissingSkill)}`,
      });
    }

    quickActions.push({
      id: "browse_jobs",
      label: "Lihat Rekomendasi Pekerjaan",
      type: "navigation",
      priority: "medium",
      path: "/jobs",
    });

    quickActions.push({
      id: "reupload_resume",
      label: "Perbarui Resume",
      type: "action",
      priority: "low",
      path: "/resume",
    });

    const responsePayload = {
      insightText,
      quickActions,
    };

    // SIMPAN KE DATABASE (Cache)
    const { error: updateError } = await supabase
      .from("resume_analysis")
      .update({ ai_insight: responsePayload })
      .eq("id", latestAnalysis.id);

    if (updateError) {
      console.error(
        "Gagal menyimpan ai_insight ke cache database:",
        updateError,
      );
    }

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error("API GET Dashboard Insight Error:", error);
    return NextResponse.json(
      { error: "Gagal memuat rekomendasi insight AI" },
      { status: 500 },
    );
  }
}
