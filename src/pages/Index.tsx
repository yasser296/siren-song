import { useState } from "react";
import { Home, Wind, BookHeart, Users, User } from "lucide-react";
import logo from "@/assets/serenmind-logo.png";
import HomeScreen from "@/components/screens/HomeScreen";
import BreatheScreen from "@/components/screens/BreatheScreen";
import JournalScreen from "@/components/screens/JournalScreen";
import CommunityScreen from "@/components/screens/CommunityScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import OnboardingScreen from "@/components/screens/OnboardingScreen";

type Tab = "home" | "breathe" | "journal" | "community" | "profile";

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "breathe", label: "Breathe", icon: Wind },
  { id: "journal", label: "Journal", icon: BookHeart },
  { id: "community", label: "Circle", icon: Users },
  { id: "profile", label: "Profile", icon: User },
];

const Index = () => {
  const [active, setActive] = useState<Tab>("home");
  const [onboarded, setOnboarded] = useState(false);

  if (!onboarded) {
    return <OnboardingScreen onDone={() => setOnboarded(true)} logo={logo} />;
  }

  return (
    <div className="min-h-screen w-full flex justify-center bg-gradient-to-b from-secondary/40 to-background">
      {/* Phone frame on desktop, fullscreen on mobile */}
      <div className="relative w-full max-w-[440px] min-h-screen bg-background shadow-soft md:my-6 md:rounded-[2.5rem] md:min-h-[860px] md:max-h-[860px] md:overflow-hidden md:border md:border-border flex flex-col">
        {/* Status bar mock (desktop only) */}
        <div className="hidden md:flex justify-between items-center px-8 pt-4 pb-1 text-xs font-medium text-foreground/70">
          <span>9:41</span>
          <span>SerenMind</span>
          <span>100%</span>
        </div>

        {/* Screen content */}
        <main className="flex-1 overflow-y-auto pb-24">
          {active === "home" && <HomeScreen onNavigate={setActive} logo={logo} />}
          {active === "breathe" && <BreatheScreen />}
          {active === "journal" && <JournalScreen />}
          {active === "community" && <CommunityScreen />}
          {active === "profile" && <ProfileScreen logo={logo} />}
        </main>

        {/* Bottom tab bar */}
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
                    <span
                      className={`flex items-center justify-center rounded-2xl transition-smooth ${
                        isActive
                          ? "gradient-primary text-primary-foreground w-12 h-10 shadow-glow"
                          : "w-10 h-10 text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={2.2} />
                    </span>
                    <span
                      className={`text-[10px] font-medium ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {label}
                    </span>
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
