import { useState, useEffect, useCallback } from "react";

export const useProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async (signal) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/profile", { signal });

      if (!res.ok) {
        throw new Error("Gagal memuat profil karier Anda.");
      }

      const data = await res.json();
      setProfileData(data);
      setError(null);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("useProfile Error:", err);
        setError(err.message || "Gagal memuat profil.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchProfile(controller.signal);
    return () => controller.abort();
  }, [fetchProfile]);

  return {
    data: profileData,
    isLoading,
    error,
    refetch: () => fetchProfile(),
  };
};
