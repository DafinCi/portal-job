"use client";

import {
    Clock3,
    Upload,
    Sparkles,
    Send,
    CheckCircle2
} from "lucide-react";

const activities=[
    {
    icon:Upload,
    title:"Resume Uploaded",
    time:"3 days ago"
    },
    {
    icon:Sparkles,
    title:"AI Analysis Completed",
    time:"3 days ago"
    },
    {
    icon:CheckCircle2,
    title:"Matched with Frontend Engineer",
    time:"Yesterday"
    },
    {
    icon:Send,
    title:"Applied UI Developer",
    time:"Today"
    }
];
export default function ActivityTimeline(){
    return(
    <section className="rounded-2xl border border-sidebar-border bg-card p-8">
        <h2 className="text-2xl font-bold">
            Recent Activity
        </h2>
        <p className="mt-2 text-muted-foreground">
            Latest actions on JobMatch AI
        </p>

        <div className="mt-8 space-y-6">

        {activities.map((item,index)=>{
        const Icon=item.icon;
        return(

        <div
        key={index}
        className="flex items-start gap-5"
        >

            <div className="rounded-full bg-primary p-3 text-primary-foreground">
                <Icon size={18}/>
            </div>

            <div className="flex-1 border-b border-sidebar-border pb-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                        {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock3 size={15}/>
                        {item.time}
                    </div>
                </div>
            </div>

        </div>
        )
        })}

        </div>
    </section>
    )
}