"use client";

import { CardContent, CardTitle } from "@/components/ui/card";
import {
    Brain,
    SearchCheck,
    BadgeCheck,
    Zap,
} from "lucide-react";

const features = [

    {
        title: "AI Resume Analysis",
        icon: Brain,
        desc: "Automatically extract skills and improve your CV."
    },

    {
        title: "Smart Job Matching",
        icon: SearchCheck,
        desc: "Find jobs that perfectly match your profile."
    },

    {
        title: "ATS Optimization",
        icon: BadgeCheck,
        desc: "Increase your chances of passing ATS systems."
    },

    {
        title: "Fast Processing",
        icon: Zap,
        desc: "AI completes resume analysis within seconds."
    }

];

export default function Features() {

    return (
        <CardContent>

            <h3 className="text-2xl font-bold text-white">
                Why Choose JobMatch AI?
            </h3>

            <p className="mt-2 text-slate-400">
                Everything you need to accelerate your career.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
                {features.map((item,index)=>{

                    const Icon=item.icon;
                    return(
                        <CardTitle
                            key={index}>

                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[8px] bg-blue-600">
                                <Icon className="text-white"/>
                            </div>

                            <h4 className="text-lg font-semibold text-white">
                                {item.title}
                            </h4>

                            <p className="mt-2 text-sm text-slate-400">
                                {item.desc}
                            </p>
                        </CardTitle>
                    )
                })}
            </div>
        </CardContent>
    )
}