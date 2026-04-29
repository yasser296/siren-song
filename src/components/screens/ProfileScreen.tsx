import { Bell, Globe, Lock, HelpCircle, LogOut, Award, Flame, Clock, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { api, useApi } from "@/lib/fakeApi";

const settings = [
  { icon: Bell, label: "Notifications", hint: "Daily reminders" },
  { icon: Globe, label: "Language", hint: "English" },
  { icon: Lock, label: "Privacy", hint: "Anonymous mode on" },
  { icon: HelpCircle, label: "Help & support", hint: "FAQ, contact" },
];

const ProfileScreen = ({ logo }: { logo: string }) => {
  const user = useApi(() => api.getUser());
  const streak = useApi(() => api.getStreak());
  const totalMin = useApi(() => api.getTotalMinutes());
  const sessions = useApi(() => api.getSessions());

  const badges = [
    { name: "First breath", earned: sessions.length > 0 },
    { name: "7 day streak", earned: streak >= 7 },
    { name: "Night owl", earned: sessions.some((s) => new Date(s.createdAt).getHours() >= 21) },
    { name: "Mood master", earned: api.getMoods().length >= 5 },
  ];
  const earnedCount = badges.filter((b) => b.earned).length;

  const signOut = async () => {
    await api.signOut();
    toast.success("Signed out. See you soon 💙");
  };

  if (!user) return null;

  return (
    <div className="animate-fade-up">
      <div className="relative gradient-hero pt-8 pb-16 px-5 text-primary-foreground">
        <div className="absolute -bottom-1 left-0 right-0 h-6 bg-background rounded-t-[2rem]" />
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-24 h-24 rounded-3xl bg-white/95 p-2 shadow-glow mb-3">
            <img src={logo} alt="Avatar" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm opacity-90 capitalize">{user.role} · {user.location}</p>
          <span className="mt-3 text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur">Mindful explorer · Lvl {user.level}</span>
        </div>
      </div>

      <section className="px-5 -mt-6 relative z-10">
        <div className="bg-card rounded-3xl p-4 shadow-soft grid grid-cols-3 divide-x divide-border">
          <Stat icon={Flame} label="Streak" value={`${streak} day${streak === 1 ? "" : "s"}`} color="text-warm" />
          <Stat icon={Clock} label="Total" value={`${Math.floor(totalMin / 60)}h ${totalMin % 60}m`} color="text-primary" />
          <Stat icon={Award} label="Badges" value={`${earnedCount}`} color="text-calm" />
        </div>
      </section>

      <section className="px-5 mt-6">
        <h2 className="text-base font-semibold mb-3">Achievements</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {badges.map((b, i) => (
            <div key={b.name} className={`shrink-0 w-24 bg-card rounded-2xl p-3 text-center shadow-card ${b.earned ? "" : "opacity-40 grayscale"}`}>
              <div className={`w-12 h-12 mx-auto rounded-2xl ${["gradient-primary","gradient-warm","gradient-mint","bg-accent"][i]} flex items-center justify-center mb-2`}>
                <Award className="w-6 h-6 text-primary-foreground" />
              </div>
              <p className="text-[11px] font-medium leading-tight">{b.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 mt-6">
        <h2 className="text-base font-semibold mb-3">Recent sessions</h2>
        <div className="bg-card rounded-2xl shadow-card divide-y divide-border">
          {sessions.slice(0, 4).map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-3">
              <div className="w-9 h-9 rounded-xl gradient-mint" />
              <div className="flex-1">
                <p className="text-sm font-medium">{s.technique}</p>
                <p className="text-xs text-muted-foreground">{Math.round(s.durationSec / 60)} min · {new Date(s.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No sessions yet</p>
          )}
        </div>
      </section>

      <section className="px-5 mt-6">
        <h2 className="text-base font-semibold mb-3">Settings</h2>
        <div className="bg-card rounded-2xl shadow-card divide-y divide-border">
          {settings.map(({ icon: Icon, label, hint }) => (
            <button key={label}
              onClick={() => toast.info(`${label} — coming soon`)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/30 transition-smooth first:rounded-t-2xl last:rounded-b-2xl">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-secondary-foreground">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{hint}</p>
              </div>
              <span className="text-muted-foreground">›</span>
            </button>
          ))}
        </div>

        <button onClick={signOut}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-destructive/10 text-destructive font-medium text-sm transition-smooth hover:bg-destructive/15">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </section>
    </div>
  );
};

const Stat = ({ icon: Icon, label, value, color }: { icon: typeof Flame; label: string; value: string; color: string }) => (
  <div className="flex flex-col items-center gap-1 px-2">
    <Icon className={`w-5 h-5 ${color}`} />
    <p className="text-base font-bold">{value}</p>
    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
  </div>
);

export default ProfileScreen;
