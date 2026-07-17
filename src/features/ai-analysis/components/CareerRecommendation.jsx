"use client";

import React from "react";
import { ArrowRight, Target } from "lucide-react";

export default function CareerRecommendation({ jobMatches }) {
  if (!jobMatches || jobMatches.length === 0) return null;

  // Ekstrak judul pekerjaan dari job_matches, hapus duplikat, ambil top 3
  const predictedRoles = jobMatches
    .map((match) => match.jobs?.title)
    .filter(Boolean);
  const uniqueRoles = [...new Set(predictedRoles)].slice(0, 3);

  return (
    <section className="mt-8">
      <div className="border border-border bg-card rounded-[6px] overflow-hidden">
        {/* Top Section: Recommended Roles */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-4 text-foreground">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-[20px] font-semibold font-heading">
              Recommended Trajectories
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {uniqueRoles.map((role, idx) => (
              <div
                key={idx}
                className="px-4 py-2.5 rounded-[6px] bg-secondary/50 border border-border text-[14px] font-medium text-foreground"
              >
                {role}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Call to Action (Primary color applied gracefully) */}
        <div className="p-6 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-[16px] font-semibold font-heading text-foreground">
              {jobMatches.length} Highly Matched Roles Available
            </h4>
            <p className="text-[14px] text-muted-foreground font-sans mt-0.5">
              AI has found live opportunities aligning with your strengths.
            </p>
          </div>
          <button
            onClick={() => console.log("Navigate to Jobs")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 w-full sm:w-auto rounded-[6px] bg-primary text-primary-foreground font-medium text-[14px] hover:opacity-90 transition-opacity duration-200"
          >
            Review Opportunities
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
