/**
 * NoteBoard: 「笺」留言板
 * Design: Watercolor Daylight Aesthetic
 * - Handwritten-style note cards
 * - localStorage persistence
 * - Two senders: "你" and "我"
 */

import { useState, useEffect, useRef } from "react";
import { Send, Trash2 } from "lucide-react";

interface Note {
  id: string;
  sender: "me" | "you";
  text: string;
  time: number;
}

const STORAGE_KEY = "memory-album-notes";

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function formatTime(ts: number) {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function NoteBoard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");
  const [sender, setSender] = useState<"me" | "you">("me");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notes]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newNote: Note = {
      id: Date.now().toString(),
      sender,
      text: trimmed,
      time: Date.now(),
    };
    const updated = [...notes, newNote];
    setNotes(updated);
    saveNotes(updated);
    setText("");
  };

  const handleDelete = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100vh - 140px)", maxWidth: "680px", margin: "0 auto", padding: "24px 16px 0" }}
    >
      {/* Notes list */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: "16px" }}
      >
        {notes.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full gap-3"
            style={{ color: "oklch(0.68 0.03 30)" }}
          >
            <p
              className="text-2xl font-light italic"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "oklch(0.55 0.04 20)" }}
            >
              尺素如残雪，结为双鲤鱼。
            </p>
            <p className="text-xs" style={{ fontFamily: "'Nunito', sans-serif", color: "oklch(0.68 0.03 30)" }}>
              写下第一封笺吧
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`group flex ${note.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="relative max-w-[75%] px-5 py-4 rounded-2xl"
                  style={{
                    background:
                      note.sender === "me"
                        ? "oklch(0.96 0.03 10)"
                        : "oklch(0.98 0.01 40)",
                    border:
                      note.sender === "me"
                        ? "1px solid oklch(0.88 0.06 10)"
                        : "1px solid oklch(0.91 0.01 40)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Sender label */}
                  <p
                    className="text-xs mb-1.5 font-medium"
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      color: note.sender === "me" ? "oklch(0.62 0.10 10)" : "oklch(0.55 0.04 200)",
                    }}
                  >
                    {note.sender === "me" ? "我" : "你"}
                  </p>
                  {/* Text */}
                  <p
                    className="leading-relaxed whitespace-pre-wrap"
                    style={{
                      fontFamily: "'Noto Serif SC', 'Songti SC', serif",
                      fontSize: "15px",
                      color: "oklch(0.28 0.03 20)",
                      lineHeight: "1.8",
                    }}
                  >
                    {note.text}
                  </p>
                  {/* Time */}
                  <p
                    className="text-xs mt-2"
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      color: "oklch(0.68 0.02 30)",
                    }}
                  >
                    {formatTime(note.time)}
                  </p>
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg"
                    style={{ color: "oklch(0.70 0.04 20)" }}
                    title="删除"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        className="flex-shrink-0 py-4"
        style={{
          borderTop: "1px solid oklch(0.92 0.01 40)",
        }}
      >
        {/* Sender toggle */}
        <div className="flex gap-2 mb-3">
          {(["me", "you"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSender(s)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                fontFamily: "'Nunito', sans-serif",
                background:
                  sender === s
                    ? s === "me"
                      ? "oklch(0.65 0.12 10)"
                      : "oklch(0.52 0.10 200)"
                    : "oklch(0.95 0.01 30)",
                color: sender === s ? "white" : "oklch(0.50 0.03 30)",
                border: "none",
              }}
            >
              {s === "me" ? "以我的名义" : "以你的名义"}
            </button>
          ))}
        </div>

        {/* Text input */}
        <div className="flex gap-2 items-end">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="写下心里话…"
            rows={2}
            className="flex-1 resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
            style={{
              fontFamily: "'Noto Serif SC', 'Songti SC', serif",
              background: "oklch(0.98 0.005 30)",
              border: "1.5px solid oklch(0.91 0.01 40)",
              color: "oklch(0.28 0.02 30)",
              lineHeight: "1.7",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1.5px solid oklch(0.78 0.08 10)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1.5px solid oklch(0.91 0.01 40)";
            }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40"
            style={{
              background: "oklch(0.65 0.12 10)",
              color: "white",
              boxShadow: "0 3px 12px oklch(0.65 0.12 10 / 0.35)",
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled)
                e.currentTarget.style.background = "oklch(0.60 0.14 10)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "oklch(0.65 0.12 10)";
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p
          className="text-xs mt-2 text-center"
          style={{ fontFamily: "'Nunito', sans-serif", color: "oklch(0.72 0.02 30)" }}
        >
          Enter 发送 · Shift+Enter 换行
        </p>
      </div>
    </div>
  );
}
