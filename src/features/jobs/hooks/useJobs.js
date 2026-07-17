"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { jobsApi } from "../services/jobs.api";
import { fetchUserLatestAnalysis } from "@/features/ai-analysis/services/analysis.service";

export const useJobs = (analysisId = null) => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMatchLevel, setSelectedMatchLevel] = useState("all"); // all, excellent, strong, good, potential
  const [selectedExperience, setSelectedExperience] = useState("all"); // all, junior, mid, senior
  const [selectedLocation, setSelectedLocation] = useState("all"); // all, locations

  const fetchMatches = useCallback(async (id, signal) => {
    try {
      // 1. SHALLOW STATE BAIL-OUT: Hanya update state jika nilai barunya berbeda.
      // Ini mencegah render berantai (cascading renders) yang dilarang React.
      setIsLoading((prev) => (prev === false ? true : prev));
      setError((prev) => (prev !== null ? null : prev));

      let activeAnalysisId = id;

      // Jika tidak dipasok analysisId secara eksplisit, fetch dari resume terakhir
      if (!activeAnalysisId) {
        const latestAnalysis = await fetchUserLatestAnalysis();
        if (latestAnalysis) {
          activeAnalysisId = latestAnalysis.id;
        }
      }

      // Hentikan eksekusi jika proses dibatalkan
      if (signal?.aborted) return;

      if (activeAnalysisId) {
        const data = await jobsApi.getJobMatches(activeAnalysisId);
        if (!signal?.aborted) {
          setMatches(data);
        }
      } else {
        if (!signal?.aborted) {
          setMatches([]);
        }
      }
    } catch (err) {
      console.error("useJobs Fetch Error:", err);
      if (!signal?.aborted) {
        setError(err.message || "Gagal memuat rekomendasi lowongan kerja.");
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // 2. ABORT CONTROLLER: Membatalkan proses fetch lama jika dependencies berubah atau unmount
    const controller = new AbortController();

    fetchMatches(analysisId, controller.signal);

    return () => {
      controller.abort();
    };
  }, [analysisId, fetchMatches]);

  // Ekstrak lokasi unik untuk dropdown filter
  const uniqueLocations = useMemo(() => {
    const locs = matches.map((m) => m.location).filter(Boolean);
    return ["all", ...new Set(locs)];
  }, [matches]);

  // Logic filtering data klien
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      // 1. Search (Title atau Company Name)
      const matchesSearch =
        searchQuery === "" ||
        match.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.companyName?.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Match Level Thresholds
      let matchesLevel = true;
      if (selectedMatchLevel !== "all") {
        const score = match.matchScore;
        if (selectedMatchLevel === "excellent") matchesLevel = score >= 90;
        else if (selectedMatchLevel === "strong")
          matchesLevel = score >= 75 && score < 90;
        else if (selectedMatchLevel === "good")
          matchesLevel = score >= 60 && score < 75;
        else if (selectedMatchLevel === "potential") matchesLevel = score < 60;
      }

      // 3. Experience Level
      const matchesExperience =
        selectedExperience === "all" ||
        match.experienceLevel?.toLowerCase() ===
          selectedExperience.toLowerCase();

      // 4. Location
      const matchesLocation =
        selectedLocation === "all" || match.location === selectedLocation;

      return (
        matchesSearch && matchesLevel && matchesExperience && matchesLocation
      );
    });
  }, [
    matches,
    searchQuery,
    selectedMatchLevel,
    selectedExperience,
    selectedLocation,
  ]);

  // Statistik ringkasan pencarian
  const stats = useMemo(() => {
    if (matches.length === 0) return { count: 0, highest: 0, average: 0 };
    const scores = matches.map((m) => m.matchScore);
    const highest = Math.max(...scores);
    const average = Math.round(
      scores.reduce((a, b) => a + b, 0) / matches.length,
    );
    return {
      count: matches.length,
      highest,
      average,
    };
  }, [matches]);

  const handleRefresh = useCallback(() => {
    const controller = new AbortController();
    fetchMatches(analysisId, controller.signal);
  }, [analysisId, fetchMatches]);

  return {
    matches: filteredMatches,
    allMatches: matches,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedMatchLevel,
    setSelectedMatchLevel,
    selectedExperience,
    setSelectedExperience,
    selectedLocation,
    setSelectedLocation,
    uniqueLocations,
    stats,
    refresh: handleRefresh,
  };
};
