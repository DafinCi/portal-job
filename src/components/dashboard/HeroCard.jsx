"use client";

import {
  ArrowRight,
  Briefcase,
  Upload,
} from "lucide-react";

export default function HeroCard() {
  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-slate-700
      bg-gradient-to-r
      from-blue-700
      via-indigo-700
      to-slate-900
      p-8
      shadow-xl
    "
    >
      <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative z-10 max-w-2xl">

        <span
          className="
          inline-flex
          rounded-full
          bg-white/10
          px-4
          py-2
          text-sm
          text-blue-200
        "
        >
          🚀 AI Powered Career Platform
        </span>

        <h2 className="mt-6 text-4xl font-bold leading-tight text-white">
          Find Your Dream Job
          <br />
          with Artificial Intelligence
        </h2>

        <p className="mt-5 max-w-xl text-slate-300">
          Upload your resume and let our AI analyze your skills,
          match you with the best opportunities, and improve your
          chances of getting hired.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">

          <button
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-white
              px-6
              py-3
              font-semibold
              text-slate-900
              transition-all
              duration-300
              hover:scale-105
            "
          >
            <Upload size={18} />

            Upload Resume
          </button>

          <button
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-white/20
              bg-white/10
              px-6
              py-3
              font-semibold
              text-white
              backdrop-blur-lg
              transition-all
              duration-300
              hover:bg-white/20
            "
          >
            <Briefcase size={18} />

            Browse Jobs

            <ArrowRight size={16} />
          </button>

        </div>

      </div>
    </div>
  );
}