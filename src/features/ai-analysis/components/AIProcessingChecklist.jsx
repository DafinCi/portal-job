"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";

export default function AIProcessingChecklist({ currentStep }) {
  const steps = [
    {
      id: "uploading",
      title: "Uploading resume",
      description: "Storing your PDF securely in our cloud storage",
    },
    {
      id: "extracting",
      title: "Extracting text",
      description: "Parsing document layout and reading professional history",
    },
    {
      id: "analyzing",
      title: "Analyzing profile",
      description: "Identifying technical skills, soft skills, and experiences",
    },
    {
      id: "matching",
      title: "Matching career path",
      description: "Aligning your profile with market opportunities",
    },
  ];

  const getStepStatus = (stepId) => {
    const stepOrder = [
      "uploading",
      "extracting",
      "analyzing",
      "matching",
      "success",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);

    if (currentIndex > stepIndex) return "completed";
    if (currentIndex === stepIndex) return "active";
    return "pending";
  };

  // Menghitung persentase progres bar linear yang minimalis di bagian atas card
  const getProgressPercentage = () => {
    switch (currentStep) {
      case "uploading":
        return 25;
      case "extracting":
        return 50;
      case "analyzing":
        return 75;
      case "matching":
        return 90;
      case "success":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto border border-border bg-card rounded-[6px] overflow-hidden transition-all duration-200">
      <div className="w-full `h-0.75` bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      <div className="p-6">
        {/* Header - Sesuai Hierarki Typografi (Card Title: 20px) */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-1.5 rounded-[6px] bg-primary/10 text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-[20px] font-semibold font-heading text-foreground tracking-tight">
            AI Career Analysis
          </h3>
        </div>

        {/* List Langkah */}
        <div className="space-y-6">
          {steps.map((step) => {
            const status = getStepStatus(step.id);

            return (
              <div
                key={step.id}
                className={`flex gap-4 transition-all duration-200 ${
                  status === "pending" ? "opacity-40" : "opacity-100"
                }`}
              >
                {/* Indikator Status Kiri (Custom Checklist) */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-6 h-6 rounded-[6px] flex items-center justify-center border text-[12px] font-medium
                      transition-all duration-200 ease-in-out
                      ${
                        status === "completed"
                          ? "bg-primary border-primary text-primary-foreground"
                          : status === "active"
                            ? "border-primary text-primary bg-primary/10 animate-pulse"
                            : "border-border text-muted-foreground"
                      }
                    `}
                  >
                    {status === "completed" ? (
                      <Check className="w-3.5 h-3.5 stroke-3" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    )}
                  </div>
                </div>

                {/* Teks Deskripsi (Body: 16px, Caption: 14px) */}
                <div className="flex flex-col">
                  <span
                    className={`text-[16px] font-medium transition-colors duration-200 ${
                      status === "active" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-[14px] text-muted-foreground mt-0.5 leading-relaxed">
                    {step.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
