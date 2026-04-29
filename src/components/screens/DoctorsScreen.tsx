import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Search, Send, Star, CheckCircle2, MessageCircle } from "lucide-react";
import { api, useApi, type Doctor } from "@/lib/fakeApi";

const DoctorsScreen = () => {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const doctors = useApi(() => api.getDoctors(query));

  if (openId) return <DoctorChat doctorId={openId} onBack={() => setOpenId(null)} />;

  return (
    <div className="px-5 pt-6 pb-4 space-y-5 animate-fade-up">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Talk to a Doctor</h1>
        <p className="text-sm text-muted-foreground">Verified psychologists & therapists</p>
      </header>

      <div className="relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or specialty…"
          className="w-full bg-card rounded-2xl pl-11 pr-4 py-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-3">
        {doctors.map((d) => <DoctorCard key={d.id} doctor={d} onOpen={() => setOpenId(d.id)} />)}
        {doctors.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No doctor matched your search.</p>}
      </div>
    </div>
  );
};

const DoctorCard = ({ doctor, onOpen }: { doctor: Doctor; onOpen: () => void }) => (
  <div className="bg-card rounded-3xl p-4 shadow-card">
    <div className="flex items-center gap-3">
      <div className={`w-14 h-14 rounded-2xl ${doctor.avatarColor} flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0`}>
        {doctor.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-foreground truncate">{doctor.name}</p>
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground truncate">{doctor.title}</p>
        <div className="flex items-center gap-2 mt-1 text-xs">
          <span className="flex items-center gap-1 text-warm-foreground"><Star className="w-3 h-3 fill-warm text-warm" /> {doctor.rating}</span>
          <span className="text-muted-foreground">· {doctor.reviews} reviews</span>
          {doctor.online && <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full bg-calm/20 text-calm">● Online</span>}
        </div>
      </div>
    </div>
    <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{doctor.bio}</p>
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
      <div>
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{doctor.specialty}</p>
        <p className="text-sm font-semibold">${doctor.pricePerSession}<span className="text-xs text-muted-foreground font-normal"> / session</span></p>
      </div>
      <button onClick={onOpen} className="gradient-primary text-primary-foreground px-4 py-2 rounded-2xl text-sm font-medium flex items-center gap-1.5 shadow-soft transition-bounce hover:scale-105 active:scale-95">
        <MessageCircle className="w-4 h-4" /> Chat
      </button>
    </div>
  </div>
);

const DoctorChat = ({ doctorId, onBack }: { doctorId: string; onBack: () => void }) => {
  const doctor = api.getDoctor(doctorId)!;
  const messages = useApi(() => api.getChat(doctorId));
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  const send = async () => {
    if (!input.trim()) return;
    const txt = input; setInput("");
    await api.sendDoctorMessage(doctorId, txt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[800px] animate-fade-up">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border glass">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></button>
        <div className={`w-10 h-10 rounded-2xl ${doctor.avatarColor} flex items-center justify-center text-primary-foreground text-sm font-bold`}>{doctor.initials}</div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{doctor.name}</p>
          <p className="text-[11px] text-calm flex items-center gap-1">● {doctor.online ? "Online" : "Offline"} · {doctor.specialty}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
              m.from === "me" ? "gradient-primary text-primary-foreground rounded-br-sm" : "bg-card text-foreground rounded-bl-sm shadow-card"
            }`}>
              {m.body}
              <p className={`text-[10px] mt-1 ${m.from === "me" ? "opacity-70" : "text-muted-foreground"}`}>
                {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="p-3 border-t border-border bg-background flex items-center gap-2">
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Write a message…"
          className="flex-1 bg-secondary/40 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button onClick={send} className="w-11 h-11 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center shadow-soft active:scale-95"><Send className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

export default DoctorsScreen;
