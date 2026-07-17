import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function extractCandidateProfile(rawText) {
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
              title: {
                type: SchemaType.STRING,
                description: "Satu title profesional utama.",
              },
              years_of_experience: {
                type: SchemaType.INTEGER,
                description: "Total akumulasi tahun pengalaman kerja.",
              },
              summary: {
                type: SchemaType.STRING,
                description:
                  "Executive summary profesional kandidat dalam Bahasa Indonesia.",
              },
              skills: {
                type: SchemaType.OBJECT,
                properties: {
                  core: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING },
                  },
                  supporting: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING },
                  },
                },
                required: ["core", "supporting"],
              },
              experience: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    company: { type: SchemaType.STRING },
                    role: { type: SchemaType.STRING },
                    duration: { type: SchemaType.STRING },
                    achievements: {
                      type: SchemaType.ARRAY,
                      items: { type: SchemaType.STRING },
                    },
                  },
                  required: ["company", "role", "duration", "achievements"],
                },
              },
              education: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    institution: { type: SchemaType.STRING },
                    degree: { type: SchemaType.STRING },
                    year: { type: SchemaType.STRING },
                  },
                  required: ["institution", "degree", "year"],
                },
              },
            },
            required: [
              "name",
              "title",
              "years_of_experience",
              "summary",
              "skills",
              "experience",
              "education",
            ],
          },
          career: {
            type: SchemaType.OBJECT,
            properties: {
              recommended_roles: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
              },
              career_level: { type: SchemaType.STRING },
              strengths: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
              },
              weaknesses: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
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
      },
    },
    required: ["json_profile", "extracted_skills"],
  };

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-lite-latest",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
    systemInstruction: `Kamu adalah Senior Tech Recruiter dan AI Career Coach profesional...`,
  });

  const prompt = `Berikut adalah teks hasil ekstraksi dari dokumen CV kandidat:\n\n${rawText}\n\nLakukan analisis sekarang.`;
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
