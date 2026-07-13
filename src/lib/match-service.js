import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Fungsi untuk menganalisis kecocokan antara kandidat dan daftar pekerjaan
 * @param {Object} candidateData - Objek json_profile hasil ekstraksi CV
 * @param {Array} jobs - Array berisi top 10 lowongan dari database (id, title, requirements, dll)
 * @returns {Array} Array of objects berisi job_id, score, reason, missing_skills
 */
export async function analyzeJobMatches(candidateData, jobs) {
  // 1. Definisikan Schema agar outputnya berupa Array hasil matching
  const schema = {
    type: SchemaType.ARRAY,
    description:
      "Daftar hasil analisis kecocokan untuk setiap pekerjaan yang diberikan.",
    items: {
      type: SchemaType.OBJECT,
      properties: {
        job_id: {
          type: SchemaType.STRING,
          description:
            "ID dari pekerjaan yang dianalisis. Harus sama persis dengan input.",
        },
        score: {
          type: SchemaType.INTEGER,
          description:
            "Skor kecocokan dari 0 hingga 100 berdasarkan skill dan pengalaman.",
        },
        reason: {
          type: SchemaType.STRING,
          description:
            "Alasan detail dalam Bahasa Indonesia (maksimal 2 kalimat) mengapa kandidat cocok atau kurang cocok.",
        },
        missing_skills: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description:
            "Daftar skill spesifik dari requirement job yang TIDAK dimiliki kandidat. Kosongkan jika punya semua.",
        },
      },
      required: ["job_id", "score", "reason", "missing_skills"],
    },
  };

  // 2. Setup Model Gemini
  const model = genAI.getGenerativeModel({
    model: "gemini-flash-lite-latest",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
    systemInstruction: `Kamu adalah Expert Tech Recruiter. 
Tugasmu adalah menganalisis kecocokan antara profil kandidat dengan beberapa lowongan pekerjaan.
Berikan penilaian objektif (skor 0-100). Jangan ragu memberi skor rendah jika skill utamanya tidak cocok. 
Pastikan 'job_id' di output sama persis dengan 'job_id' yang diberikan pada input. Alasan (reason) HARUS dalam Bahasa Indonesia.`,
  });

  // 3. Susun Prompt dengan Data JSON
  // Kita stringify data kandidat dan data lowongan agar Gemini bisa membaca konteksnya
  const prompt = `
Berikut adalah data Profil Kandidat:
${JSON.stringify(candidateData, null, 2)}

Berikut adalah daftar Lowongan Pekerjaan (Top Jobs) yang harus dievaluasi:
${JSON.stringify(jobs, null, 2)}

Bandingkan kandidat dengan masing-masing lowongan pekerjaan, lalu berikan hasil evaluasinya.
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const parsedMatches = JSON.parse(responseText);
    return parsedMatches;
  } catch (error) {
    console.error("Gemini Job Matching Error:", error);
    throw new Error(
      "Gagal melakukan kalkulasi kecocokan pekerjaan menggunakan AI.",
    );
  }
}
