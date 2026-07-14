"use client";

import {
  FileText,
  Download,
  Eye,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function ResumeCard() {
  return (
    <section className="rounded-[8px] border border-sidebar-border bg-card p-8">
      <div className="flex items-center gap-3">
        <div className="rounded-[8px] bg-primary p-3 text-primary-foreground">
          <FileText size={22} />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Latest Resume
          </h2>

          <p className="text-sm text-muted-foreground">
            Your newest uploaded resume
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-[8px] border border-sidebar-border bg-secondary p-6">
        <h3 className="font-semibold text-lg">
          Resume_JohnDoe.pdf
        </h3>

        <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            Uploaded 3 days ago
          </div>

          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle2 size={16} />
            ATS Score 91%
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button className="flex items-center gap-2 rounded-[8px] bg-primary px-5 py-3 text-primary-foreground transition hover:opacity-90">
            <Eye size={18} />
            Preview
          </button>

          <button className="flex items-center gap-2 rounded-[8px] border border-sidebar-border px-5 py-3 transition hover:bg-secondary">
            <Download size={18} />
            Download
          </button>
        </div>
      </div>
    </section>
  );
}