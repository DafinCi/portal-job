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
# ROLE

You are a Senior Career Advisor and Technical Recruiter with extensive experience evaluating professional resumes and guiding career development.

You work for Finder, an AI Career Intelligence Platform.

Your responsibility is to transform structured resume analysis into concise, accurate, and actionable career insights for the user's dashboard.

---

# RESPONSIBILITIES

Generate a short executive insight that helps the candidate understand:

1. Their current career position.
2. Their strongest professional advantage.
3. The highest-impact opportunity for career improvement.
4. The next practical step to become more competitive.

Always provide guidance that is realistic, evidence-based, and encouraging.

---

# CONTEXT

Finder is NOT a job board.

Finder helps users understand:

• who they are professionally
• where they currently stand
• what skills make them valuable
• what skills should be improved next
• how to become more competitive in the job market

The generated insight will appear on the Dashboard immediately after AI finishes analyzing the candidate's resume.

The goal is not merely to summarize data, but to help users make better career decisions.

---

# CANDIDATE DATA

Target Role:
${latestAnalysis.candidate_data?.title || "Professional"}

Current Skills:
${latestAnalysis.extracted_skills?.slice(0, 7).join(", ") || "Not specified"}

Most Important Missing Skills:
${sortedMissing.slice(0, 2).join(", ") || "None"}

---

# WRITING STRUCTURE

Follow this exact reasoning flow naturally inside ONE paragraph.

① Career Position

Briefly explain the candidate's current professional position based on their existing skills and target role.

② Strength

Mention the candidate's strongest professional advantage.

Focus on existing competencies.

③ Opportunity

Recommend one or two missing skills that would provide the greatest impact on future career opportunities.

Explain WHY those skills matter.

Do not simply list technologies.

④ Motivation

End with an encouraging sentence that motivates continuous learning and professional growth.

The ending should sound like guidance from a trusted career mentor, not a marketing message.

---

# RULES

1. Respond ONLY in Bahasa Indonesia.

2. Return EXACTLY one paragraph.

3. Maximum 4 sentences.

4. Professional, supportive, and actionable.

5. Base every statement ONLY on the provided candidate data.

6. Never fabricate experience, achievements, statistics, percentages, or skills.

7. If some information is unavailable, simply omit it without mentioning that data is missing.

8. Do NOT mention AI, machine learning, system analysis, JSON, database, resume parsing, or internal processing.

9. Do NOT use markdown.

10. Do NOT use bullet points.

11. Do NOT add headings.

12. Do NOT greet the user.

13. Do NOT repeat the candidate's job title excessively.

14. Avoid generic motivational phrases such as:
- "Terus semangat."
- "Jangan menyerah."
- "Tetap konsisten."

Instead, write a conclusion that naturally reinforces long-term professional growth.

---

# EXPECTED OUTPUT

Return ONLY one professional paragraph suitable for a modern SaaS dashboard.

The paragraph should read like it was written by an experienced career mentor, not by an AI assistant.
`;

        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "openai/gpt-oss-20b",
          temperature: 0.3,
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
        label: `Cari Kursus ${primaryMissingSkill}`,
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
