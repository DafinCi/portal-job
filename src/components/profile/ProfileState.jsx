"use client";

import { CardContent } from "@/components/ui/card";
const stats = [
  {
    title: "Resume",
    value: 1,
  },

  {
    title: "AI Matches",
    value: 28,
  },

  {
    title: "Applications",
    value: 12,
  },

  {
    title: "Saved Jobs",
    value: 8,
  },

];

export default function ProfileStats() {
  return (
    <section
      className="
      grid
      grid-cols-2
      gap-5
      lg:grid-cols-4
    "
    >
      {stats.map((item) => (
        <CardContent
          key={item.title}
          className="
          p-6
          text-center
        "
        >
          <h2 className="text-4xl font-bold">
            {item.value}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {item.title}
          </p>
        </CardContent>
      ))}
    </section>
  );
}