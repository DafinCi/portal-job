"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export const useDashboard = () => {
  const [metricsData, setMetricsData] = useState(null);
  const [insightData, setInsightData] = useState(null);

  const [isMetricsLoading, setIsMetricsLoading] = useState(true);
  const [isInsightLoading, setIsInsightLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 PERBAIKAN: State untuk mengunci tombol (cooldown) dalam detik
  const [cooldown, setCooldown] = useState(0);

  const pollingTimerRef = useRef(null);
  const metricsDataRef = useRef(null);
  const insightDataRef = useRef(null);

  useEffect(() => {
    metricsDataRef.current = metricsData;
  }, [metricsData]);

  useEffect(() => {
    insightDataRef.current = insightData;
  }, [insightData]);

  // --- Efek untuk menjalankan Timer Cooldown ---
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const fetchMetrics = useCallback(async (signal) => {
    // ... (kode fetchMetrics TETAP SAMA seperti sebelumnya) ...
    try {
      setIsMetricsLoading(!metricsDataRef.current);
      const res = await fetch(`/api/dashboard/metrics?t=${Date.now()}`, {
        signal,
      });
      if (!res.ok) throw new Error("Gagal mengambil metrik dashboard.");
      const json = await res.json();
      if (!signal?.aborted) {
        setMetricsData(json);
        setError(null);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("fetchMetrics Error:", err);
        if (!signal?.aborted) setError(err.message || "Gagal memuat dashboard");
      }
    } finally {
      if (!signal?.aborted) setIsMetricsLoading(false);
    }
  }, []);

  const fetchInsight = useCallback(async (signal, force = false) => {
    // ... (kode fetchInsight TETAP SAMA seperti sebelumnya) ...
    try {
      setIsInsightLoading(!insightDataRef.current);
      const baseUrl = force
        ? "/api/dashboard/insight?force=true"
        : "/api/dashboard/insight";
      const res = await fetch(`${baseUrl}${force ? "&" : "?"}t=${Date.now()}`, {
        signal,
      });
      if (!res.ok) throw new Error("Gagal mengambil analisis AI.");
      const json = await res.json();
      if (!signal?.aborted) setInsightData(json);
    } catch (err) {
      if (err.name !== "AbortError") console.error("fetchInsight Error:", err);
    } finally {
      if (!signal?.aborted) setIsInsightLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchMetrics(controller.signal);
    fetchInsight(controller.signal, false);
    return () => controller.abort();
  }, [fetchMetrics, fetchInsight]);

  useEffect(() => {
    const isProcessing =
      metricsData?.hasResume && metricsData?.resumeStatus === "processing";
    if (isProcessing) {
      pollingTimerRef.current = setTimeout(() => {
        const controller = new AbortController();
        fetchMetrics(controller.signal);
        fetchInsight(controller.signal, false);
      }, 5000);
    }
    return () => clearTimeout(pollingTimerRef.current);
  }, [
    metricsData?.hasResume,
    metricsData?.resumeStatus,
    fetchMetrics,
    fetchInsight,
  ]);

  // 🔥 PERBAIKAN: Cek cooldown sebelum refresh, dan set cooldown setelahnya
  const handleRefresh = useCallback(async () => {
    if (cooldown > 0) return; // Cegah eksekusi jika masih cooldown

    setIsRefreshing(true);
    const controller = new AbortController();

    await Promise.all([
      fetchMetrics(controller.signal),
      fetchInsight(controller.signal, true),
    ]);

    setIsRefreshing(false);
    setCooldown(60); // Set kunci tombol selama 60 detik (Sesuai Retry-After dari Gemini)
  }, [fetchMetrics, fetchInsight, cooldown]);

  return {
    hasResume: metricsData?.hasResume ?? false,
    resumeStatus: metricsData?.resumeStatus ?? null,
    metrics: metricsData?.metrics ?? null,
    insight: insightData ?? null,
    isMetricsLoading,
    isInsightLoading,
    isRefreshing,
    cooldown,
    isLoading: isMetricsLoading && isInsightLoading,
    error,
    refresh: handleRefresh,
  };
};
