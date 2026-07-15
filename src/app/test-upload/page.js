"use client";

import { useState } from "react";

export default function TestUploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Pilih file PDF dulu, bro!");
      return;
    }

    setLoading(true);
    setResult(null);

    // Siapkan data form seperti di Postman/Thunder Client
    const formData = new FormData();
    formData.append("file", file);
    // Kita pakai ID Budi yang ada di database lu sebagai dummy
    formData.append("userId", "cb2a1d5d-b138-4304-9f8c-013caac0e2cd");

    try {
      const response = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto h-full font-sans">
      <h1 className="text-2xl font-bold mb-5">🧪 Test Upload & Ekstrak PDF</h1>

      <form
        onSubmit={handleUpload}
        className="space-y-4 border p-5 rounded-[8px] bg-gray-50"
      >
        <div>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Mengunggah & Mengekstrak..." : "Upload PDF"}
        </button>
      </form>

      {result && (
        <div className="mt-8">
          <h2 className="font-bold text-lg mb-2">Hasil dari Backend:</h2>
          <pre className="bg-slate-900 text-green-400 p-4 rounded-[8px] overflow-auto text-sm ">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
