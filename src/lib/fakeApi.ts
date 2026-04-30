// Fake backend: simulates an API with latency, persistence (localStorage), and reactive subscriptions.
// Lets the app feel like a real product without a real server.

export type Mood = "great" | "good" | "okay" | "low" | "stressed";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "professional";
  location: string;
  level: number;
  joinedAt: number;
}

export interface MoodEntry {
  id: string;
  mood: Mood;
  createdAt: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  mood: Mood;
  createdAt: number;
}

export interface BreathSession {
  id: string;
  technique: string;
  durationSec: number;
  createdAt: number;
}

export interface Reply {
  id: string;
  author: string;
  body: string;
  createdAt: number;
}

export interface Post {
  id: string;
  author: string;
  body: string;
  tag: string;
  createdAt: number;
  likes: number;
  likedByMe: boolean;
  replies: Reply[];
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  reviews: number;
  online: boolean;
  bio: string;
  pricePerSession: number;
  avatarColor: string; // tailwind gradient class
  initials: string;
}

export interface ChatMessage {
  id: string;
  from: "me" | "doctor";
  body: string;
  createdAt: number;
}

export interface ChatThread {
  doctorId: string;
  messages: ChatMessage[];
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  mood: Mood | "focus" | "sleep";
  durationSec: number;
  color: string; // gradient class
}

export interface AIMessage {
  id: string;
  from: "me" | "ai";
  body: string;
  createdAt: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  goal: number;
  progress: number;
  reward: number; // XP
  type: "breath" | "mood" | "journal" | "music" | "chat";
  done: boolean;
}

interface DB {
  user: User | null;
  moods: MoodEntry[];
  journal: JournalEntry[];
  sessions: BreathSession[];
  posts: Post[];
  chats: Record<string, ChatMessage[]>; // doctorId -> messages
  ai: AIMessage[];
  xp: number;
  quests: Quest[];
  musicPlays: { trackId: string; createdAt: number }[];
  theme: "light" | "dark";
  lastQuestReset: number;
  onboarded: boolean;
}

const KEY = "serenmind.db.v2";

const ANON_NAMES = [
  "Anonymous Fox", "Calm Owl", "Quiet River", "Soft Cloud", "Gentle Pine",
  "Bright Moon", "Still Lake", "Warm Ember", "Kind Wave", "Mindful Sparrow",
];

export const DOCTORS: Doctor[] = [
  {
    id: "d1", name: "Dr. Amina Chen", title: "PhD, Clinical Psychology", specialty: "Anxiety & Stress",
    rating: 4.9, reviews: 312, online: true,
    bio: "10+ years helping young adults manage exam anxiety, burnout, and sleep issues with CBT.",
    pricePerSession: 45, avatarColor: "gradient-primary", initials: "AC",
  },
  {
    id: "d2", name: "Dr. Marco Rivera", title: "MD, Psychiatrist", specialty: "Depression & Mood",
    rating: 4.8, reviews: 198, online: true,
    bio: "Compassionate, evidence-based care. Specializes in mood disorders and life transitions.",
    pricePerSession: 60, avatarColor: "gradient-warm", initials: "MR",
  },
  {
    id: "d3", name: "Dr. Léa Dubois", title: "MSc, Therapist", specialty: "Relationships",
    rating: 4.7, reviews: 142, online: false,
    bio: "Helps couples and individuals build healthier communication patterns.",
    pricePerSession: 40, avatarColor: "gradient-mint", initials: "LD",
  },
  {
    id: "d4", name: "Dr. Yusuf Karim", title: "PsyD, Sleep Specialist", specialty: "Sleep & Insomnia",
    rating: 4.9, reviews: 256, online: true,
    bio: "Sleep-focused CBT-I. Get your nights back, gently.",
    pricePerSession: 50, avatarColor: "bg-accent", initials: "YK",
  },
  {
    id: "d5", name: "Dr. Sara Kim", title: "PhD, Mindfulness Coach", specialty: "Mindfulness",
    rating: 4.8, reviews: 174, online: true,
    bio: "MBSR-certified. Practical mindfulness for busy minds.",
    pricePerSession: 35, avatarColor: "gradient-primary", initials: "SK",
  },
];

