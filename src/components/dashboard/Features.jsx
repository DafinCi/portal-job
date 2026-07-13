"use client";

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

        <div
            className="
            rounded-2xl
            border
            border-slate-700
            bg-slate-900
            p-6
        "
        >

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

                        <div
                            key={index}
                            className="
                            group
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-800
                            p-5
                            transition
                            hover:border-blue-500
                            hover:-translate-y-1
                        "
                        >

                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">

                                <Icon className="text-white"/>

                            </div>

                            <h4 className="text-lg font-semibold text-white">

                                {item.title}

                            </h4>

                            <p className="mt-2 text-sm text-slate-400">

                                {item.desc}

                            </p>

                        </div>

                    )

                })}

            </div>

        </div>

    )

}