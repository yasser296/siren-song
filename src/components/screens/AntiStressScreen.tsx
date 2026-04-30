import { useState } from "react";
import { ChevronLeft, Wind, Timer, Hand, Footprints, Eye, PenLine, Activity, Sparkles, Waves, Target, Flower2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/fakeApi";

interface Exercise {
  id: string;
  title: string;
  duration: string;
  description: string;
  steps: string[];
  icon: typeof Wind;
  gradient: string;
  durationSec: number;
}

const EXERCISES: Exercise[] = [
  {
    id: "coherent",
    title: "Coherent Breathing",
    duration: "5 min",
    description: "Inhale 5 sec, exhale 5 sec — a steady rhythm to calm your nervous system.",
    steps: ["Sit comfortably with a relaxed back", "Inhale slowly through the nose for 5 seconds", "Exhale gently through the mouth for 5 seconds", "Repeat for 5 minutes"],
    icon: Wind,
    gradient: "gradient-mint",
    durationSec: 300,
  },
  {
    id: "478",
    title: "4-7-8 Technique",
    duration: "2 min",
    description: "Inhale 4 — hold 7 — exhale 8. A natural tranquilizer for the body.",
    steps: ["Inhale through your nose for 4 seconds", "Hold your breath for 7 seconds", "Exhale fully through your mouth for 8 seconds", "Repeat 4 cycles"],
    icon: Timer,
    gradient: "gradient-primary",
    durationSec: 120,
  },
  {
    id: "box",
    title: "Box Breathing",
    duration: "4 min",
    description: "4 sec inhale · 4 sec hold · 4 sec exhale · 4 sec hold. Used by Navy SEALs.",
    steps: ["Inhale for 4 seconds", "Hold for 4 seconds", "Exhale for 4 seconds", "Hold empty for 4 seconds"],
    icon: Activity,
    gradient: "gradient-warm",
    durationSec: 240,
  },
  {
    id: "54321",
    title: "5-4-3-2-1 Grounding",
    duration: "3 min",
    description: "Anchor yourself in the present moment using your five senses.",
    steps: ["Name 5 things you see", "4 things you can touch", "3 things you hear", "2 things you smell", "1 thing you taste"],
    icon: Eye,
    gradient: "bg-accent",
    durationSec: 180,
  },
  {
    id: "bodyscan",
    title: "Body Scan",
    duration: "8 min",
    description: "Mentally scan each body part slowly, releasing tension as you go.",
    steps: ["Lie down and close your eyes", "Start at your toes, notice sensations", "Move slowly upward through each muscle", "Release tension with every exhale"],
    icon: Hand,
    gradient: "gradient-mint",
    durationSec: 480,
  },
  {
    id: "sensory",
    title: "Sensory Focus",
    duration: "2 min",
    description: "Focus deeply on a single sound, object, or smell for 60 seconds.",
    steps: ["Pick one object near you", "Observe its texture, color, edges", "Notice every detail without judging", "Stay for 60 full seconds"],
    icon: Target,
    gradient: "gradient-primary",
    durationSec: 120,
  },
  {
    id: "emotion",
    title: "Emotion Timer",
    duration: "1 min",
    description: "Pause and observe an emotion for 60 seconds — without reacting.",
    steps: ["Name the emotion you feel", "Where does it sit in your body?", "Breathe into it gently", "Watch it shift over 60 seconds"],
    icon: Sparkles,
    gradient: "gradient-warm",
    durationSec: 60,
  },
  {
    id: "writing",
    title: "Free Writing",
    duration: "5 min",
    description: "Write for 5 minutes without stopping or editing. Let it flow.",
    steps: ["Open your journal", "Set a 5-minute timer", "Write whatever comes to mind", "Don't correct, don't pause"],
    icon: PenLine,
    gradient: "bg-accent",
    durationSec: 300,
  },
  {
    id: "stretch",
    title: "Neck & Shoulder Stretch",
    duration: "3 min",
    description: "Guided stretches to release stored tension.",
    steps: ["Roll shoulders backward 5 times", "Tilt head gently to each side", "Hold each stretch for 15 seconds", "Breathe slowly throughout"],
    icon: Activity,
    gradient: "gradient-mint",
    durationSec: 180,
  },
  {
    id: "yoga",
    title: "Mini Yoga Flow",
    duration: "6 min",
    description: "Easy poses: child's pose, cat-cow, deep chest opening.",
    steps: ["Begin in child's pose for 30s", "Move into cat-cow for 1 min", "Open chest with cobra pose", "End in seated stillness"],
    icon: Flower2,
    gradient: "gradient-warm",
    durationSec: 360,
  },
  {
    id: "eft",
    title: "EFT Tapping",
    duration: "4 min",
    description: "Gently tap acupressure points while breathing slowly.",
    steps: ["Tap the side of your hand", "Move to eyebrow, side of eye, under eye", "Continue: chin, collarbone, under arm", "Repeat 3 rounds with deep breaths"],
    icon: Hand,
    gradient: "gradient-primary",
    durationSec: 240,
  },
  {
    id: "viz",
    title: "Visualization",
    duration: "5 min",
    description: "Imagine a calm, safe place in vivid detail.",
    steps: ["Close your eyes, breathe deeply", "Picture a place where you feel safe", "Notice colors, sounds, smells", "Stay there as long as you need"],
    icon: Waves,
    gradient: "bg-accent",
    durationSec: 300,
  },
  {
    id: "walk",
    title: "Mindful Walking",
    duration: "5 min",
    description: "Walk slowly and notice every step, sensation, and breath.",
    steps: ["Walk at half your normal pace", "Feel each foot meet the ground", "Sync your breath to your steps", "Notice your surroundings without judging"],
    icon: Footprints,
    gradient: "gradient-mint",
    durationSec: 300,
  },
];

const AntiStressScreen = () => {
  const [active, setActive] = useState<Exercise | null>(null);

  const startExercise = async (ex: Exercise) => {
    await api.logSession({ technique: ex.title, durationSec: ex.durationSec });
    toast.success(`${ex.title} logged 🌿`);
  };

  if (active) {
    const Icon = active.icon;
    return (
      <div className="px-5 pt-6 pb-6 animate-fade-up">
        <button
          onClick={() => setActive(null)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 hover:text-foreground transition-smooth"
        >
          <ChevronLeft className="w-4 h-4" /> Back to exercises
        </button>

        <div className={`${active.gradient} rounded-3xl p-6 text-primary-foreground shadow-glow mb-5`}>
          <Icon className="w-10 h-10 mb-3" strokeWidth={1.8} />
          <h1 className="text-2xl font-bold leading-tight mb-1">{active.title}</h1>
          <p className="text-sm opacity-90">{active.duration} · Anti-stress technique</p>
        </div>

        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{active.description}</p>

        <h2 className="text-base font-semibold text-foreground mb-3">How to practice</h2>
        <ol className="space-y-3 mb-6">
          {active.steps.map((s, i) => (
            <li key={i} className="flex gap-3 bg-card rounded-2xl p-4 shadow-card">
              <span className="w-7 h-7 rounded-full gradient-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-foreground leading-relaxed pt-0.5">{s}</p>
            </li>
          ))}
        </ol>

        <button
          onClick={() => startExercise(active)}
          className="w-full h-14 rounded-2xl gradient-primary text-primary-foreground font-semibold shadow-glow transition-bounce hover:scale-[1.02] active:scale-95"
        >
          Mark as practiced
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-4 space-y-5 animate-fade-up">
      <header>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Curated techniques
        </p>
        <h1 className="text-3xl font-bold text-primary leading-tight">Anti-Stress Exercises</h1>
        <p className="text-sm text-muted-foreground mt-1">Validated practices to ground, breathe, and reset.</p>
      </header>

      <div className="space-y-2.5">
        {EXERCISES.map((ex) => {
          const Icon = ex.icon;
          return (
            <button
              key={ex.id}
              onClick={() => setActive(ex)}
              className="w-full bg-secondary/60 hover:bg-secondary rounded-2xl p-4 flex items-center gap-3 text-left transition-smooth shadow-card"
            >
              <div className={`w-11 h-11 rounded-xl ${ex.gradient} flex items-center justify-center text-primary-foreground shrink-0`}>
                <Icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{ex.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{ex.description}</p>
              </div>
              <span className="text-[10px] font-medium text-primary shrink-0">{ex.duration}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AntiStressScreen;