export const TRACKS: Track[] = [
  { id: "t1", title: "Ocean Drift", artist: "Lo-Fi Mind", mood: "okay", durationSec: 240, color: "gradient-primary" },
  { id: "t2", title: "Forest Rain", artist: "Nature Lab", mood: "stressed", durationSec: 600, color: "gradient-mint" },
  { id: "t3", title: "Golden Hour", artist: "Cassia Bloom", mood: "good", durationSec: 198, color: "gradient-warm" },
  { id: "t4", title: "Soft Static", artist: "Hush", mood: "sleep", durationSec: 1800, color: "bg-accent" },
  { id: "t5", title: "Deep Focus", artist: "Synapse", mood: "focus", durationSec: 1500, color: "gradient-primary" },
  { id: "t6", title: "Sunday Morning", artist: "Maya Iro", mood: "great", durationSec: 220, color: "gradient-warm" },
  { id: "t7", title: "Slow Heartbeat", artist: "Ambient Co.", mood: "low", durationSec: 360, color: "gradient-mint" },
  { id: "t8", title: "Velvet Sky", artist: "Nori", mood: "okay", durationSec: 280, color: "gradient-primary" },
  { id: "t9", title: "Piano for the Worried", artist: "Eli Park", mood: "stressed", durationSec: 420, color: "bg-accent" },
  { id: "t10", title: "Sunrise Run", artist: "Kova", mood: "great", durationSec: 195, color: "gradient-warm" },
  { id: "t11", title: "Mountain Air", artist: "North Pine", mood: "good", durationSec: 320, color: "gradient-mint" },
  { id: "t12", title: "Lullaby in C", artist: "Hush", mood: "sleep", durationSec: 540, color: "bg-accent" },
];

const seedQuests = (): Quest[] => [
  { id: "q1", title: "Breathe deeply", description: "Complete 1 breathing session", goal: 1, progress: 0, reward: 50, type: "breath", done: false },
  { id: "q2", title: "Check in", description: "Log your mood today", goal: 1, progress: 0, reward: 30, type: "mood", done: false },
  { id: "q3", title: "Reflect", description: "Write a short journal entry", goal: 1, progress: 0, reward: 40, type: "journal", done: false },
  { id: "q4", title: "Tune in", description: "Listen to a calming track", goal: 1, progress: 0, reward: 30, type: "music", done: false },
  { id: "q5", title: "Reach out", description: "Talk with the AI companion", goal: 3, progress: 0, reward: 60, type: "chat", done: false },
];

const seedPosts = (): Post[] => [
  {
    id: "p1", author: "Anonymous Fox",
    body: "Final exams in 2 weeks and I can't sleep. Anyone else feeling this?",
    tag: "Students", createdAt: Date.now() - 12 * 60 * 1000, likes: 24, likedByMe: false,
    replies: [
      { id: "r1", author: "Calm Owl", body: "Same here. Try the 4-7-8 breathing before bed — it really helps me drift off.", createdAt: Date.now() - 8 * 60 * 1000 },
      { id: "r2", author: "Soft Cloud", body: "You're not alone 💙 we'll get through this.", createdAt: Date.now() - 5 * 60 * 1000 },
    ],
  },
  {
    id: "p2", author: "Calm Owl",
    body: "Took a 5-minute break between meetings today using SerenMind. Game changer 🙏",
    tag: "Work", createdAt: Date.now() - 60 * 60 * 1000, likes: 56, likedByMe: true,
    replies: [{ id: "r3", author: "Quiet River", body: "Going to try this tomorrow!", createdAt: Date.now() - 50 * 60 * 1000 }],
  },
  {
    id: "p3", author: "Quiet River",
    body: "I struggle to say no at work and it leaves me drained every evening. How do you set boundaries?",
    tag: "Work", createdAt: Date.now() - 3 * 60 * 60 * 1000, likes: 41, likedByMe: false, replies: [],
  },
  {
    id: "p4", author: "Soft Cloud",
    body: "Started journaling 7 days ago. Already noticing patterns in my stress triggers.",
    tag: "Wellbeing", createdAt: Date.now() - 5 * 60 * 60 * 1000, likes: 32, likedByMe: false, replies: [],
  },
];

