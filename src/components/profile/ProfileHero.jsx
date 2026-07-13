"use client";

import Image from "next/image";
import {
  MapPin,
  Mail,
  Pencil,
  Share2,
  BadgeCheck,
} from "lucide-react";

export default function ProfileHero() {
  return (
    <section className="overflow-hidden border border-sidebar-border bg-card">

      {/* Cover */}
      <div className="relative h-56 w-full bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      {/* Content */}
      <div className="relative px-10 pb-10">

        {/* Avatar */}
        <div className="-mt-20 flex flex-col items-center">
          <div className="relative">
            <Image
              src="/avatar.jpg"
              alt="Profile"
              width={180}
              height={180}
              className="size-44 rounded-full object-cover border-4 border-card shadow-2xl"
            />

            <span
              className="
              absolute
              bottom-2
              right-2
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-blue-600
              text-white
            "
            >
              <BadgeCheck size={18} />
            </span>
          </div>

          <h1 className="mt-6 flex items-center gap-2 text-3xl font-bold">
            John Doe
            <BadgeCheck
              size={22}
              className="text-blue-500"
            />

          </h1>

          <p className="mt-2 text-lg text-muted-foreground">
            Frontend Developer
          </p>

          <p className="mt-2 max-w-xl text-center text-sm text-muted-foreground">
            Passionate about creating modern web applications,
            UI/UX design, and Artificial Intelligence.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              Jakarta, Indonesia
            </div>

            <div className="flex items-center gap-2">
              <Mail size={16} />
              johndoe@gmail.com
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-primary
              px-5
              py-3
              text-primary-foreground
              transition
              hover:opacity-90
            "
            >
              <Pencil size={18} />
              Edit Profile
            </button>

            <button
              className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-sidebar-border
              bg-secondary
              px-5
              py-3
              transition
              hover:bg-accent
            "
            >
              <Share2 size={18} />
              Share Profile
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}