import { Heart, MessageCircle, Shield } from "lucide-react";

const posts = [
  { name: "Anonymous Fox", time: "12m", body: "Final exams in 2 weeks and I can't sleep. Anyone else feeling this?", likes: 24, replies: 8, tag: "Students" },
  { name: "Calm Owl", time: "1h", body: "Took a 5-minute break between meetings today using SerenMind. Game changer 🙏", likes: 56, replies: 12, tag: "Work" },
  { name: "Quiet River", time: "3h", body: "I struggle to say no at work and it leaves me drained every evening. How do you set boundaries?", likes: 41, replies: 19, tag: "Work" },
  { name: "Soft Cloud", time: "5h", body: "Started journaling 7 days ago. Already noticing patterns in my stress triggers.", likes: 32, replies: 5, tag: "Wellbeing" },
];

const CommunityScreen = () => (
  <div className="px-5 pt-6 pb-4 animate-fade-up">
    <header className="mb-5">
      <h1 className="text-2xl font-bold">The Circle</h1>
      <p className="text-sm text-muted-foreground">A safe, anonymous space to share</p>
    </header>

    <div className="bg-secondary/50 rounded-2xl p-3 flex items-start gap-3 mb-5">
      <Shield className="w-5 h-5 text-calm shrink-0 mt-0.5" />
      <p className="text-xs text-secondary-foreground leading-relaxed">
        All posts are anonymous and moderated. Be kind, be honest — you&apos;re not alone here.
      </p>
    </div>

    {/* Filter chips */}
    <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
      {["All", "Students", "Work", "Wellbeing", "Sleep"].map((c, i) => (
        <button
          key={c}
          className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-smooth ${
            i === 0 ? "gradient-primary text-primary-foreground shadow-soft" : "bg-card text-muted-foreground"
          }`}
        >
          {c}
        </button>
      ))}
    </div>

    {/* Posts */}
    <div className="space-y-3">
      {posts.map((p, i) => (
        <article key={i} className="bg-card rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-mint" />
              <div>
                <p className="text-sm font-semibold leading-tight">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">{p.time} · {p.tag}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-3">{p.body}</p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <button className="flex items-center gap-1.5 text-xs hover:text-destructive transition-smooth">
              <Heart className="w-4 h-4" /> {p.likes}
            </button>
            <button className="flex items-center gap-1.5 text-xs hover:text-primary transition-smooth">
              <MessageCircle className="w-4 h-4" /> {p.replies}
            </button>
          </div>
        </article>
      ))}
    </div>
  </div>
);

export default CommunityScreen;
