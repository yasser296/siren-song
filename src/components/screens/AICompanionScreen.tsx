import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, RefreshCcw, Wind, BookHeart } from "lucide-react";
import { api, useApi } from "@/lib/fakeApi";

const SUGGESTIONS = [
  "I feel anxious about tomorrow",
  "Help me focus for 25 minutes",
  "I can't sleep",
  "I'm having a great day ✨",
];

const AICompanionScreen = () => {
  const messages = useApi(() => api.getAIMessages());
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
    if (messages[messages.length - 1]?.from === "me") {
      setTyping(true);
      const t = setTimeout(() => setTyping(false), 2000);
      return () => clearTimeout(t);
    } else {
      setTyping(false);
    }
  }, [messages]);

  const send = async (text?: string) => {
    const body = (text ?? input).trim();
    if (!body) return;
    setInput("");
    await api.sendAIMessage(body);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[800px] animate-fade-up">
      <header className="px-5 pt-5 pb-3 flex items-center gap-3 border-b border-border">
        <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-tight">Sere · AI Companion</h1>
          <p className="text-[11px] text-calm flex items-center gap-1">● Always here · End-to-end private</p>
        </div>
        <button onClick={() => api.resetAIChat()} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center" aria-label="Reset chat">
          <RefreshCcw className="w-4 h-4" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            {m.from === "ai" && (
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center mr-2 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            )}
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
              m.from === "me" ? "gradient-primary text-primary-foreground rounded-br-sm" : "bg-card text-foreground rounded-bl-sm shadow-card"
            }`}>
              {m.body}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center"><Sparkles className="w-3.5 h-3.5 text-primary-foreground" /></div>
            <div className="bg-card rounded-2xl px-4 py-3 shadow-card flex gap-1">
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => send(s)} className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full">
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="px-3 pb-3 pt-2 border-t border-border bg-background flex items-center gap-2">
        <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center" aria-label="Breathe shortcut"><Wind className="w-4 h-4" /></button>
        <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center" aria-label="Journal shortcut"><BookHeart className="w-4 h-4" /></button>
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Tell Sere how you feel…"
          className="flex-1 bg-secondary/40 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button onClick={() => send()} className="w-11 h-11 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center shadow-soft active:scale-95">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AICompanionScreen;
