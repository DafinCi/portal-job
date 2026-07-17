"use client";

import React from "react";
import { BrainCircuit, Briefcase, CheckCircle2 } from "lucide-react";

export default function CandidateOverview({
  careerLevel,
  skillsCount,
  jobsCount,
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* System Status */}
      <div className="flex items-center gap-3 p-4 border border-border bg-card rounded-[6px]">
        <div className="p-1.5 bg-primary/10 text-primary rounded-md">
          <BrainCircuit className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-[14px] font-medium text-foreground">
            Candidate Intelligence Mapped
          </h4>
          <p className="text-[12px] text-muted-foreground mt-0.5 font-sans">
            AI extracted {skillsCount} core skills and identified {jobsCount}{" "}
            career opportunities.
          </p>
        </div>
      </div>

      {/* Header Info */}
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-[24px] font-semibold font-heading text-foreground">
            Professional Profile
          </h2>
          <p className="text-[16px] text-muted-foreground mt-1 font-sans">
            A comprehensive breakdown of your professional trajectory.
          </p>
        </div>

        {/* Career Level Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-[6px] border border-border bg-secondary/50 text-foreground">
          <Briefcase className="w-4 h-4 text-muted-foreground" />
          <span className="text-[14px] font-medium">
            {careerLevel || "Professional"}
          </span>
        </div>
      </div>
    </div>
  );
}
