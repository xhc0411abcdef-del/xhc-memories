/**
 * NoteBoard — 笺
 * Shared message board backed by the database.
 * Both users see the same notes in real-time (polling every 5s).
 */

import { useRef, useEffect, useState, KeyboardEvent } from "react";
import { Feather, Trash2, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";

type Sender = "me" | "you";

const SENDER_LABELS: Record<Sender, string> = {
  me: "我",
  you: "你",
};

const SENDER_COLORS: Record<Sender, { bubble: string; text: string; label: string }> = {
  me: {
    bubble: "oklch(0.92 0.06 10)",
    text: "oklch(0.28 0.04 15)",
    label: "oklch(0.65 0.12 10)",
  },
  you: {
    bubble: "oklch(0.93 0.04 220)",
    text: "oklch(0.25 0.05 220)",
    label: "oklch(0.52 0.14 220)",
  },
};

export default function NoteBoard() {
  const [sender, setSender] = useState<Sender>("me");
  const [input, setInput] = useState("");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: notes = [], refetch } = trpc.notes.list.useQuery(undefined, {
    refetchInterval: 5000, // poll every 5 seconds
  });

  const addMutation = trpc.notes.add.useMutation({
    onSuccess: () => {
      setInput("");
      refetch();
    },
  });

  const deleteMutation = trpc.notes.delete.useMutation({
    onSuccess: () => refetch(),
  });

  // Scroll to bottom when new notes arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notes.length]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || addMutation.isPending) return;
    addMutation.mutate({ sender, text });
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
      style={{
        height: "calc(100vh - 140px)",
        background: "oklch(0.99 0.003 30)",
      }}
    >
      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {notes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3 opacity-60">
              <Feather
                className="w-10 h-10"
                style={{ color: "oklch(0.72 0.06 40)" }}
              />
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

          {notes.map((note) => {
            const isMe = note.sender === "me";
            const colors = SENDER_COLORS[note.sender as Sender];
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
                  {SENDER_LABELS[note.sender as Sender]}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col gap-1 max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                  <div
                    className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap relative"
                    style={{
                      background: colors.bubble,
                      color: colors.text,
                      borderRadius: isMe
                        ? "18px 4px 18px 18px"
                        : "4px 18px 18px 18px",
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    {note.text}
                    {/* Delete button */}
                    {hoveredId === note.id && (
                      <button
                        onClick={() => deleteMutation.mutate({ id: note.id })}
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
                          cursor: "pointer",
                        }}
                      >
                        <Trash2
                          className="w-2.5 h-2.5"
                          style={{ color: "oklch(0.55 0.10 10)" }}
                        />
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
                  background:
                    sender === s
                      ? SENDER_COLORS[s].label
                      : "oklch(0.93 0.01 40)",
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
              className="flex-1 resize-none rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{
                fontFamily: "'Nunito', sans-serif",
                background: "white",
                border: "1.5px solid oklch(0.88 0.02 40)",
                color: "oklch(0.25 0.02 30)",
                lineHeight: "1.6",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || addMutation.isPending}
              className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 flex-shrink-0"
              style={{
                background:
                  input.trim() && !addMutation.isPending
                    ? SENDER_COLORS[sender].label
                    : "oklch(0.90 0.01 40)",
                color:
                  input.trim() && !addMutation.isPending
                    ? "white"
                    : "oklch(0.70 0.01 40)",
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
