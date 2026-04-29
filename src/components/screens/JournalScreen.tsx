import { useState } from "react";
import { Plus, Smile, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api, useApi, type Mood } from "@/lib/fakeApi";

const moodEmoji: Record<Mood, string> = { great: "😄", good: "🙂", okay: "😐", low: "😟", stressed: "😣" };
const moodValue: Record<Mood, number> = { great: 95, good: 75, okay: 55, low: 35, stressed: 20 };

const formatRelative = (ts: number) => {
  const diff = Date.now() - ts;
  const day = 24 * 60 * 60 * 1000;
  if (diff < day) return "Today";
  if (diff < 2 * day) return "Yesterday";
  return `${Math.floor(diff / day)} days ago`;
};

const JournalScreen = () => {
  const entries = useApi(() => api.getJournal());
  const moods = useApi(() => api.getMoods());
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<Mood>("good");
  const [saving, setSaving] = useState(false);

  // Build last-7-days mood bars
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - (6 - i));
    const m = moods.find((x) => new Date(x.createdAt).setHours(0, 0, 0, 0) === d.getTime());
    return { label: ["S","M","T","W","T","F","S"][d.getDay()], h: m ? moodValue[m.mood] : 10 };
  });
  const avgRecent = days.slice(-3).reduce((a, d) => a + d.h, 0) / 3;
  const avgPrev = days.slice(0, 4).reduce((a, d) => a + d.h, 0) / 4;
  const trend = Math.round(((avgRecent - avgPrev) / Math.max(avgPrev, 1)) * 100);

  const save = async () => {
    if (!title.trim() && !body.trim()) {
      toast.error("Add a title or note");
      return;
    }
    setSaving(true);
    await api.addJournal({ title: title.trim() || "Untitled", body: body.trim(), mood });
    setSaving(false);
    setTitle(""); setBody(""); setComposing(false);
    toast.success("Entry saved");
  };

  const remove = async (id: string) => {
    await api.deleteJournal(id);
    toast.success("Entry deleted");
  };

  return (
    <div className="px-5 pt-6 pb-4 animate-fade-up">
      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Journal</h1>
          <p className="text-sm text-muted-foreground">Track how you feel, day by day</p>
        </div>
        <button onClick={() => setComposing((c) => !c)}
          className="w-11 h-11 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center shadow-glow transition-bounce active:scale-90"
          aria-label="New entry">
          <Plus className={`w-5 h-5 transition-bounce ${composing ? "rotate-45" : ""}`} />
        </button>
      </header>

      {composing && (
        <div className="mb-6 bg-card rounded-3xl p-4 shadow-soft border border-border animate-fade-up">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full bg-transparent outline-none font-semibold text-foreground placeholder:text-muted-foreground mb-2"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full bg-transparent outline-none resize-none text-foreground placeholder:text-muted-foreground"
          />
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
            <div className="flex gap-1.5">
              {(Object.keys(moodEmoji) as Mood[]).map((m) => (
                <button key={m} onClick={() => setMood(m)}
                  className={`w-9 h-9 rounded-xl text-xl transition-smooth ${mood === m ? "bg-primary/15 ring-2 ring-primary" : "hover:bg-secondary"}`}>
                  {moodEmoji[m]}
                </button>
              ))}
            </div>
            <button onClick={save} disabled={saving}
              className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save
            </button>
          </div>
        </div>
      )}

      <section className="bg-card rounded-3xl p-5 shadow-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">This week</p>
            <p className="font-semibold flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-calm" /> {trend >= 0 ? "Feeling lighter" : "Tougher week"}
            </p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${trend >= 0 ? "bg-calm/20 text-calm" : "bg-destructive/15 text-destructive"}`}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        </div>
        <div className="flex items-end justify-between gap-2 h-28">
          {days.map((d, i) => (
            <div key={i} className="flex-1 h-full flex flex-col items-center gap-1.5 justify-end">
              <div className="w-full rounded-xl gradient-primary opacity-90 transition-smooth" style={{ height: `${d.h}%` }} />
              <span className="text-[10px] text-muted-foreground">{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Recent entries</h2>
        {entries.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No entries yet. Tap + to write one.</p>
        )}
        {entries.map((e) => (
          <article key={e.id} className="bg-card rounded-2xl p-4 shadow-card group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">{formatRelative(e.createdAt)}</span>
              <div className="flex items-center gap-2">
                <span className="text-xl">{moodEmoji[e.mood]}</span>
                <button onClick={() => remove(e.id)} className="opacity-0 group-hover:opacity-100 transition-smooth text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-foreground">{e.title}</h3>
            {e.body && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{e.body}</p>}
          </article>
        ))}
      </section>
    </div>
  );
};

export default JournalScreen;
