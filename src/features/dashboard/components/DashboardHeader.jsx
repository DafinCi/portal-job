import React from "react";

export default function DashboardHeader({ role }) {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60">
      <div>
        <p className="text-[14px] font-sans font-medium text-muted-foreground tracking-wide uppercase">
          Career Intelligence Dashboard
        </p>
        <h1 className="text-[36px] font-heading font-semibold text-foreground tracking-tight mt-1">
          Welcome back, Professional
        </h1>
      </div>
      <div className="text-left md:text-right">
        <span className="inline-block text-[14px] font-sans text-muted-foreground bg-secondary/40 border border-border/80 px-3 py-1 rounded-[6px]">
          {today}
        </span>
      </div>
    </div>
  );
}
