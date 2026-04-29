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

interface DB {
  user: User | null;
  moods: MoodEntry[];
  journal: JournalEntry[];
  sessions: BreathSession[];
  posts: Post[];
}

const KEY = "serenmind.db.v1";

const ANON_NAMES = [
  "Anonymous Fox", "Calm Owl", "Quiet River", "Soft Cloud", "Gentle Pine",
  "Bright Moon", "Still Lake", "Warm Ember", "Kind Wave", "Mindful Sparrow",
];

const seedPosts = (): Post[] => [
  {
    id: "p1",
    author: "Anonymous Fox",
    body: "Final exams in 2 weeks and I can't sleep. Anyone else feeling this?",
    tag: "Students",
    createdAt: Date.now() - 12 * 60 * 1000,
    likes: 24,
    likedByMe: false,
    replies: [
      { id: "r1", author: "Calm Owl", body: "Same here. Try the 4-7-8 breathing before bed — it really helps me drift off.", createdAt: Date.now() - 8 * 60 * 1000 },
      { id: "r2", author: "Soft Cloud", body: "You're not alone 💙 we'll get through this.", createdAt: Date.now() - 5 * 60 * 1000 },
    ],
  },
  {
    id: "p2",
    author: "Calm Owl",
    body: "Took a 5-minute break between meetings today using SerenMind. Game changer 🙏",
    tag: "Work",
    createdAt: Date.now() - 60 * 60 * 1000,
    likes: 56, likedByMe: true,
    replies: [
      { id: "r3", author: "Quiet River", body: "Going to try this tomorrow!", createdAt: Date.now() - 50 * 60 * 1000 },
    ],
  },
  {
    id: "p3",
    author: "Quiet River",
    body: "I struggle to say no at work and it leaves me drained every evening. How do you set boundaries?",
    tag: "Work",
    createdAt: Date.now() - 3 * 60 * 60 * 1000,
    likes: 41, likedByMe: false, replies: [],
  },
  {
    id: "p4",
    author: "Soft Cloud",
    body: "Started journaling 7 days ago. Already noticing patterns in my stress triggers.",
    tag: "Wellbeing",
    createdAt: Date.now() - 5 * 60 * 60 * 1000,
    likes: 32, likedByMe: false, replies: [],
  },
];

const seedJournal = (): JournalEntry[] => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  return [
    { id: "j1", mood: "good", title: "Got through the algorithms exam", body: "Felt nervous this morning but the breathing exercise helped me focus.", createdAt: now - day * 0.2 },
    { id: "j2", mood: "low", title: "Project deadline pressure", body: "Too many things at once. Talking to the circle made it easier.", createdAt: now - day * 1 },
    { id: "j3", mood: "great", title: "Long walk after class", body: "Sun, music, and no notifications. Best decision today.", createdAt: now - day * 2 },
  ];
};

const seedMoods = (): MoodEntry[] => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const arr: Mood[] = ["okay", "good", "low", "good", "okay", "great", "good"];
  return arr.map((mood, i) => ({ id: `m${i}`, mood, createdAt: now - (6 - i) * day + 9 * 60 * 60 * 1000 }));
};

const seedSessions = (): BreathSession[] => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  return [
    { id: "s1", technique: "Box breathing", durationSec: 300, createdAt: now - day * 0.1 },
    { id: "s2", technique: "4-7-8 Calming", durationSec: 240, createdAt: now - day * 1.2 },
    { id: "s3", technique: "Box breathing", durationSec: 480, createdAt: now - day * 2.1 },
    { id: "s4", technique: "Triangle Focus", durationSec: 180, createdAt: now - day * 3.3 },
  ];
};

const seed = (): DB => ({
  user: null,
  moods: seedMoods(),
  journal: seedJournal(),
  sessions: seedSessions(),
  posts: seedPosts(),
});

