"use client";

import {
  BrainCircuit,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export default function AIInsight() {

  return (
    <section
      className="
      rounded-2xl
      border
      border-sidebar-border
      bg-gradient-to-br
      from-primary/15
      to-card
      p-8
    "
    >
      <div className="flex items-center gap-3">
        <BrainCircuit
          className="text-primary"
          size={28}
        />

        <div>
          <h2 className="text-2xl font-bold">
            AI Career Insight
          </h2>

          <p className="text-muted-foreground">
            Generated from your resume
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles
              className="text-yellow-400"
              size={18}
            />
            Career Strength
          </h3>

          <p className="mt-2 text-muted-foreground leading-7">
            You demonstrate excellent ability in
            Frontend Development with strong UI
            implementation and responsive design.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Recommended Career
          </h3>

          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
              Frontend Engineer
            </span>

            <span className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
              UI Engineer
            </span>

            <span className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
              Fullstack Developer
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">
            Missing Skills
          </h3>

          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full border border-red-500 px-4 py-2 text-sm">
              Docker
            </span>

            <span className="rounded-full border border-red-500 px-4 py-2 text-sm">
              AWS
            </span>

            <span className="rounded-full border border-red-500 px-4 py-2 text-sm">
              GraphQL
            </span>
          </div>
        </div>

        <div
          className="
          rounded-xl
          border
          border-primary
          bg-card
          p-5
        "
        >
          <div className="flex items-center gap-2">
            <ArrowUpRight
              className="text-primary"
            />

            <h4 className="font-semibold">
              AI Recommendation
            </h4>
          </div>

          <p className="mt-3 leading-7 text-muted-foreground">
            Learning Docker and AWS can increase your
            average job matching score by approximately
            <span className="font-semibold text-primary">
              {" "}12%
            </span>
            .
          </p>
        </div>
      </div>
    </section>
  );
}