const seedJournal = (): JournalEntry[] => {
  const now = Date.now(); const day = 24 * 60 * 60 * 1000;
  return [
    { id: "j1", mood: "good", title: "Got through the algorithms exam", body: "Felt nervous this morning but the breathing exercise helped me focus.", createdAt: now - day * 0.2 },
    { id: "j2", mood: "low", title: "Project deadline pressure", body: "Too many things at once. Talking to the circle made it easier.", createdAt: now - day * 1 },
    { id: "j3", mood: "great", title: "Long walk after class", body: "Sun, music, and no notifications. Best decision today.", createdAt: now - day * 2 },
  ];
};

const seedMoods = (): MoodEntry[] => {
  const now = Date.now(); const day = 24 * 60 * 60 * 1000;
  const arr: Mood[] = ["okay", "good", "low", "good", "okay", "great", "good"];
  return arr.map((mood, i) => ({ id: `m${i}`, mood, createdAt: now - (6 - i) * day + 9 * 60 * 60 * 1000 }));
};

const seedSessions = (): BreathSession[] => {
  const now = Date.now(); const day = 24 * 60 * 60 * 1000;
  return [
    { id: "s1", technique: "Box breathing", durationSec: 300, createdAt: now - day * 0.1 },
    { id: "s2", technique: "4-7-8 Calming", durationSec: 240, createdAt: now - day * 1.2 },
    { id: "s3", technique: "Box breathing", durationSec: 480, createdAt: now - day * 2.1 },
    { id: "s4", technique: "Triangle Focus", durationSec: 180, createdAt: now - day * 3.3 },
  ];
};

const seedAI = (): AIMessage[] => [
  { id: "a0", from: "ai", createdAt: Date.now() - 60 * 1000,
    body: "Hi, I'm Sere — your AI companion 🌿\nI'm here to listen, reflect, and help you build small habits. How is your mind today?" },
];

const seed = (): DB => ({
  user: null,
  moods: seedMoods(),
  journal: seedJournal(),
  sessions: seedSessions(),
  posts: seedPosts(),
  chats: {},
  ai: seedAI(),
  xp: 120,
  quests: seedQuests(),
  musicPlays: [],
  theme: "light",
  lastQuestReset: new Date().setHours(0, 0, 0, 0),
});

let db: DB = (() => {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DB>;
      // Merge with seed for forward compatibility
      const base = seed();
      return { ...base, ...parsed, quests: parsed.quests?.length ? parsed.quests : base.quests };
    }
  } catch {}
  const initial = seed();
  localStorage.setItem(KEY, JSON.stringify(initial));
  return initial;
})();

const listeners = new Set<() => void>();
const persist = () => {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {}
  listeners.forEach((l) => l());
};

export const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
};

let dbVersion = 0;
const bumpVersion = () => { dbVersion++; };
listeners.add(bumpVersion);
export const getVersion = () => dbVersion;

const delay = (min = 180, max = 480) =>
  new Promise<void>((r) => setTimeout(r, Math.random() * (max - min) + min));

const id = () => Math.random().toString(36).slice(2, 10);

// Apply theme to <html>
const applyTheme = (theme: "light" | "dark") => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
};
if (typeof window !== "undefined") applyTheme(db.theme);

// Reset daily quests if a new day
const maybeResetQuests = () => {
  const today = new Date().setHours(0, 0, 0, 0);
  if (db.lastQuestReset !== today) {
    db.quests = seedQuests();
    db.lastQuestReset = today;
    persist();
  }
};
maybeResetQuests();

// Quest progress helper
const advanceQuest = (type: Quest["type"], amount = 1) => {
  const q = db.quests.find((x) => x.type === type && !x.done);
  if (!q) return;
  q.progress = Math.min(q.goal, q.progress + amount);
  if (q.progress >= q.goal) {
    q.done = true;
    db.xp += q.reward;
  }
};

