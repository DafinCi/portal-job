"use client";

import {
    ArrowRight,
    BriefcaseBusiness,
    MapPin,
    Sparkles,
} from "lucide-react";

export default function AIRecommendation() {

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

            <div className="flex items-center gap-3">

                <div className="rounded-xl bg-violet-600 p-3">

                    <Sparkles className="text-white"/>

                </div>

                <div>

                    <h3 className="text-xl font-semibold text-white">

                        AI Recommendation

                    </h3>

                    <p className="text-slate-400 text-sm">

                        Best Match For You

                    </p>

                </div>

            </div>

            <div className="mt-8 rounded-xl bg-slate-800 p-5">

                <div className="flex items-center justify-between">

                    <div>

                        <h4 className="text-xl font-bold text-white">

                            Frontend Developer

                        </h4>

                        <p className="mt-2 flex items-center gap-2 text-slate-400">

                            <BriefcaseBusiness size={16}/>

                            PT. OpenAI Indonesia

                        </p>

                        <p className="mt-1 flex items-center gap-2 text-slate-400">

                            <MapPin size={16}/>

                            Jakarta • Remote

                        </p>

                    </div>

                    <div className="text-right">

                        <div className="text-3xl font-bold text-green-400">

                            92%

                        </div>

                        <span className="text-xs text-slate-400">

                            Match Score

                        </span>

                    </div>

                </div>

                <div className="mt-6">

                    <p className="text-sm text-slate-400">

                        Missing Skills

                    </p>

                    <div className="mt-2 flex gap-2">

                        <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-400">

                            Docker

                        </span>

                        <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-400">

                            AWS

                        </span>

                    </div>

                </div>

                <button
                    className="
                    mt-6
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-5
                    py-3
                    text-white
                    transition
                    hover:bg-blue-700
                "
                >

                    View Job

                    <ArrowRight size={18}/>

                </button>

            </div>

        </div>

    );

}