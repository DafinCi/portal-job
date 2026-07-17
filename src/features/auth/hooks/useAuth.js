"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { logout } from "../services/auth.service";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Ambil session user saat pertama kali mount
    const initializeAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        console.error("Auth initialization failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Dengarkan perubahan state auth secara real-time (login/logout di tab lain)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Logout execution failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Ekstrak inisial nama dari email untuk kebutuhan fallback Avatar
  const getInitials = () => {
    if (!user?.email) return "??";
    return user.email.slice(0, 2).toUpperCase();
  };

  return {
    user,
    loading,
    handleLogout,
    initials: getInitials(),
  };
}
