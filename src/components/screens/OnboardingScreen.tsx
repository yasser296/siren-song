import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-meditation.jpg";

interface Props { onDone: () => void; logo: string; }

const OnboardingScreen = ({ onDone, logo }: Props) => {
  return (
    <div className="min-h-screen w-full flex justify-center bg-gradient-to-b from-secondary/40 to-background">
      <div className="relative w-full max-w-[440px] min-h-screen md:my-6 md:rounded-[2.5rem] md:min-h-[860px] md:max-h-[860px] overflow-hidden flex flex-col gradient-hero text-primary-foreground md:border md:border-border shadow-soft">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/30 blur-3xl animate-float" />
          <div className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-calm/40 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-white/40 blur-2xl animate-breathe" />
            <img src={logo} alt="SerenMind logo" className="relative w-32 h-32 object-contain animate-float" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-3">SerenMind</h1>
          <p className="text-lg text-primary-foreground/90 mb-2 font-medium">Your calm. Your mind. Your space.</p>
          <p className="text-sm text-primary-foreground/80 max-w-xs leading-relaxed">
            A mindful companion built for stressed students and busy professionals — breathe, reflect, and reconnect.
          </p>

          <img src={heroImg} alt="" loading="lazy" width={1024} height={1024} className="mt-8 w-64 h-64 object-cover rounded-3xl shadow-glow opacity-95" />
        </div>

        <div className="relative z-10 px-6 pb-10 pt-4 space-y-3">
          <Button
            onClick={onDone}
            size="lg"
            className="w-full h-14 rounded-2xl bg-white text-primary hover:bg-white/95 text-base font-semibold shadow-glow"
          >
            Begin your journey
          </Button>
          <button onClick={onDone} className="w-full text-sm text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
            I already have an account
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
