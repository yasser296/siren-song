import { Bell, Globe, Lock, HelpCircle, LogOut, Award, Flame, Clock } from "lucide-react";

const stats = [
  { icon: Flame, label: "Streak", value: "7 days", color: "text-warm" },
  { icon: Clock, label: "Total", value: "4h 32m", color: "text-primary" },
  { icon: Award, label: "Badges", value: "12", color: "text-calm" },
];

const settings = [
  { icon: Bell, label: "Notifications", hint: "Daily reminders" },
  { icon: Globe, label: "Language", hint: "English" },
  { icon: Lock, label: "Privacy", hint: "Anonymous mode on" },
  { icon: HelpCircle, label: "Help & support", hint: "FAQ, contact" },
];

const ProfileScreen = ({ logo }: { logo: string }) => (
  <div className="animate-fade-up">
    {/* Header banner */}
    <div className="relative gradient-hero pt-8 pb-16 px-5 text-primary-foreground">
      <div className="absolute -bottom-1 left-0 right-0 h-6 bg-background rounded-t-[2rem]" />
      <div className="flex flex-col items-center text-center relative z-10">
        <div className="w-24 h-24 rounded-3xl bg-white/95 p-2 shadow-glow mb-3">
          <img src={logo} alt="Avatar" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl font-bold">Omar Haroual</h1>
        <p className="text-sm opacity-90">Computer Engineering Student · Rabat</p>
        <span className="mt-3 text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur">Mindful explorer · Lvl 4</span>
      </div>
    </div>

    {/* Stats */}
    <section className="px-5 -mt-6 relative z-10">
      <div className="bg-card rounded-3xl p-4 shadow-soft grid grid-cols-3 divide-x divide-border">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex flex-col items-center gap-1 px-2">
            <Icon className={`w-5 h-5 ${color}`} />
            <p className="text-base font-bold">{value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Achievements */}
    <section className="px-5 mt-6">
      <h2 className="text-base font-semibold mb-3">Recent achievements</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {["First breath", "7 day streak", "Night owl", "Mood master"].map((b, i) => (
          <div key={b} className="shrink-0 w-24 bg-card rounded-2xl p-3 text-center shadow-card">
            <div className={`w-12 h-12 mx-auto rounded-2xl ${["gradient-primary","gradient-warm","gradient-mint","bg-accent"][i]} flex items-center justify-center mb-2`}>
              <Award className="w-6 h-6 text-primary-foreground" />
            </div>
            <p className="text-[11px] font-medium leading-tight">{b}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Settings */}
    <section className="px-5 mt-6">
      <h2 className="text-base font-semibold mb-3">Settings</h2>
      <div className="bg-card rounded-2xl shadow-card divide-y divide-border">
        {settings.map(({ icon: Icon, label, hint }) => (
          <button key={label} className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/30 transition-smooth first:rounded-t-2xl last:rounded-b-2xl">
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

      <button className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-destructive/10 text-destructive font-medium text-sm">
        <LogOut className="w-4 h-4" /> Sign out
      </button>
    </section>
  </div>
);

export default ProfileScreen;
