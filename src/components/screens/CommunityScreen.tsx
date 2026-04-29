import { useState } from "react";
import { Heart, MessageCircle, Shield, Send, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api, useApi, type Post } from "@/lib/fakeApi";

const tags = ["All", "Students", "Work", "Wellbeing", "Sleep"];

const formatTime = (ts: number) => {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};

const CommunityScreen = () => {
  const [filter, setFilter] = useState("All");
  const posts = useApi(() => api.getPosts(filter));
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftTag, setDraftTag] = useState("Wellbeing");
  const [posting, setPosting] = useState(false);

  const submit = async () => {
    if (!draft.trim()) return;
    setPosting(true);
    await api.addPost(draft.trim(), draftTag);
    setPosting(false);
    setDraft(""); setComposing(false);
    toast.success("Posted anonymously");
  };

  return (
    <div className="px-5 pt-6 pb-4 animate-fade-up">
      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">The Circle</h1>
          <p className="text-sm text-muted-foreground">A safe, anonymous space to share</p>
        </div>
        <button onClick={() => setComposing((c) => !c)}
          className="w-11 h-11 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center shadow-glow transition-bounce active:scale-90">
          <Plus className={`w-5 h-5 transition-bounce ${composing ? "rotate-45" : ""}`} />
        </button>
      </header>

      <div className="bg-secondary/50 rounded-2xl p-3 flex items-start gap-3 mb-5">
        <Shield className="w-5 h-5 text-calm shrink-0 mt-0.5" />
        <p className="text-xs text-secondary-foreground leading-relaxed">
          All posts are anonymous and moderated. Be kind, be honest — you&apos;re not alone here.
        </p>
      </div>

      {composing && (
        <div className="mb-5 bg-card rounded-3xl p-4 shadow-soft border border-border animate-fade-up">
          <textarea
            value={draft} onChange={(e) => setDraft(e.target.value)}
            placeholder="Share what's on your mind…"
            rows={3}
            className="w-full bg-transparent outline-none resize-none text-foreground placeholder:text-muted-foreground"
          />
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
            <select value={draftTag} onChange={(e) => setDraftTag(e.target.value)}
              className="bg-secondary text-secondary-foreground text-xs rounded-full px-3 py-1.5 outline-none">
              {tags.slice(1).map((t) => <option key={t}>{t}</option>)}
            </select>
            <button onClick={submit} disabled={posting || !draft.trim()}
              className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 disabled:opacity-50">
              {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Post
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
        {tags.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-smooth ${
              filter === c ? "gradient-primary text-primary-foreground shadow-soft" : "bg-card text-muted-foreground"
            }`}>
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {posts.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">No posts in this category yet.</p>
        )}
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
};

const PostCard = ({ post }: { post: Post }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    await api.addReply(post.id, reply.trim());
    setSending(false);
    setReply("");
    toast.success("Reply sent");
  };

  return (
    <article className="bg-card rounded-2xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full gradient-mint" />
          <div>
            <p className="text-sm font-semibold leading-tight">{post.author}</p>
            <p className="text-[10px] text-muted-foreground">{formatTime(post.createdAt)} · {post.tag}</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-foreground leading-relaxed mb-3">{post.body}</p>
      <div className="flex items-center gap-4 text-muted-foreground">
        <button onClick={() => api.toggleLike(post.id)}
          className={`flex items-center gap-1.5 text-xs transition-smooth ${post.likedByMe ? "text-destructive" : "hover:text-destructive"}`}>
          <Heart className={`w-4 h-4 ${post.likedByMe ? "fill-current" : ""}`} /> {post.likes}
        </button>
        <button onClick={() => setShowReplies((s) => !s)}
          className="flex items-center gap-1.5 text-xs hover:text-primary transition-smooth">
          <MessageCircle className="w-4 h-4" /> {post.replies.length}
        </button>
      </div>

      {showReplies && (
        <div className="mt-3 pt-3 border-t border-border space-y-2 animate-fade-up">
          {post.replies.map((r) => (
            <div key={r.id} className="flex gap-2 text-sm">
              <div className="w-6 h-6 rounded-full gradient-primary shrink-0" />
              <div className="bg-secondary/60 rounded-2xl px-3 py-2 flex-1">
                <p className="text-[11px] font-semibold">{r.author}</p>
                <p className="text-xs text-foreground/90 leading-relaxed">{r.body}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <input value={reply} onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendReply(); }}
              placeholder="Write a kind reply…"
              className="flex-1 bg-secondary/50 rounded-full px-4 py-2 text-sm outline-none" />
            <button onClick={sendReply} disabled={sending || !reply.trim()}
              className="w-9 h-9 rounded-full gradient-primary text-primary-foreground flex items-center justify-center disabled:opacity-50">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

export default CommunityScreen;
