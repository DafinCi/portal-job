"use client";

import {
  Code2,
  Database,
  BrainCircuit,
} from "lucide-react";
import { CardTitle } from "../ui/card";

const skills = [
  "React",
  "Next.js",
  "Tailwind CSS",
  "Supabase",
  "Node.js",
  "Express",
  "PostgreSQL",
  "Docker",
];

export default function SkillSection() {
  return (
    <section
      className="
      rounded-[8px]
      border
      border-sidebar-border
      bg-card
      p-8
    "
    >
      <div className="flex items-center gap-3">
        <BrainCircuit
          className="text-primary"
        />

        <h2 className="text-2xl font-bold">
          Top Skills
        </h2>
      </div>

      <p className="mt-2 text-muted-foreground">
        Technologies mastered based on AI Resume Analysis.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        {skills.map((skill) => (

          <div
            key={skill}
            className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-sidebar-border
            bg-secondary
            px-5
            py-3
            transition-all
            duration-300
            hover:border-primary
            hover:bg-primary/10
          ">
            <Code2
              size={16}
              className="text-primary"
            />
            {skill}
          </div>
        ))}
      </div>

      <CardTitle>
        <div className="flex items-center gap-3">
          <Database
            className="text-blue-500"
          />

          <h3 className="font-semibold">
            AI Insight
          </h3>
        </div>

        <p className="mt-3 text-sm text-muted-foreground leading-7">
          Based on your resume, Artificial Intelligence detects
          that your strongest expertise lies in

          <span className="font-semibold text-primary">
            {" "}Frontend Development{" "}
          </span>

          with modern JavaScript frameworks and responsive UI
          development.
        </p>
      </CardTitle>
    </section>
  );
}