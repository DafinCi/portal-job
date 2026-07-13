import ProfileHero from "@/components/profile/ProfileHero";
import ProfileStats from "@/components/profile/ProfileState";
import SkillSection from "@/components/profile/SkillSection";
import EducationSection from "@/components/profile/EducationSection";
import ExperienceSection from "@/components/profile/ExperienceSection";
import AchievementSection from "@/components/profile/AchivementSection";
import SkillProgress from "@/components/profile/SkillProgress";
import AIInsight from "@/components/profile/AIInsight";
import ResumeCard from "@/components/profile/ResumeCard";
import SavedJobs from "@/components/profile/SavedJobs";
import ActivityTimeline from "@/components/profile/ActivityTimeline";

export default function ProfilePage() {
  return (
    <main className="space-y-8">
        <ProfileHero />
        <div className="m-6 space-y-6">
          <ProfileStats />
          <SkillSection />
          <div className="grid gap-8 xl:grid-cols-2">
              <EducationSection />
              <ExperienceSection />
          </div>
          <div className="grid gap-8 xl:grid-cols-2">
              <AchievementSection />
              <SkillProgress />
          </div>
          <AIInsight />
          <div className="grid gap-8 xl:grid-cols-2">
              <ResumeCard />
              <SavedJobs />
          </div>
          <ActivityTimeline />
        </div>
    </main>
  );
}