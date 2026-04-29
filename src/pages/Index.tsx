import { useEffect, useState } from "react";
import { Home, Wind, BookHeart, Users, User, Sparkles } from "lucide-react";
import logo from "@/assets/serenmind-logo.png";
import HomeScreen from "@/components/screens/HomeScreen";
import BreatheScreen from "@/components/screens/BreatheScreen";
import JournalScreen from "@/components/screens/JournalScreen";
import CommunityScreen from "@/components/screens/CommunityScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import OnboardingScreen from "@/components/screens/OnboardingScreen";
import DoctorsScreen from "@/components/screens/DoctorsScreen";
import MusicScreen from "@/components/screens/MusicScreen";
import AICompanionScreen from "@/components/screens/AICompanionScreen";
import DashboardScreen from "@/components/screens/DashboardScreen";
import QuestsScreen from "@/components/screens/QuestsScreen";
import { api, useApi } from "@/lib/fakeApi";

export type Tab =
  | "home" | "breathe" | "journal" | "community" | "profile"
  | "ai" | "doctors" | "music" | "dashboard" | "quests";

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "ai", label: "Sere AI", icon: Sparkles },
  { id: "breathe", label: "Breathe", icon: Wind },
  { id: "community", label: "Circle", icon: Users },
  { id: "profile", label: "Me", icon: User },
];

const Index = () => {
  const [active, setActive] = useState<Tab>("home");
  const user = useApi(() => api.getUser());
  // Re-render when theme changes
  useApi(() => api.getTheme());
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-hero">
        <img src={logo} alt="" className="w-24 h-24 animate-breathe" />
      </div>
    );
  }

  if (!user) return <OnboardingScreen logo={logo} />;

  return (
    <div className="min-h-screen w-full flex justify-center bg-gradient-to-b from-secondary/40 to-background">
      <div className="relative w-full max-w-[440px] min-h-screen bg-background shadow-soft md:my-6 md:rounded-[2.5rem] md:min-h-[860px] md:max-h-[860px] md:overflow-hidden md:border md:border-border flex flex-col">
        <div className="hidden md:flex justify-between items-center px-8 pt-4 pb-1 text-xs font-medium text-foreground/70">
          <span>9:41</span>
          <span>SerenMind</span>
          <span>100%</span>
        </div>

        <main className="flex-1 overflow-y-auto pb-24">
          {active === "home" && <HomeScreen onNavigate={setActive} logo={logo} />}
          {active === "breathe" && <BreatheScreen />}
          {active === "journal" && <JournalScreen />}
          {active === "community" && <CommunityScreen />}
          {active === "profile" && <ProfileScreen logo={logo} />}
          {active === "ai" && <AICompanionScreen />}
          {active === "doctors" && <DoctorsScreen />}
          {active === "music" && <MusicScreen />}
          {active === "dashboard" && <DashboardScreen />}
          {active === "quests" && <QuestsScreen />}
        </main>

        <nav className="absolute bottom-0 left-0 right-0 glass border-t border-border/60 px-2 pt-2 pb-3 md:rounded-b-[2.5rem]">
          <ul className="flex justify-around items-center">
            {tabs.map(({ id, label, icon: Icon }) => {
              const isActive = active === id;
              return (
                <li key={id}>
                  <button
                    onClick={() => setActive(id)}
                    className="flex flex-col items-center gap-1 px-3 py-1.5 transition-bounce"
                    aria-label={label}
                  >
                    <span className={`flex items-center justify-center rounded-2xl transition-smooth ${
                      isActive ? "gradient-primary text-primary-foreground w-12 h-10 shadow-glow" : "w-10 h-10 text-muted-foreground"
                    }`}>
                      <Icon className="w-5 h-5" strokeWidth={2.2} />
                    </span>
                    <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Index;
