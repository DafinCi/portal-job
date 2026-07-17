// src/features/resume/hooks/useResumeUpload.js
import { useState, useCallback } from "react";
import { resumeService } from "../services/resume.service";
import * as analysisService from "../../ai-analysis/services/analysis.service";

export const useResumeUpload = () => {
  const [step, setStep] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [resumeDate, setResumeDate] = useState(null);

  // Mengecek riwayat historis saat membuka halaman pertama kali
  const checkExistingResume = useCallback(async () => {
    try {
      setIsChecking(true);

      // 🔥 PERBAIKAN 1: Gunakan fetchUserLatestAnalysis (tanpa parameter)
      const userLatest = await analysisService.fetchUserLatestAnalysis();

      if (userLatest && userLatest.id) {
        // 🔥 PERBAIKAN 2: Ambil data komplitnya menggunakan ID tersebut
        const fullData = await analysisService.fetchAnalysisData(userLatest.id);

        setAnalysisResult(fullData);
        setResumeDate(fullData.created_at); // Sekarang sudah ada datanya!
        setStep("success");
      } else {
        setStep("idle");
      }
    } catch (error) {
      console.error("Gagal verifikasi data historis:", error);
      setStep("idle");
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Alur linier berurutan (Upload -> AI Analyze Pipeline -> Render UI)
  const processResume = async (file) => {
    try {
      setErrorMsg("");

      // Langkah 1: Upload File & Parse Teks Dasar
      setStep("uploading");
      const uploadPromise = resumeService.uploadPdf(file);
      const [, uploadData] = await Promise.all([
        new Promise((resolve) => setTimeout(resolve, 1200)), // Nilai minimum visual delay
        uploadPromise,
      ]);

      // Langkah 2: Simulasi Layouting Teks (Teks asli sebenarnya sudah siap dari backend upload)
      setStep("extracting");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Langkah 3: Eksekusi deep AI Analysis & Matching secara internal di backend
      setStep("analyzing");
      const analysisData = await analysisService.startAnalysis(
        uploadData.resumeId,
        uploadData.rawText,
      );

      // Langkah 4: Penarikan data hasil komputasi final
      setStep("matching");
      const finalData = await analysisService.fetchAnalysisData(
        analysisData.analysisId,
      );
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Simpan data dengan struktur terpadu ke dalam state
      setAnalysisResult(finalData);
      setResumeDate(finalData.created_at);
      setStep("success");
    } catch (error) {
      console.error("Kesalahan Alur Pemrosesan:", error);
      setErrorMsg(error.message);
      setStep("error");
    }
  };

  const resetFlow = () => {
    setStep("idle");
    setErrorMsg("");
    setAnalysisResult(null);
    setResumeDate(null);
  };

  return {
    step,
    errorMsg,
    analysisResult,
    isChecking,
    resumeDate,
    processResume,
    checkExistingResume,
    resetFlow,
  };
};
