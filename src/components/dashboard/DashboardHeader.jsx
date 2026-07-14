"use client";

import { Bell } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Hallo user!
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Welcome back! Here&apos;s an overview of your career journey.
        </p>
      </div>
    </div>
  );
}
