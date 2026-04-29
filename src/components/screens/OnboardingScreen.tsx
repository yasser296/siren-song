import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import heroImg from "@/assets/hero-meditation.jpg";
import { api } from "@/lib/fakeApi";
import { Loader2 } from "lucide-react";

interface Props { logo: string; }

const OnboardingScreen = ({ logo }: Props) => {
  const [step, setStep] = useState<"intro" | "form">("intro");
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"student" | "professional">("student");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in your name and email");
      return;
    }
    setLoading(true);
    try {
      await api.signIn({
        name: name.trim(),
        email: email.trim(),
        role,
        location: "Rabat",
      });
      toast.success(mode === "signup" ? `Welcome, ${name.split(" ")[0]} 🌿` : "Welcome back 💙");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickDemo = async () => {
    setLoading(true);
    await api.signIn({ name: "Omar Haroual", email: "omar@demo.com", role: "student", location: "Rabat" });
    toast.success("Demo account loaded");
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-gradient-to-b from-secondary/40 to-background">
      <div className="relative w-full max-w-[440px] min-h-screen md:my-6 md:rounded-[2.5rem] md:min-h-[860px] md:max-h-[860px] overflow-hidden flex flex-col gradient-hero text-primary-foreground md:border md:border-border shadow-soft">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/30 blur-3xl animate-float" />
          <div className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-calm/40 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        {step === "intro" ? (
          <>
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
              <img src={heroImg} alt="" loading="lazy" width={1024} height={1024} className="mt-8 w-56 h-56 object-cover rounded-3xl shadow-glow opacity-95" />
            </div>

            <div className="relative z-10 px-6 pb-10 pt-4 space-y-3">
              <Button onClick={() => { setMode("signup"); setStep("form"); }} size="lg"
                className="w-full h-14 rounded-2xl bg-white text-primary hover:bg-white/95 text-base font-semibold shadow-glow">
                Begin your journey
              </Button>
              <button onClick={() => { setMode("signin"); setStep("form"); }} className="w-full text-sm text-primary-foreground/90 hover:text-primary-foreground transition-smooth">
                I already have an account
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={submit} className="relative z-10 flex-1 flex flex-col px-6 pt-10 pb-8">
            <button type="button" onClick={() => setStep("intro")} className="text-sm text-primary-foreground/80 self-start mb-6">← Back</button>
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="" className="w-12 h-12" />
              <div>
                <h2 className="text-2xl font-bold">{mode === "signup" ? "Create account" : "Welcome back"}</h2>
                <p className="text-sm text-primary-foreground/85">{mode === "signup" ? "A few quick details to personalize" : "Sign in to continue"}</p>
              </div>
            </div>

            <div className="bg-white/95 text-foreground rounded-3xl p-5 space-y-4 shadow-glow">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Omar Haroual" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-12 rounded-xl" />
              </div>
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label>I am a…</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["student", "professional"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`h-12 rounded-xl text-sm font-medium capitalize transition-smooth ${
                          role === r ? "gradient-primary text-primary-foreground shadow-soft" : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === "signup" ? "Create account" : "Sign in"}
              </Button>
            </div>

            <div className="mt-auto pt-6 text-center">
              <button type="button" onClick={quickDemo} className="text-sm underline text-primary-foreground/90">
                Or try the demo account
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
