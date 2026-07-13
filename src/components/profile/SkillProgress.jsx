"use client";

const skills = [

  {
    name: "React",
    value: 95,
  },

  {
    name: "Next.js",
    value: 90,
  },

  {
    name: "Tailwind CSS",
    value: 96,
  },

  {
    name: "Supabase",
    value: 82,
  },

  {
    name: "Node.js",
    value: 85,
  },

];

export default function SkillProgress() {
  return (
    <section className="rounded-2xl border border-sidebar-border bg-card p-8">
      <h2 className="text-2xl font-bold">
        Skill Level
      </h2>

      <p className="mt-2 text-muted-foreground">
        AI estimated proficiency.
      </p>

      <div className="mt-8 space-y-6">
        {skills.map((skill) => (

          <div key={skill.name}>
            <div className="mb-2 flex justify-between">
              <span className="font-medium">
                {skill.name}
              </span>

              <span className="text-primary">
                {skill.value}%
              </span>
            </div>

            <div className="h-3 rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{
                  width: `${skill.value}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}