// Doctor canned replies based on keywords (very simple "AI")
const doctorReply = (msg: string, doctor: Doctor): string => {
  const lower = msg.toLowerCase();
  if (/sleep|insomnia|tired/.test(lower))
    return `Sleep is foundational. Let's try a 4-7-8 breath for 5 minutes tonight, and avoid screens 30 min before bed. How does that sound?`;
  if (/anx|stress|panic|worry/.test(lower))
    return `That sounds heavy. Let's name what's most pressing first — can you describe one situation that triggered it today?`;
  if (/sad|down|depress|empty|low/.test(lower))
    return `Thank you for sharing. Low mood often eases with small, kind actions. What's one tiny thing you could do today that you'd be proud of?`;
  if (/exam|study|school|work/.test(lower))
    return `Performance pressure is real. We can work on a 25-min focus + 5-min breathing cycle. Want me to set that up for you?`;
  return `Hi, I'm ${doctor.name}. I hear you. Could you tell me a little more so I can help in the right direction?`;
};

// AI Companion replies — slightly richer, multi-line
const aiReply = (msg: string, history: AIMessage[]): string => {
  const lower = msg.toLowerCase();
  const moodHits = history.filter((m) => m.from === "me").length;
  const opener = moodHits > 5 ? "I'm glad you're staying with this. " : "";
  if (/hello|hi|hey/.test(lower)) return `${opener}Hello 🌱 What's on your mind today?`;
  if (/thank/.test(lower)) return `Always here. Want to set a tiny goal for the next hour?`;
  if (/sleep|tired|insomnia/.test(lower))
    return `${opener}Sleep matters. Try this tonight:\n• 4-7-8 breath × 4\n• Lights low after 10pm\n• A short body-scan\nWant me to start the breath now?`;
  if (/anx|stress|overwhelm/.test(lower))
    return `${opener}Let's slow this down together. Name 3 things you can see, 2 you can hear, 1 you can feel. I'll wait. 🤍`;
  if (/sad|low|empty|cry/.test(lower))
    return `${opener}That's a lot to carry. You don't have to fix it right now — just notice it. Would writing one sentence in your journal feel ok?`;
  if (/focus|study|work|deadline/.test(lower))
    return `Try a 25/5 cycle: 25 min deep work, 5 min walk + breath. Want me to coach you through it?`;
  if (/happy|good|great/.test(lower))
    return `Love that ✨ What's one small thing you want to remember about today?`;
  return `${opener}I'm listening. Tell me a little more — what feels biggest right now?`;
};

