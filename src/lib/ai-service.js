import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Inisialisasi Gemini Client
// Pastikan GEMINI_API_KEY sudah ada di .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function extractCandidateProfile(rawText) {
  // 1. Definisikan Schema JSON untuk memaksa output AI konsisten
  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      json_profile: {
        type: SchemaType.OBJECT,
        properties: {
          candidate: {
            type: SchemaType.OBJECT,
            properties: {
              name: {
                type: SchemaType.STRING,
                description:
                  "Nama lengkap kandidat. Isi 'Anonim' jika nama tidak tertulis.",
              },
              years_of_experience: {
                type: SchemaType.INTEGER,
                description:
                  "Total tahun pengalaman kerja. Jika fresh graduate atau tidak ada, isi 0.",
              },
              summary: {
                type: SchemaType.STRING,
                description:
                  "Ringkasan profesional kandidat dalam Bahasa Indonesia (maksimal 3 kalimat).",
              },
              technical_skills: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
              },
              soft_skills: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
              },
            },
            required: [
              "name",
              "years_of_experience",
              "summary",
              "technical_skills",
              "soft_skills",
            ],
          },
          career: {
            type: SchemaType.OBJECT,
            properties: {
              recommended_roles: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                description:
                  "2-3 rekomendasi role/posisi pekerjaan yang paling relevan dengan skill kandidat.",
              },
              career_level: {
                type: SchemaType.STRING,
                description:
                  "Level karier kandidat. Contoh: Entry Level, Junior, Mid, atau Senior.",
              },
              strengths: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                description:
                  "2-3 poin kekuatan utama kandidat berdasarkan CV (dalam Bahasa Indonesia).",
              },
              weaknesses: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                description:
                  "1-2 area yang perlu ditingkatkan atau skill esensial yang absen (dalam Bahasa Indonesia).",
              },
            },
            required: [
              "recommended_roles",
              "career_level",
              "strengths",
              "weaknesses",
            ],
          },
        },
        required: ["candidate", "career"],
      },
      extracted_skills: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description:
          "Array flat yang berisi gabungan SEMUA technical skills dan soft skills. Huruf kapital di awal kata.",
      },
    },
    required: ["json_profile", "extracted_skills"],
  };

  // 2. Setup Model (Gemini 1.5 Flash)
  const model = genAI.getGenerativeModel({
    model: "gemini-flash-lite-latest",
    generationConfig: {
      responseMimeType: "application/json", // Paksa model membalas dengan format JSON
      responseSchema: schema, // Terapkan aturan skema di atas
    },
    // System instruction memberi persona dan aturan ketat kepada AI
    systemInstruction: `Kamu adalah Senior Tech Recruiter dan AI Career Coach. 
Tugasmu adalah menganalisis teks ekstraksi CV, mengekstrak informasi ke dalam struktur JSON yang diminta, dan memberikan evaluasi karier yang objektif.
ATURAN WAJIB:
1. Seluruh output naratif (summary, strengths, weaknesses) HARUS menggunakan Bahasa Indonesia yang profesional.
2. Jangan berhalusinasi. Jika informasi (seperti pengalaman atau nama) tidak ditemukan dalam teks, gunakan angka 0 atau kalimat 'Tidak disebutkan'.`,
  });

  // 3. Eksekusi Prompt
  const prompt = `Berikut adalah teks hasil ekstraksi dari dokumen CV kandidat:\n\n${rawText}\n\nLakukan analisis sekarang.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Karena kita memakai responseMimeType JSON, hasilnya sudah pasti string JSON yang valid
    const parsedData = JSON.parse(responseText);
    return parsedData;
  } catch (error) {
    console.error("Gemini Extraction Error Detail:", error);
    // Bawa pesan error asli dari Gemini biar gampang di-debug
    throw new Error(`Gemini API Error: ${error.message}`);
  }
}
