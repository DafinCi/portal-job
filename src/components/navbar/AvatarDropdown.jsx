"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"; // 🔥 IMPORT BARU
import { logout } from "@/services/Auth"; // 🔥 IMPORT BARU
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

export default function AvatarDropdown() {
  const router = useRouter(); // 🔥 INISIALISASI ROUTER
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 FUNGSI LOGOUT HANDLER
  async function handleLogout() {
    try {
      await logout();
      router.push("/login");
      router.refresh(); // Supaya middleware langsung proteksi halaman lagi
    } catch (err) {
      alert("Gagal keluar: " + err.message);
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-sm px-3 py-2 transition hover:bg-sidebar-accent"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
          EL
        </div>

        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 rounded-sm border border-border bg-card p-2 shadow-2xl z-50">
          <button className="flex w-full items-center gap-3 rounded-sm px-3 py-3 hover:bg-sidebar-accent">
            <User size={18} />
            Profile
          </button>

          <button className="flex w-full items-center gap-3 rounded-sm px-3 py-3 hover:bg-sidebar-accent">
            <Settings size={18} />
            Settings
          </button>

          <hr className="my-2 border-border" />

          {/* 🔥 SEKARANG TOMBOL INI MEMANGGIL FUNGSI LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-sm px-3 py-3 text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
