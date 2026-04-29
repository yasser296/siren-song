import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

const phases = [
  { label: "Breathe in", duration: 4 },
  { label: "Hold", duration: 4 },
  { label: "Breathe out", duration: 6 },
  { label: "Hold", duration: 2 },
];

const BreatheScreen = () => {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSeconds((s) => {
        const phase = phases[phaseIdx];
        if (s + 1 >= phase.duration) {
          setPhaseIdx((p) => (p + 1) % phases.length);
          return 0;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, phaseIdx]);

  const phase = phases[phaseIdx];
  const isInhale = phase.label === "Breathe in";
  const isExhale = phase.label === "Breathe out";

  return (
    <div className="px-5 pt-8 pb-4 min-h-full flex flex-col items-center animate-fade-up">
      <header className="text-center mb-6">
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Box breathing</p>
        <h1 className="text-2xl font-bold text-foreground">Find your calm</h1>
        <p className="text-sm text-muted-foreground mt-1">Follow the rhythm. 4 · 4 · 6 · 2</p>
      </header>

      {/* Breathing orb */}
      <div className="relative flex items-center justify-center my-8 w-72 h-72">
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
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={() => { setRunning(false); setPhaseIdx(0); setSeconds(0); }}
          className="w-14 h-14 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center shadow-card transition-bounce active:scale-90"
          aria-label="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={() => setRunning((r) => !r)}
          className="w-20 h-20 rounded-3xl gradient-primary text-primary-foreground flex items-center justify-center shadow-glow transition-bounce active:scale-90"
          aria-label={running ? "Pause" : "Start"}
        >
          {running ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
        <div className="w-14 h-14" />
      </div>

      {/* Other techniques */}
      <section className="w-full mt-10">
        <h2 className="text-base font-semibold mb-3">More techniques</h2>
        <div className="space-y-2">
          {[
            { name: "4-7-8 Calming", desc: "For falling asleep" },
            { name: "Triangle Focus", desc: "Quick anti-stress" },
            { name: "Coherent breathing", desc: "Balance & clarity" },
          ].map((t) => (
            <div key={t.name} className="bg-card rounded-2xl p-3 flex items-center gap-3 shadow-card">
              <div className="w-10 h-10 rounded-xl gradient-mint" />
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
              <Play className="w-4 h-4 text-primary" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BreatheScreen;
