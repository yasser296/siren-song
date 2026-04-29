import { useEffect, useRef, useState } from "react";
import { Search, Play, Pause, SkipForward, Music2, Heart } from "lucide-react";
import { toast } from "sonner";
import { api, useApi, type Track } from "@/lib/fakeApi";

const filters: { key: "all" | "focus" | "sleep" | "stressed" | "great"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "focus", label: "Focus" },
  { key: "sleep", label: "Sleep" },
  { key: "stressed", label: "Calm" },
  { key: "great", label: "Uplift" },
];

const MusicScreen = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<typeof filters[number]["key"]>("all");
  const tracks = useApi(() => api.getTracks(query, filter));
  const recent = useApi(() => api.getRecentPlays());
  const [playing, setPlaying] = useState<Track | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) { if (timerRef.current) window.clearInterval(timerRef.current); return; }
    setProgress(0);
    timerRef.current = window.setInterval(() => {
      setProgress((p) => {
        if (p + 1 >= playing.durationSec) {
          window.clearInterval(timerRef.current!);
          setPlaying(null);
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [playing]);

  const togglePlay = async (t: Track) => {
    if (playing?.id === t.id) { setPlaying(null); return; }
    setPlaying(t);
    await api.logPlay(t.id);
    toast.success(`Now playing: ${t.title}`);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="px-5 pt-6 pb-32 space-y-5 animate-fade-up">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Sound</h1>
        <p className="text-sm text-muted-foreground">Search music to soothe your mind</p>
      </header>

      <div className="relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your favorite track or artist…"
          className="w-full bg-card rounded-2xl pl-11 pr-4 py-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-smooth ${
              filter === f.key ? "gradient-primary text-primary-foreground shadow-soft" : "bg-secondary text-secondary-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {recent.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold mb-2">Recently played</h2>
          <div className="flex gap-3 overflow-x-auto -mx-1 px-1 pb-2">
            {recent.map(({ track }) => (
              <button key={track.id} onClick={() => togglePlay(track)} className="shrink-0 w-32 text-left">
                <div className={`${track.color} aspect-square rounded-2xl flex items-center justify-center text-primary-foreground shadow-card`}>
                  <Music2 className="w-8 h-8" />
                </div>
                <p className="text-xs font-semibold mt-2 truncate">{track.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold mb-2">{tracks.length} tracks</h2>
        <div className="space-y-2">
          {tracks.map((t) => (
            <div key={t.id} className="bg-card rounded-2xl p-3 flex items-center gap-3 shadow-card">
              <div className={`w-12 h-12 rounded-xl ${t.color} flex items-center justify-center text-primary-foreground`}>
                <Music2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{t.title}</p>
                <p className="text-xs text-muted-foreground truncate">{t.artist} · {fmt(t.durationSec)}</p>
              </div>
              <button onClick={() => togglePlay(t)} className="w-10 h-10 rounded-full gradient-primary text-primary-foreground flex items-center justify-center shadow-soft active:scale-95">
                {playing?.id === t.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
            </div>
          ))}
          {tracks.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No tracks match.</p>}
        </div>
      </section>

      {playing && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[420px] glass rounded-3xl p-3 shadow-glow flex items-center gap-3 border border-border">
          <div className={`w-12 h-12 rounded-xl ${playing.color} flex items-center justify-center text-primary-foreground`}>
            <Music2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{playing.title}</p>
            <div className="h-1 bg-secondary rounded-full mt-1.5 overflow-hidden">
              <div className="h-full gradient-primary transition-all" style={{ width: `${(progress / playing.durationSec) * 100}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{fmt(progress)} / {fmt(playing.durationSec)}</p>
          </div>
          <button onClick={() => setPlaying(null)} className="w-10 h-10 rounded-full gradient-primary text-primary-foreground flex items-center justify-center">
            <Pause className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MusicScreen;