// ---------- API ----------
export const api = {
  // ---------- Auth ----------
  async signIn(opts: { name: string; email: string; role: "student" | "professional"; location: string }) {
    await delay();
    db.user = { id: id(), name: opts.name, email: opts.email, role: opts.role, location: opts.location, level: 4, joinedAt: Date.now() };
    persist();
    return db.user;
  },
  async signOut() { await delay(120, 220); db.user = null; persist(); },
  getUser(): User | null { return db.user; },

  // ---------- Theme ----------
  getTheme(): "light" | "dark" { return db.theme; },
  toggleTheme() {
    db.theme = db.theme === "dark" ? "light" : "dark";
    applyTheme(db.theme);
    persist();
  },

  // ---------- Moods ----------
  async logMood(mood: Mood) {
    await delay(150, 350);
    const today = new Date().setHours(0, 0, 0, 0);
    db.moods = db.moods.filter((m) => new Date(m.createdAt).setHours(0, 0, 0, 0) !== today);
    db.moods.push({ id: id(), mood, createdAt: Date.now() });
    advanceQuest("mood");
    persist();
  },
  getMoods(): MoodEntry[] { return [...db.moods].sort((a, b) => a.createdAt - b.createdAt); },
  getTodayMood(): Mood | null {
    const today = new Date().setHours(0, 0, 0, 0);
    return db.moods.find((m) => new Date(m.createdAt).setHours(0, 0, 0, 0) === today)?.mood ?? null;
  },

  // ---------- Journal ----------
  async addJournal(entry: { title: string; body: string; mood: Mood }) {
    await delay();
    db.journal.unshift({ id: id(), createdAt: Date.now(), ...entry });
    advanceQuest("journal");
    persist();
  },
  async deleteJournal(entryId: string) {
    await delay(120, 220);
    db.journal = db.journal.filter((j) => j.id !== entryId);
    persist();
  },
  getJournal(): JournalEntry[] { return [...db.journal].sort((a, b) => b.createdAt - a.createdAt); },

  // ---------- Sessions ----------
  async logSession(s: { technique: string; durationSec: number }) {
    await delay(120, 220);
    db.sessions.unshift({ id: id(), createdAt: Date.now(), ...s });
    advanceQuest("breath");
    persist();
  },
  getSessions(): BreathSession[] { return [...db.sessions].sort((a, b) => b.createdAt - a.createdAt); },
  getStreak(): number {
    const days = new Set<string>();
    [...db.sessions, ...db.moods].forEach((x) => {
      const d = new Date(x.createdAt); d.setHours(0, 0, 0, 0);
      days.add(d.toISOString());
    });
    let streak = 0;
    const cursor = new Date(); cursor.setHours(0, 0, 0, 0);
    while (days.has(cursor.toISOString())) { streak++; cursor.setDate(cursor.getDate() - 1); }
    return streak;
  },
  getTotalMinutes(): number { return Math.round(db.sessions.reduce((a, s) => a + s.durationSec, 0) / 60); },
  getTodayMinutes(): number {
    const today = new Date().setHours(0, 0, 0, 0);
    return Math.round(db.sessions.filter((s) => new Date(s.createdAt).setHours(0, 0, 0, 0) === today).reduce((a, s) => a + s.durationSec, 0) / 60);
  },

  // ---------- Community ----------
  getPosts(filter = "All"): Post[] {
    const list = filter === "All" ? db.posts : db.posts.filter((p) => p.tag === filter);
    return [...list].sort((a, b) => b.createdAt - a.createdAt);
  },
  async addPost(body: string, tag: string) {
    await delay();
    const author = ANON_NAMES[Math.floor(Math.random() * ANON_NAMES.length)];
    db.posts.unshift({ id: id(), author, body, tag, createdAt: Date.now(), likes: 0, likedByMe: false, replies: [] });
    persist();
  },
  async toggleLike(postId: string) {
    await delay(80, 160);
    const p = db.posts.find((x) => x.id === postId);
    if (!p) return;
    p.likedByMe = !p.likedByMe; p.likes += p.likedByMe ? 1 : -1;
    persist();
  },
  async addReply(postId: string, body: string) {
    await delay();
    const p = db.posts.find((x) => x.id === postId);
    if (!p) return;
    p.replies.push({ id: id(), author: "You (anonymous)", body, createdAt: Date.now() });
    persist();
    setTimeout(() => {
      const friend = ANON_NAMES[Math.floor(Math.random() * ANON_NAMES.length)];
      const supportive = ["Sending you good vibes 💙", "You're not alone in this.", "Thanks for sharing — that takes courage.", "I hear you. Try a small breathing break and check back in."];
      p.replies.push({ id: id(), author: friend, body: supportive[Math.floor(Math.random() * supportive.length)], createdAt: Date.now() });
      persist();
    }, 2500 + Math.random() * 2000);
  },

  // ---------- Doctors / Chat ----------
  getDoctors(query = ""): Doctor[] {
    if (!query.trim()) return DOCTORS;
    const q = query.toLowerCase();
    return DOCTORS.filter((d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q));
  },
  getDoctor(doctorId: string): Doctor | undefined { return DOCTORS.find((d) => d.id === doctorId); },
  getChat(doctorId: string): ChatMessage[] {
    if (!db.chats[doctorId]) {
      db.chats[doctorId] = [
        {
          id: id(), from: "doctor", createdAt: Date.now() - 60 * 1000,
          body: `Hi, I'm ${DOCTORS.find((d) => d.id === doctorId)?.name}. This is a safe space — what brings you here today?`,
        },
      ];
      persist();
    }
    return db.chats[doctorId];
  },
  async sendDoctorMessage(doctorId: string, body: string) {
    await delay(80, 160);
    const doc = DOCTORS.find((d) => d.id === doctorId)!;
    if (!db.chats[doctorId]) db.chats[doctorId] = [];
    db.chats[doctorId].push({ id: id(), from: "me", body, createdAt: Date.now() });
    persist();
    setTimeout(() => {
      db.chats[doctorId].push({ id: id(), from: "doctor", body: doctorReply(body, doc), createdAt: Date.now() });
      persist();
    }, 1400 + Math.random() * 1600);
  },

  // ---------- Music ----------
  getTracks(query = "", filter: "all" | Mood | "focus" | "sleep" = "all"): Track[] {
    let list = TRACKS;
    if (filter !== "all") list = list.filter((t) => t.mood === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q));
    }
    return list;
  },
  async logPlay(trackId: string) {
    await delay(60, 120);
    db.musicPlays.unshift({ trackId, createdAt: Date.now() });
    advanceQuest("music");
    persist();
  },
  getRecentPlays(): { track: Track; createdAt: number }[] {
    return db.musicPlays.slice(0, 5).map((p) => ({ track: TRACKS.find((t) => t.id === p.trackId)!, createdAt: p.createdAt })).filter((x) => x.track);
  },

  // ---------- AI Companion ----------
  getAIMessages(): AIMessage[] { return db.ai; },
  async sendAIMessage(body: string) {
    await delay(80, 160);
    db.ai.push({ id: id(), from: "me", body, createdAt: Date.now() });
    persist();
    advanceQuest("chat");
    setTimeout(() => {
      const reply = aiReply(body, db.ai);
      db.ai.push({ id: id(), from: "ai", body: reply, createdAt: Date.now() });
      persist();
    }, 900 + Math.random() * 900);
  },
  async resetAIChat() {
    await delay(80, 160);
    db.ai = seedAI();
    persist();
  },

  // ---------- Gamification ----------
  getXP(): number { return db.xp; },
  getLevel(): { level: number; progressPct: number; current: number; nextAt: number } {
    const xp = db.xp;
    const level = Math.floor(xp / 200) + 1;
    const current = xp % 200;
    return { level, progressPct: (current / 200) * 100, current, nextAt: 200 };
  },
  getQuests(): Quest[] { maybeResetQuests(); return db.quests; },

  // ---------- Dashboard analytics ----------
  getDashboard() {
    const last7 = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - i));
      const next = d.getTime() + 24 * 60 * 60 * 1000;
      const moods = db.moods.filter((m) => m.createdAt >= d.getTime() && m.createdAt < next);
      const sessions = db.sessions.filter((s) => s.createdAt >= d.getTime() && s.createdAt < next);
      const journals = db.journal.filter((j) => j.createdAt >= d.getTime() && j.createdAt < next);
      const moodScore = moods.length
        ? moods.reduce((a, m) => a + ({ great: 5, good: 4, okay: 3, low: 2, stressed: 1 } as Record<Mood, number>)[m.mood], 0) / moods.length
        : 0;
      return {
        date: d, label: d.toLocaleDateString(undefined, { weekday: "short" }),
        moodScore, minutes: Math.round(sessions.reduce((a, s) => a + s.durationSec, 0) / 60),
        journals: journals.length,
      };
    });
    const moodCounts = (["great", "good", "okay", "low", "stressed"] as Mood[]).map((m) => ({
      mood: m, count: db.moods.filter((x) => x.mood === m).length,
    }));
    return {
      last7, moodCounts,
      totals: { sessions: db.sessions.length, journals: db.journal.length, minutes: Math.round(db.sessions.reduce((a, s) => a + s.durationSec, 0) / 60), moods: db.moods.length },
    };
  },
};

import { useSyncExternalStore, useRef, useCallback } from "react";
export function useApi<T>(selector: () => T): T {
  const cache = useRef<{ version: number; value: T } | null>(null);
  const getSnapshot = useCallback(() => {
    const v = getVersion();
    if (!cache.current || cache.current.version !== v) {
      cache.current = { version: v, value: selector() };
    }
    return cache.current.value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
