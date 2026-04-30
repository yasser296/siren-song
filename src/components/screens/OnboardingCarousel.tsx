import { useState } from "react";
import { ChevronLeft, ChevronRight, HeartPulse, ClipboardCheck, Flower2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/fakeApi";

interface Props {
  logo: string;
  onDone: () => void;
}

const slides = [
  {
    icon: HeartPulse,
    title: "Take care of your mental health, every day.",
    body: "Track your stress, explore your emotions, and find inner balance.",
    gradient: "gradient-primary",
  },
  {
    icon: ClipboardCheck,
    title: "Answer a mini-questionnaire every day.",
    body: "Track your emotions with a clear, personalized chart.",
    gradient: "gradient-mint",
  },
  {
    icon: Flower2,
    title: "Access validated techniques.",
    body: "Guided breathing, meditation, visualization — simple tools, always at your fingertips.",
    gradient: "gradient-warm",
  },
  {
    icon: ShieldCheck,
    title: "We respect your privacy.",
    body: "Your information is confidential and secure.",
    gradient: "gradient-hero",
  },
];

const OnboardingCarousel = ({ logo, onDone }: Props) => {
  const [idx, setIdx] = useState(0);
  const last = idx === slides.length - 1;
  const slide = slides[idx];
  const Icon = slide.icon;

  const finish = () => {
    api.completeOnboarding();
    onDone();
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-gradient-to-b from-secondary/40 to-background">
      <div className="relative w-full max-w-[440px] min-h-screen md:my-6 md:rounded-[2.5rem] md:min-h-[860px] md:max-h-[860px] overflow-hidden flex flex-col bg-background md:border md:border-border shadow-soft">
        <div className="flex items-center justify-between px-5 pt-6">
          <img src={logo} alt="SerenMind" className="w-9 h-9" />
          <button
            onClick={finish}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
          >
            Skip
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center animate-fade-up" key={idx}>
          <div className={`relative w-56 h-56 rounded-[3rem] ${slide.gradient} flex items-center justify-center shadow-glow mb-10`}>
            <div className="absolute inset-0 rounded-[3rem] bg-white/20 blur-2xl opacity-60" />
            <Icon className="relative w-24 h-24 text-primary-foreground" strokeWidth={1.6} />
          </div>
          <h2 className="text-2xl font-bold text-foreground leading-tight mb-3 max-w-xs">{slide.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{slide.body}</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-smooth ${
                i === idx ? "w-8 bg-primary" : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="px-6 pb-10 flex items-center justify-between gap-4">
          <button
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="w-12 h-12 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center disabled:opacity-30 transition-smooth"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {last ? (
            <Button
              onClick={finish}
              className="flex-1 h-12 rounded-2xl gradient-primary text-primary-foreground font-semibold shadow-glow"
            >
              Continue
            </Button>
          ) : (
            <button
              onClick={() => setIdx((i) => Math.min(slides.length - 1, i + 1))}
              className="w-12 h-12 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center shadow-soft transition-bounce hover:scale-105"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingCarousel;
