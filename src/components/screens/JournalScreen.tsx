import { useState } from "react";
import { Plus, Smile } from "lucide-react";

const sample = [
  { date: "Today", mood: "🙂", title: "Got through the algorithms exam", body: "Felt nervous this morning but the breathing exercise helped me focus." },
  { date: "Yesterday", mood: "😟", title: "Project deadline pressure", body: "Too many things at once. Talking to the circle made it easier." },
  { date: "2 days ago", mood: "😄", title: "Long walk after class", body: "Sun, music, and no notifications. Best decision today." },
];

const JournalScreen = () => {
  const [composing, setComposing] = useState(false);
  const [text, setText] = useState("");

  return (
    <div className="px-5 pt-6 pb-4 animate-fade-up">
      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Journal</h1>
          <p className="text-sm text-muted-foreground">Track how you feel, day by day</p>
        </div>
        <button
          onClick={() => setComposing((c) => !c)}
          className="w-11 h-11 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center shadow-glow transition-bounce active:scale-90"
          aria-label="New entry"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {composing && (
        <div className="mb-6 bg-card rounded-3xl p-4 shadow-soft border border-border animate-fade-up">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full bg-transparent outline-none resize-none text-foreground placeholder:text-muted-foreground"
          />
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
            <div className="flex gap-1.5">
              {["😄","🙂","😐","😟","😣"].map((e) => (
                <button key={e} className="w-9 h-9 rounded-xl hover:bg-secondary transition-smooth text-xl">{e}</button>
              ))}
            </div>
            <button
              onClick={() => { setComposing(false); setText(""); }}
              className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Weekly mood chart */}
      <section className="bg-card rounded-3xl p-5 shadow-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">This week</p>
            <p className="font-semibold flex items-center gap-1.5"><Smile className="w-4 h-4 text-calm" /> Feeling lighter</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-calm/20 text-calm font-medium">+18%</span>
        </div>
        <div className="flex items-end justify-between gap-2 h-28">
          {[40, 55, 30, 70, 50, 85, 75].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full rounded-xl gradient-primary opacity-90"
                style={{ height: `${h}%` }}
              />
              <span className="text-[10px] text-muted-foreground">{["M","T","W","T","F","S","S"][i]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Entries */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Recent entries</h2>
        {sample.map((e, i) => (
          <article key={i} className="bg-card rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">{e.date}</span>
              <span className="text-xl">{e.mood}</span>
            </div>
            <h3 className="font-semibold text-foreground">{e.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{e.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default JournalScreen;
