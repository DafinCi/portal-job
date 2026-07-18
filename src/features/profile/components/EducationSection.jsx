"use client";

import { GraduationCap, Calendar, School, Award } from "lucide-react";
import { CardTitle } from "../../../components/ui/card";

const education = [
  {
    school: "Universitas Negeri Jakarta",
    major: "Bachelor of Informatics",
    year: "2023 - Present",
    gpa: "3.85 / 4.00",
  },
  {
    school: "SMK Negeri 4 Jakarta",
    major: "Software Engineering",
    year: "2020 - 2023",
    gpa: "Graduated",
  },
];

export default function EducationSection() {
  return (
    <section className="rounded-[6px] border border-sidebar-border bg-card/50 p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-[6px] bg-primary p-3 text-primary-foreground">
          <GraduationCap size={22} />
        </div>

        <div>
          <h2 className="text-2xl font-bold">Education</h2>

          <p className="text-sm text-muted-foreground">Academic Background</p>
        </div>
      </div>

      <div className="space-y-8">
        {education.map((item, index) => (
          <div key={index} className="relative border-l-2 border-primary pl-8">
            <span
              className="
                            absolute
                            -left-[9px]
                            top-2
                            h-4
                            w-4
                            rounded-full
                            bg-primary
                        "
            />
            <CardTitle
              className="
                            rounded-[6px]
                            border
                            border-sidebar-border
                            bg-secondary
                            p-6
                            transition-all
                            duration-300
                            hover:border-primary
                        "
            >
              <div className="flex items-center gap-3">
                <School className="text-primary" />
                <h3 className="text-lg font-semibold">{item.school}</h3>
              </div>

              <p className="mt-3 text-muted-foreground">{item.major}</p>

              <div className="mt-5 flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} />
                  {item.year}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Award size={16} />
                  {item.gpa}
                </div>
              </div>
            </CardTitle>
          </div>
        ))}
      </div>
    </section>
  );
}
