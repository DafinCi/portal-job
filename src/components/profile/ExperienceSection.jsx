"use client";

import {
    BriefcaseBusiness,
    Calendar,
    MapPin,
} from "lucide-react";

const experiences = [
    {
        company: "PT Telkom Indonesia",
        position: "Frontend Developer Intern",
        period: "Jan 2025 - Apr 2025",
        location: "Jakarta",
        description:
            "Developed responsive dashboard using React, Tailwind CSS, and REST API.",
    },
    {
        company: "Freelance",
        position: "Web Developer",
        period: "2024 - Present",
        location: "Remote",
        description:
            "Built modern websites and dashboard systems for multiple clients.",
    },
];

export default function ExperienceSection() {
    return (
        <section className="rounded-[8px] border border-sidebar-border bg-card p-8">
            <div className="mb-8 flex items-center gap-3">
                <div className="rounded-[8px] bg-primary p-3 text-primary-foreground">
                    <BriefcaseBusiness size={22} />
                </div>

                <div>
                    <h2 className="text-2xl font-bold">
                        Experience
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Professional Journey
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {experiences.map((job, index) => (
                    <div
                        key={index}
                        className="
                        rounded-[8px]
                        border
                        border-sidebar-border
                        bg-secondary
                        p-6
                        transition
                        hover:border-primary
                        hover:-translate-y-1
                    "
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-semibold">
                                    {job.position}
                                </h3>

                                <p className="mt-2 text-primary">
                                    {job.company}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-5 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                {job.period}
                            </div>

                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                {job.location}
                            </div>
                        </div>

                        <p className="mt-6 leading-7 text-muted-foreground">
                            {job.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}