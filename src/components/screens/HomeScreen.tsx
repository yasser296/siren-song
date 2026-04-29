import { Wind, BookHeart, Users, Sparkles, Sun, Moon, Heart, Loader2, Stethoscope, Music2, BarChart3, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api, useApi, type Mood } from "@/lib/fakeApi";
import type { Tab } from "@/pages/Index";

interface Props {
  onNavigate: (tab: Tab) => void;
  logo: string;
}

const moodOptions: { value: Mood; emoji: string; label: string; color: string }[] = [
  { value: "great", emoji: "😄", label: "Great", color: "bg-calm/20 text-calm" },
  { value: "good", emoji: "🙂", label: "Good", color: "bg-primary/15 text-primary" },
  { value: "okay", emoji: "😐", label: "Okay", color: "bg-warm/20 text-warm-foreground" },
  { value: "low", emoji: "😟", label: "Low", color: "bg-accent text-accent-foreground" },
  { value: "stressed", emoji: "😣", label: "Stressed", color: "bg-destructive/15 text-destructive" },
];

const HomeScreen = ({ onNavigate, logo }: Props) => {
  const user = useApi(() => api.getUser());
  const todayMood = useApi(() => api.getTodayMood());
  const streak = useApi(() => api.getStreak());
  const todayMin = useApi(() => api.getTodayMinutes());
  const [savingMood, setSavingMood] = useState<Mood | null>(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const Icon = hour < 18 ? Sun : Moon;
  const firstName = user?.name.split(" ")[0] ?? "friend";

  const handleMood = async (m: Mood) => {
    setSavingMood(m);
    await api.logMood(m);
    setSavingMood(null);
    toast.success(`Mood logged: ${m}`);
  };

  return (
    <div className="px-5 pt-6 pb-4 space-y-6 animate-fade-up">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5" /> {greeting}
          </p>
          <h1 className="text-2xl font-bold text-foreground">Hi, {firstName} 👋</h1>
        </div>
        <button onClick={() => onNavigate("profile")} className="w-11 h-11 rounded-2xl gradient-primary p-1.5 shadow-soft">
          <img src={logo} alt="Profile" className="w-full h-full object-contain" />
        </button>
      </header>

      <section className="relative overflow-hidden rounded-3xl gradient-hero p-5 text-primary-foreground shadow-glow">
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/15 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium opacity-90">Today&apos;s intention</span>
          </div>
          <p className="text-lg font-semibold leading-snug mb-4">
            &ldquo;Peace begins with a single, calm breath.&rdquo;
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> {streak} day streak</span>
            <span className="opacity-80">{todayMin} / 20 min today</span>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">
            {todayMood ? "Updated today's mood" : "How are you feeling?"}
          </h2>
          <button onClick={() => onNavigate("journal")} className="text-xs text-primary font-medium">View journal</button>
        </div>
        <div className="flex justify-between gap-2">
          {moodOptions.map((m) => {
            const selected = todayMood === m.value;
            return (
              <button
                key={m.value}
                onClick={() => handleMood(m.value)}
                disabled={savingMood !== null}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl ${m.color} transition-bounce hover:scale-105 active:scale-95 ${selected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
              >
                {savingMood === m.value ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span className="text-2xl">{m.emoji}</span>
                )}
                <span className="text-[10px] font-medium">{m.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-foreground mb-3">Quick relief</h2>
        <div className="grid grid-cols-2 gap-3">
          <ActionCard onClick={() => onNavigate("breathe")} title="Breathe" subtitle="2 min reset" gradient="gradient-mint" icon={Wind} />
          <ActionCard onClick={() => onNavigate("journal")} title="Journal" subtitle="Reflect now" gradient="gradient-warm" icon={BookHeart} />
          <ActionCard onClick={() => onNavigate("community")} title="Circle" subtitle="Talk anonymously" gradient="gradient-primary" icon={Users} />
          <ActionCard onClick={() => onNavigate("breathe")} title="Focus" subtitle="25 min sounds" gradient="bg-accent" icon={Sparkles} dark />
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-foreground mb-3">For you</h2>
        <div className="space-y-3">
          <ProgramCard onClick={() => onNavigate("breathe")} title="Exam stress relief" duration="5 min · Guided" tag="Students" />
          <ProgramCard onClick={() => onNavigate("breathe")} title="After-work decompress" duration="8 min · Audio" tag="Professionals" />
          <ProgramCard onClick={() => onNavigate("breathe")} title="Sleep wind-down" duration="12 min · Sounds" tag="Tonight" />
        </div>
      </section>
    </div>
  );
};

const ActionCard = ({
  title, subtitle, gradient, icon: Icon, onClick, dark,
}: { title: string; subtitle: string; gradient: string; icon: typeof Wind; onClick: () => void; dark?: boolean }) => (
  <button onClick={onClick}
    className={`${gradient} relative overflow-hidden rounded-3xl p-4 text-left aspect-square shadow-card transition-bounce hover:scale-[1.03] active:scale-95 ${dark ? "text-accent-foreground" : "text-primary-foreground"}`}>
    <Icon className="w-7 h-7 mb-auto" strokeWidth={2.2} />
    <div className="mt-8">
      <p className="text-lg font-semibold leading-tight">{title}</p>
      <p className="text-xs opacity-85 mt-0.5">{subtitle}</p>
    </div>
  </button>
);

const ProgramCard = ({ title, duration, tag, onClick }: { title: string; duration: string; tag: string; onClick: () => void }) => (
  <button onClick={onClick} className="w-full bg-card rounded-2xl p-4 flex items-center gap-3 shadow-card transition-smooth hover:shadow-soft text-left">
    <div className="w-12 h-12 rounded-xl gradient-mint flex items-center justify-center text-calm-foreground">
      <Wind className="w-5 h-5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-foreground truncate">{title}</p>
      <p className="text-xs text-muted-foreground">{duration}</p>
    </div>
    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{tag}</span>
  </button>
);

export default HomeScreen;
