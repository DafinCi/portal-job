import {
    LayoutDashboard,
    BriefcaseBusiness,
    FileText,
    Target,
    User,
} from "lucide-react";

export const MenuItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Profile",
        href: "/profile",
        icon: User,
    },
    {
        title: "Jobs",
        href: "/jobs",
        icon: BriefcaseBusiness,
        badge: 12,
    },
    {
        title: "Resume CV",
        href: "/resume",
        icon: FileText,
    },
];