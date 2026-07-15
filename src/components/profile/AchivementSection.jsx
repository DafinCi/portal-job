"use client";

import {
  Trophy,
  Medal,
  Award,
  BadgeCheck,
  Calendar,
} from "lucide-react";

const achievements = [
  {
    title: "1st Place Web Design Competition",
    organizer: "National IT Competition",
    year: "2025",
    icon: Trophy,
    color: "text-yellow-400",
  },
  {
    title: "Hackathon Finalist",
    organizer: "TechFest Indonesia",
    year: "2024",
    icon: Medal,
    color: "text-blue-400",
  },
  {
    title: "AWS Cloud Practitioner",
    organizer: "Amazon Web Services",
    year: "2025",
    icon: Award,
    color: "text-orange-400",
  },
  {
    title: "React Developer Certificate",
    organizer: "Dicoding",
    year: "2024",
    icon: BadgeCheck,
    color: "text-green-400",
  },
];

export default function AchievementSection() {
  return (
    <section className="rounded-[8px] border border-sidebar-border bg-card p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-[8px] bg-primary p-3 text-primary-foreground">
          <Trophy size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">
            Achievements
          </h2>
          <p className="text-sm text-muted-foreground">
            Awards & Certifications
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {achievements.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="
                flex
                items-center
                justify-between
                rounded-[8px]
                border
                border-sidebar-border
                bg-secondary
                p-5
                transition
                hover:border-primary
              "
            >

              <div className="flex items-center gap-4">

                <div className="rounded-[8px] bg-card p-3">
                  <Icon className={item.color} size={24} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.organizer}
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                {item.year}
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}