import { Trophy, Flame, Star, CheckCircle2, Circle, Zap, Award } from "lucide-react";
import { api, useApi } from "@/lib/fakeApi";

const QuestsScreen = () => {
  const xp = useApi(() => api.getXP());
  const lvl = useApi(() => api.getLevel());
  const quests = useApi(() => api.getQuests());
  const streak = useApi(() => api.getStreak());

  const completed = quests.filter((q) => q.done).length;

  return (
    <div className="px-5 pt-6 pb-6 space-y-5 animate-fade-up">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Quests</h1>
        <p className="text-sm text-muted-foreground">Daily challenges to grow your mind</p>
      </header>

      <section className="relative overflow-hidden rounded-3xl gradient-hero p-5 text-primary-foreground shadow-glow">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/15 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-90">Level {lvl.level}</p>
              <p className="text-3xl font-bold mt-1">{xp} XP</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-4 h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${lvl.progressPct}%` }} />
          </div>
          <p className="text-xs opacity-90 mt-2">{lvl.current} / {lvl.nextAt} XP to level {lvl.level + 1}</p>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-3">
        <MiniStat icon={Flame} value={`${streak}d`} label="Streak" tint="text-warm" />
        <MiniStat icon={CheckCircle2} value={`${completed}/${quests.length}`} label="Today" tint="text-calm" />
        <MiniStat icon={Star} value={`${lvl.level}`} label="Level" tint="text-primary" />
      </div>

      <section>
        <h2 className="text-base font-semibold mb-3">Daily quests</h2>
        <div className="space-y-3">
          {quests.map((q) => (
            <div key={q.id} className={`bg-card rounded-2xl p-4 shadow-card flex items-center gap-3 ${q.done ? "opacity-60" : ""}`}>
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                q.done ? "bg-calm/20 text-calm" : "gradient-primary text-primary-foreground"
              }`}>
                {q.done ? <CheckCircle2 className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-semibold truncate ${q.done ? "line-through" : ""}`}>{q.title}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warm/20 text-warm-foreground shrink-0">+{q.reward} XP</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{q.description}</p>
                <div className="mt-2 h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${(q.progress / q.goal) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-3">Milestones</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "First Breath", unlocked: xp >= 50, icon: "🌱" },
            { name: "Mind Apprentice", unlocked: lvl.level >= 2, icon: "🧘" },
            { name: "Streak Keeper", unlocked: streak >= 3, icon: "🔥" },
            { name: "Sere Friend", unlocked: xp >= 200, icon: "💬" },
            { name: "Sound Healer", unlocked: xp >= 300, icon: "🎵" },
            { name: "Zen Master", unlocked: lvl.level >= 5, icon: "🏆" },
          ].map((m) => (
            <div key={m.name} className={`bg-card rounded-2xl p-4 text-center shadow-card ${m.unlocked ? "" : "opacity-40 grayscale"}`}>
              <div className="text-3xl">{m.icon}</div>
              <p className="text-xs font-semibold mt-2">{m.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{m.unlocked ? "Unlocked" : "Locked"}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const MiniStat = ({ icon: Icon, value, label, tint }: { icon: typeof Flame; value: string; label: string; tint: string }) => (
  <div className="bg-card rounded-2xl p-3 text-center shadow-card">
    <Icon className={`w-5 h-5 mx-auto ${tint}`} />
    <p className="text-base font-bold mt-1">{value}</p>
    <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
  </div>
);

export default QuestsScreen;
