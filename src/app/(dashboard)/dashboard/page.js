import DashboardHeader from "@/components/dashboard/DashboardHeader";
import HeroCard from "@/components/dashboard/HeroCard";
import OverviewCards from "@/components/dashboard/OverviewCards";
import ResumeStatus from "@/components/dashboard/ResumeStatus";
import AIRecommendation from "@/components/dashboard/AIRecomendation";
import Features from "@/components/dashboard/Features";

export default function DashboardPage() {
  return (
    <div className="space-y-8 m-8">
      <DashboardHeader />
      <HeroCard />
      <OverviewCards />

            <div className="grid gap-8 lg:grid-cols-2">
        <ResumeStatus />
        <AIRecommendation />
        </div>

        <Features />
      </div>
  );
}