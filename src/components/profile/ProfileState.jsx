"use client";

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
        <div
          key={item.title}
          className="
          rounded-2xl
          border
          border-sidebar-border
          bg-card
          p-6
          text-center
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-primary
        "
        >
          <h2 className="text-4xl font-bold">
            {item.value}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {item.title}
          </p>
        </div>
      ))}
    </section>
  );
}