/**
 * NoteBoard — 笺
 * Shared message board backed by a notes.json file in the GitHub repo.
 * Uses GitHub Contents API to read/write notes — works on Cloudflare Pages (static).
 */

import { useRef, useEffect, useState, useCallback, KeyboardEvent } from "react";
import { Feather, Trash2, Send, RefreshCw } from "lucide-react";

// ── GitHub config ────────────────────────────────────────────────────────────
const GH_TOKEN = "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";
const GH_REPO  = "xhc0411abcdef-del/xhc-memories";
const GH_FILE  = "notes.json";
const GH_API   = `https://api.github.com/repos/${GH_REPO}/contents/${GH_FILE}`;
// ─────────────────────────────────────────────────────────────────────────────

type Sender = "me" | "you";

interface Note {
  id: string;
  sender: Sender;
  text: string;
  createdAt: string; // ISO string
}

const SENDER_LABELS: Record<Sender, string> = { me: "我", you: "你" };

const SENDER_COLORS: Record<Sender, { bubble: string; text: string; label: string }> = {
  me: {
    bubble: "oklch(0.92 0.06 10)",
    text:   "oklch(0.28 0.04 15)",
    label:  "oklch(0.65 0.12 10)",
  },
  you: {
    bubble: "oklch(0.93 0.04 220)",
    text:   "oklch(0.25 0.05 220)",
    label:  "oklch(0.52 0.14 220)",
  },
};

// ── GitHub helpers ────────────────────────────────────────────────────────────

async function fetchNotes(): Promise<{ notes: Note[]; sha: string }> {
  const res = await fetch(GH_API, {
    headers: {
      Authorization: `token ${GH_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
    // bypass browser cache so we always get the latest
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub fetch failed: ${res.status}`);
  const data = await res.json();
  const content = atob(data.content.replace(/\n/g, ""));
  const notes: Note[] = JSON.parse(content);
  return { notes, sha: data.sha };
}

async function saveNotes(notes: Note[], sha: string): Promise<string> {
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(notes, null, 2))));
  const res = await fetch(GH_API, {
    method: "PUT",
    headers: {
      Authorization: `token ${GH_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "feat: update notes",
      content,
      sha,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub save failed: ${res.status}`);
  }
  const data = await res.json();
  return data.content.sha;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NoteBoard() {
  const [notes, setNotes]       = useState<Note[]>([]);
  const [sha, setSha]           = useState<string>("");
  const [sender, setSender]     = useState<Sender>("me");
  const [input, setInput]       = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const { notes: n, sha: s } = await fetchNotes();
      setNotes(n);
      setSha(s);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + poll every 15 seconds
  useEffect(() => {
    load();
    const timer = setInterval(() => load(true), 15000);
    return () => clearInterval(timer);
  }, [load]);

  // Scroll to bottom on new notes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notes.length]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || saving) return;
    setSaving(true);
    setError(null);
    try {
      // Re-fetch latest sha before writing to avoid conflicts
      const { notes: latest, sha: latestSha } = await fetchNotes();
      const newNote: Note = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender,
        text,
        createdAt: new Date().toISOString(),
      };
      const updated = [...latest, newNote];
      const newSha = await saveNotes(updated, latestSha);
      setNotes(updated);
      setSha(newSha);
      setInput("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "发送失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      const { notes: latest, sha: latestSha } = await fetchNotes();
      const updated = latest.filter((n) => n.id !== id);
      const newSha = await saveNotes(updated, latestSha);
      setNotes(updated);
      setSha(newSha);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "删除失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100vh - 140px)", background: "oklch(0.99 0.003 30)" }}
    >
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-16">
              <RefreshCw
                className="w-6 h-6 animate-spin"
                style={{ color: "oklch(0.72 0.06 40)" }}
              />
            </div>
          )}

          {/* Empty state */}
          {!loading && notes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3 opacity-60">
              <Feather className="w-10 h-10" style={{ color: "oklch(0.72 0.06 40)" }} />
              <p
                className="text-sm italic text-center"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "16px",
                  color: "oklch(0.55 0.03 30)",
                }}
              >
                尺素如残雪，结为双鲤鱼。
              </p>
            </div>
          )}

          {/* Notes */}
          {notes.map((note) => {
            const isMe = note.sender === "me";
            const colors = SENDER_COLORS[note.sender];
            return (
              <div
                key={note.id}
                className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                onMouseEnter={() => setHoveredId(note.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold mt-1"
                  style={{
                    background: colors.bubble,
                    color: colors.label,
                    border: `1.5px solid ${colors.label}33`,
                  }}
                >
                  {SENDER_LABELS[note.sender]}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col gap-1 max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                  <div
                    className="px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap relative"
                    style={{
                      background: colors.bubble,
                      color: colors.text,
                      borderRadius: isMe ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    {note.text}
                    {hoveredId === note.id && (
                      <button
                        onClick={() => handleDelete(note.id)}
                        disabled={saving}
                        className="absolute -top-2 transition-opacity"
                        style={{
                          right: isMe ? "auto" : "-8px",
                          left: isMe ? "-8px" : "auto",
                          background: "oklch(0.95 0.02 10)",
                          border: "1px solid oklch(0.88 0.04 10)",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: saving ? "not-allowed" : "pointer",
                        }}
                      >
                        <Trash2 className="w-2.5 h-2.5" style={{ color: "oklch(0.55 0.10 10)" }} />
                      </button>
                    )}
                  </div>
                  <span
                    className="text-xs opacity-50"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    {new Date(note.createdAt).toLocaleString("zh-CN", {
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="px-4 py-2 text-sm text-center"
          style={{
            background: "oklch(0.95 0.04 10)",
            color: "oklch(0.45 0.12 10)",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          {error}
          <button
            onClick={() => load()}
            className="ml-2 underline"
          >
            重试
          </button>
        </div>
      )}

      {/* Input area */}
      <div
        className="border-t px-4 py-4"
        style={{
          background: "rgba(253, 250, 247, 0.95)",
          backdropFilter: "blur(12px)",
          borderColor: "oklch(0.92 0.01 40)",
        }}
      >
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {/* Sender selector */}
          <div className="flex gap-2">
            {(["me", "you"] as Sender[]).map((s) => (
              <button
                key={s}
                onClick={() => setSender(s)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  background: sender === s ? SENDER_COLORS[s].label : "oklch(0.93 0.01 40)",
                  color: sender === s ? "white" : "oklch(0.55 0.02 30)",
                }}
              >
                以{SENDER_LABELS[s]}的名义
              </button>
            ))}
          </div>

          {/* Text input + send */}
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="写下想说的话… Enter 发送，Shift+Enter 换行"
              rows={2}
              disabled={saving}
              className="flex-1 resize-none rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{
                fontFamily: "'Nunito', sans-serif",
                background: "white",
                border: "1.5px solid oklch(0.88 0.02 40)",
                color: "oklch(0.25 0.02 30)",
                lineHeight: "1.6",
                opacity: saving ? 0.7 : 1,
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || saving}
              className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 flex-shrink-0"
              style={{
                background:
                  input.trim() && !saving
                    ? SENDER_COLORS[sender].label
                    : "oklch(0.90 0.01 40)",
                color:
                  input.trim() && !saving ? "white" : "oklch(0.70 0.01 40)",
              }}
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