let db: DB = (() => {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as DB;
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
  return () => listeners.delete(cb);
};

const delay = (min = 180, max = 480) =>
  new Promise<void>((r) => setTimeout(r, Math.random() * (max - min) + min));

const id = () => Math.random().toString(36).slice(2, 10);

// ---------- Auth ----------
export const api = {
  // ---------- Auth ----------
  async signIn(opts: { name: string; email: string; role: "student" | "professional"; location: string }) {
    await delay();
    db.user = {
      id: id(),
      name: opts.name,
      email: opts.email,
      role: opts.role,
      location: opts.location,
      level: 4,
      joinedAt: Date.now(),
    };
    persist();
    return db.user;
  },
  async signOut() {
    await delay(120, 220);
    db.user = null;
    persist();
  },
  getUser(): User | null {
    return db.user;
  },

  // ---------- Moods ----------
  async logMood(mood: Mood) {
    await delay(150, 350);
    // Replace today's mood if exists
    const today = new Date().setHours(0, 0, 0, 0);
    db.moods = db.moods.filter((m) => new Date(m.createdAt).setHours(0, 0, 0, 0) !== today);
    db.moods.push({ id: id(), mood, createdAt: Date.now() });
    persist();
  },
  getMoods(): MoodEntry[] {
    return [...db.moods].sort((a, b) => a.createdAt - b.createdAt);
  },
  getTodayMood(): Mood | null {
    const today = new Date().setHours(0, 0, 0, 0);
    return db.moods.find((m) => new Date(m.createdAt).setHours(0, 0, 0, 0) === today)?.mood ?? null;
  },

  // ---------- Journal ----------
  async addJournal(entry: { title: string; body: string; mood: Mood }) {
    await delay();
    db.journal.unshift({ id: id(), createdAt: Date.now(), ...entry });
    persist();
  },
  async deleteJournal(entryId: string) {
    await delay(120, 220);
    db.journal = db.journal.filter((j) => j.id !== entryId);
    persist();
  },
  getJournal(): JournalEntry[] {
    return [...db.journal].sort((a, b) => b.createdAt - a.createdAt);
  },

  // ---------- Sessions ----------
  async logSession(s: { technique: string; durationSec: number }) {
    await delay(120, 220);
    db.sessions.unshift({ id: id(), createdAt: Date.now(), ...s });
    persist();
  },
  getSessions(): BreathSession[] {
    return [...db.sessions].sort((a, b) => b.createdAt - a.createdAt);
  },
  getStreak(): number {
    // Consecutive days (going back from today) that contain at least one session OR mood
    const days = new Set<string>();
    [...db.sessions, ...db.moods].forEach((x) => {
      const d = new Date(x.createdAt);
      d.setHours(0, 0, 0, 0);
      days.add(d.toISOString());
    });
    let streak = 0;
    const cursor = new Date(); cursor.setHours(0, 0, 0, 0);
    while (days.has(cursor.toISOString())) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  },
  getTotalMinutes(): number {
    return Math.round(db.sessions.reduce((a, s) => a + s.durationSec, 0) / 60);
  },
  getTodayMinutes(): number {
    const today = new Date().setHours(0, 0, 0, 0);
    return Math.round(
      db.sessions
        .filter((s) => new Date(s.createdAt).setHours(0, 0, 0, 0) === today)
        .reduce((a, s) => a + s.durationSec, 0) / 60
    );
  },

  // ---------- Community ----------
  getPosts(filter = "All"): Post[] {
    const list = filter === "All" ? db.posts : db.posts.filter((p) => p.tag === filter);
    return [...list].sort((a, b) => b.createdAt - a.createdAt);
  },
  async addPost(body: string, tag: string) {
    await delay();
    const author = ANON_NAMES[Math.floor(Math.random() * ANON_NAMES.length)];
    db.posts.unshift({
      id: id(), author, body, tag,
      createdAt: Date.now(), likes: 0, likedByMe: false, replies: [],
    });
    persist();
  },
  async toggleLike(postId: string) {
    await delay(80, 160);
    const p = db.posts.find((x) => x.id === postId);
    if (!p) return;
    p.likedByMe = !p.likedByMe;
    p.likes += p.likedByMe ? 1 : -1;
    persist();
  },
  async addReply(postId: string, body: string) {
    await delay();
    const p = db.posts.find((x) => x.id === postId);
    if (!p) return;
    p.replies.push({ id: id(), author: "You (anonymous)", body, createdAt: Date.now() });
    persist();
    // Simulate a supportive auto-reply after a delay
    setTimeout(() => {
      const friend = ANON_NAMES[Math.floor(Math.random() * ANON_NAMES.length)];
      const supportive = [
        "Sending you good vibes 💙",
        "You're not alone in this.",
        "Thanks for sharing — that takes courage.",
        "I hear you. Try a small breathing break and check back in.",
      ];
      p.replies.push({
        id: id(), author: friend,
        body: supportive[Math.floor(Math.random() * supportive.length)],
        createdAt: Date.now(),
      });
      persist();
    }, 2500 + Math.random() * 2000);
  },
};

// React hook to re-render on db changes
import { useSyncExternalStore } from "react";
export function useApi<T>(selector: () => T): T {
  return useSyncExternalStore(
    (cb) => subscribe(cb),
    selector,
    selector,
  );
}
