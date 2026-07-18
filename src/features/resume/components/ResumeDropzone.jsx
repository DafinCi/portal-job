"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, AlertCircle } from "lucide-react";

export default function ResumeDropzone({ onFileUpload, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateAndProcessFile = (file) => {
    setError("");

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Format tidak didukung. Harap unggah dokumen PDF.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Ukuran file terlalu besar. Maksimal 5 MB.");
      return;
    }

    // Jika aman, kirim file ke parent/hook
    onFileUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
    // Reset input agar user bisa pilih file yang sama lagi jika error
    e.target.value = "";
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center w-full p-10
          border border-dashed rounded-[6px] cursor-pointer
          transition-all duration-200 ease-in-out
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border bg-card/50 hover:bg-accent/50 hover:border-muted-foreground/50"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf, application/pdf"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={disabled}
        />

        {/* Ikon Transisi */}
        <div
          className={`p-3 rounded-[6px] mb-4 transition-colors duration-200 ease-in-out ${
            isDragging
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isDragging ? (
            <FileText className="w-6 h-6" />
          ) : (
            <UploadCloud className="w-6 h-6" />
          )}
        </div>

        {/* Tipografi Sesuai Hierarki */}
        <h3 className="text-[16px] font-medium text-foreground mb-1">
          Drag and drop or <span className="text-primary">Browse</span>
        </h3>
        <p className="text-[14px] text-muted-foreground">
          File PDF only • Maximum 5 MB
        </p>
      </div>

      {/* Error State (Muncul dengan animasi smooth) */}
      {error && (
        <div className="flex items-center gap-2 mt-3 text-[14px] text-destructive animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
