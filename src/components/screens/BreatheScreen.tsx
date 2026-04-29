import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/fakeApi";

const techniques = [
  { name: "Box breathing", phases: [{ label: "Breathe in", duration: 4 }, { label: "Hold", duration: 4 }, { label: "Breathe out", duration: 6 }, { label: "Hold", duration: 2 }] },
  { name: "4-7-8 Calming", phases: [{ label: "Breathe in", duration: 4 }, { label: "Hold", duration: 7 }, { label: "Breathe out", duration: 8 }] },
  { name: "Triangle Focus", phases: [{ label: "Breathe in", duration: 4 }, { label: "Hold", duration: 4 }, { label: "Breathe out", duration: 4 }] },
];

const BreatheScreen = () => {
  const [tIdx, setTIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const elapsedRef = useRef(0);
  const startRef = useRef<number | null>(null);

  const technique = techniques[tIdx];
  const phase = technique.phases[phaseIdx];

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s + 1 >= phase.duration) {
          setPhaseIdx((p) => (p + 1) % technique.phases.length);
          return 0;
        }
        return s + 1;
      });
      elapsedRef.current += 1;
    }, 1000);
    return () => clearInterval(t);
  }, [running, phaseIdx, phase.duration, technique.phases.length]);

  const stopAndSave = async () => {
    setRunning(false);
    if (elapsedRef.current >= 30) {
      await api.logSession({ technique: technique.name, durationSec: elapsedRef.current });
      toast.success(`Session saved · ${Math.round(elapsedRef.current / 60)} min`);
    }
    elapsedRef.current = 0;
    setPhaseIdx(0); setSeconds(0);
  };

  const isInhale = phase.label === "Breathe in";
  const isExhale = phase.label === "Breathe out";

  return (
    <div className="px-5 pt-8 pb-4 min-h-full flex flex-col items-center animate-fade-up">
      <header className="text-center mb-4">
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">{technique.name}</p>
        <h1 className="text-2xl font-bold text-foreground">Find your calm</h1>
        <p className="text-sm text-muted-foreground mt-1">Follow the rhythm with the orb</p>
      </header>

      <div className="relative flex items-center justify-center my-6 w-72 h-72">
        {running && (
          <>
            <div className="absolute inset-0 rounded-full gradient-primary opacity-20 animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full gradient-primary opacity-20 animate-pulse-ring" style={{ animationDelay: "1.2s" }} />
          </>
        )}
        <div
          className="relative rounded-full gradient-hero shadow-glow flex items-center justify-center text-primary-foreground transition-all ease-in-out"
          style={{
            width: running ? (isInhale ? "18rem" : isExhale ? "10rem" : "14rem") : "14rem",
            height: running ? (isInhale ? "18rem" : isExhale ? "10rem" : "14rem") : "14rem",
            transitionDuration: `${phase.duration}s`,
          }}
        >
          <div className="text-center">
            <p className="text-xl font-semibold">{running ? phase.label : "Ready?"}</p>
            <p className="text-4xl font-bold mt-1 tabular-nums">
              {running ? phase.duration - seconds : "—"}
            </p>
            {running && (
              <p className="text-xs opacity-80 mt-1">{Math.floor(elapsedRef.current / 60)}:{String(elapsedRef.current % 60).padStart(2, "0")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <button onClick={stopAndSave}
          className="w-14 h-14 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center shadow-card transition-bounce active:scale-90"
          aria-label="Reset">
          <RotateCcw className="w-5 h-5" />
        </button>
        <button onClick={() => setRunning((r) => !r)}
          className="w-20 h-20 rounded-3xl gradient-primary text-primary-foreground flex items-center justify-center shadow-glow transition-bounce active:scale-90"
          aria-label={running ? "Pause" : "Start"}>
          {running ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
        <div className="w-14 h-14" />
      </div>

      <section className="w-full mt-10">
        <h2 className="text-base font-semibold mb-3">Techniques</h2>
        <div className="space-y-2">
          {techniques.map((t, i) => (
            <button
              key={t.name}
              onClick={() => { setTIdx(i); setPhaseIdx(0); setSeconds(0); setRunning(false); elapsedRef.current = 0; }}
              className={`w-full bg-card rounded-2xl p-3 flex items-center gap-3 shadow-card text-left transition-smooth ${i === tIdx ? "ring-2 ring-primary" : ""}`}
            >
              <div className="w-10 h-10 rounded-xl gradient-mint" />
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.phases.map((p) => p.duration).join("–")} pattern</p>
              </div>
              <Play className="w-4 h-4 text-primary" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BreatheScreen;
