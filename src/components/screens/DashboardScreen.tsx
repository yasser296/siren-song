import { Activity, Brain, Clock, BookHeart, Smile, TrendingUp } from "lucide-react";
import { api, useApi, type Mood } from "@/lib/fakeApi";

const MOOD_META: Record<Mood, { emoji: string; color: string; label: string }> = {
  great: { emoji: "😄", color: "bg-calm", label: "Great" },
  good: { emoji: "🙂", color: "bg-primary", label: "Good" },
  okay: { emoji: "😐", color: "bg-warm", label: "Okay" },
  low: { emoji: "😟", color: "bg-accent", label: "Low" },
  stressed: { emoji: "😣", color: "bg-destructive", label: "Stressed" },
};

const DashboardScreen = () => {
  const data = useApi(() => api.getDashboard());
  const maxMood = 5;
  const maxMin = Math.max(20, ...data.last7.map((d) => d.minutes));
  const totalMoodsLogged = data.moodCounts.reduce((a, m) => a + m.count, 0);
  const avgMood = data.last7.filter((d) => d.moodScore > 0).reduce((a, d, _, arr) => a + d.moodScore / arr.length, 0);

  return (
    <div className="px-5 pt-6 pb-6 space-y-5 animate-fade-up">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Mental Health Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your last 7 days at a glance</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <KPI icon={Smile} label="Avg mood" value={avgMood ? avgMood.toFixed(1) : "–"} suffix="/ 5" gradient="gradient-mint" />
        <KPI icon={Clock} label="Minutes" value={String(data.totals.minutes)} suffix="min" gradient="gradient-primary" />
        <KPI icon={Activity} label="Sessions" value={String(data.totals.sessions)} suffix="total" gradient="gradient-warm" />
        <KPI icon={BookHeart} label="Journal entries" value={String(data.totals.journals)} suffix="written" gradient="bg-accent" dark />
      </div>

      <Card title="Mood trend (7 days)" icon={TrendingUp}>
        <div className="flex items-end justify-between gap-1.5 h-32">
          {data.last7.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full bg-secondary/50 rounded-lg overflow-hidden flex flex-col justify-end" style={{ height: "100%" }}>
                <div
                  className="gradient-primary rounded-lg transition-all"
                  style={{ height: `${(d.moodScore / maxMood) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{d.label[0]}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Practice minutes" icon={Activity}>
        <div className="flex items-end justify-between gap-1.5 h-24">
          {data.last7.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div className="w-full flex flex-col justify-end" style={{ height: "100%" }}>
                <div className="gradient-mint rounded-md" style={{ height: `${Math.max(4, (d.minutes / maxMin) * 100)}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground">{d.minutes}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Mood distribution" icon={Brain}>
        <div className="space-y-2">
          {data.moodCounts.map((m) => {
            const pct = totalMoodsLogged ? (m.count / totalMoodsLogged) * 100 : 0;
            const meta = MOOD_META[m.mood];
            return (
              <div key={m.mood} className="flex items-center gap-3">
                <span className="text-lg w-6">{meta.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{meta.label}</span>
                    <span className="text-muted-foreground">{m.count}</span>
                  </div>
                  <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                    <div className={`h-full ${meta.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="bg-card rounded-3xl p-4 shadow-card">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">AI insight</p>
        <p className="text-sm mt-1.5 leading-relaxed">
          {avgMood >= 4
            ? "Your mood has been bright this week — keep up the small daily rituals 🌿"
            : avgMood >= 2.5
              ? "You're hovering in a balanced zone. A 5-minute breath or short walk could lift the curve."
              : totalMoodsLogged === 0
                ? "Start by logging your mood to unlock personalized insights."
                : "It's been a heavier week. Consider reaching out — try the AI companion or a doctor chat."}
        </p>
      </div>
    </div>
  );
};

const KPI = ({ icon: Icon, label, value, suffix, gradient, dark }: { icon: typeof Activity; label: string; value: string; suffix: string; gradient: string; dark?: boolean }) => (
  <div className={`${gradient} rounded-3xl p-4 shadow-card ${dark ? "text-accent-foreground" : "text-primary-foreground"}`}>
    <Icon className="w-5 h-5 opacity-90" />
    <p className="text-2xl font-bold mt-3 leading-none">{value}<span className="text-xs font-normal ml-1 opacity-80">{suffix}</span></p>
    <p className="text-xs opacity-90 mt-1">{label}</p>
  </div>
);

const Card = ({ title, icon: Icon, children }: { title: string; icon: typeof Activity; children: React.ReactNode }) => (
  <div className="bg-card rounded-3xl p-4 shadow-card">
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-primary" />
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);

export default DashboardScreen;
