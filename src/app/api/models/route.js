import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key belum kebaca di .env" },
        { status: 400 },
      );
    }

    // Tembak langsung ke endpoint Google pakai fetch standar
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );
    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    // Filter hanya nama modelnya saja biar gampang dibaca
    const modelNames = data.models.map((m) => m.name);

    return NextResponse.json({
      message: "Ini daftar model yang aktif untuk API Key lu:",
      available_models: modelNames,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
