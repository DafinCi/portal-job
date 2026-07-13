"use client";

import {
  BriefcaseBusiness,
  Building2,
  MapPin,
} from "lucide-react";

const jobs = [

  {

    company:"Google",

    title:"Frontend Engineer",

    location:"Singapore",

    score:96

  },

  {

    company:"Tokopedia",

    title:"UI Engineer",

    location:"Jakarta",

    score:92

  },

  {

    company:"Traveloka",

    title:"React Developer",

    location:"Remote",

    score:89

  }

];

export default function SavedJobs(){

    return(

        <section className="rounded-2xl border border-sidebar-border bg-card p-8">
            <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary p-3 text-primary-foreground">
                    <BriefcaseBusiness size={22}/>
                </div>

                <div>
                    <h2 className="text-2xl font-bold">
                        Saved Jobs
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Bookmarked opportunities
                    </p>
                </div>
            </div>

            <div className="mt-8 space-y-5">
                {jobs.map((job,index)=>(

                <div
                key={index}
                className="rounded-2xl border border-sidebar-border bg-secondary p-5 transition hover:border-primary"
                >

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">
                                {job.title}
                            </h3>

                            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 size={15}/>
                                {job.company}
                            </p>

                            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin size={15}/>
                                {job.location}
                            </p>
                        </div>

                    <div className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
                        {job.score}%
                    </div>

                    </div>
                </div>
            ))}
            </div>
        </section>
    )
}