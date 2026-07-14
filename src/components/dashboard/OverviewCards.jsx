"use client";

import { CardContent } from "@/components/ui/card";
import {
  BriefcaseBusiness,
  Building2,
  FileText,
  Sparkles,
} from "lucide-react";

const stats = [
  {
    title: "Available Jobs",
    value: "1,280",
    icon: BriefcaseBusiness,
    color: "bg-primary",
    growth: "+12%",
  },
  {
    title: "AI Match",
    value: "92%",
    icon: Sparkles,
    color: "bg-primary",
    growth: "+5%",
  },
  {
    title: "Resume Status",
    value: "Ready",
    icon: FileText,
    color: "bg-primary",
    growth: "Uploaded",
  },
  {
    title: "Companies",
    value: "50+",
    icon: Building2,
    color: "bg-primary",
    growth: "+8",
  },
];

export default function OverviewCards() {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((item, index) => {

        const Icon = item.icon;

        return (
          <CardContent
            key={index}
            className="
              group
              p-6
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-400">
                  {item.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-white">
                  {item.value}
                </h3>

              </div>

              <div
                className={`
                  ${item.color}
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-[8px]
                `}
              >
                <Icon
                  className="
                    text-white
                    transition-transform
                    duration-300
                    group-hover:rotate-6
                  "
                />
              </div>

            </div>

            <div className="mt-6">

              <span
                className="
                  rounded-full
                  bg-blue-500/15
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-blue-400
                "
              >
                {item.growth}
              </span>
            </div>
          </CardContent>
        );
      })}
    </div>
  );
}