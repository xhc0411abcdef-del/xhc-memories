/**
 * LockPage: Password-protected entry page.
 * Design: Watercolor Daylight Aesthetic
 * - Full-screen watercolor background
 * - Centered frosted glass card
 * - Elegant Cormorant Garamond title
 * - Shake animation on wrong password
 */

import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, Lock } from "lucide-react";

const BG_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663522413194/gVumamf6x9RGfwVLjuptu2/watercolor-hero-bg-KwJA9naogSVcHCrmA7uaPe.webp";

interface LockPageProps {
  onUnlock: () => void;
}

export default function LockPage({ onUnlock }: LockPageProps) {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 300));

    const success = login(password);
    if (success) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setShaking(true);
      setPassword("");
      setTimeout(() => {
        setShaking(false);
        inputRef.current?.focus();
      }, 500);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${BG_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />

      {/* Floating petal decorations */}
      <div className="absolute top-16 left-12 w-3 h-3 rounded-full bg-rose-200/60 blur-sm" />
      <div className="absolute top-32 right-20 w-2 h-2 rounded-full bg-pink-200/70 blur-sm" />
      <div className="absolute bottom-24 left-24 w-4 h-4 rounded-full bg-rose-100/50 blur-sm" />
      <div className="absolute bottom-40 right-16 w-2 h-2 rounded-full bg-pink-300/50 blur-sm" />

      {/* Main card */}
      <div
        className={`relative z-10 w-full max-w-sm mx-4 ${shaking ? "shake" : ""}`}
      >
        <div
          className="rounded-3xl px-8 py-10 text-center"
          style={{
            background: "rgba(255, 255, 255, 0.82)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 8px 40px rgba(232, 180, 180, 0.25), 0 2px 12px rgba(0,0,0,0.06)",
            border: "1px solid rgba(255, 255, 255, 0.9)",
          }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.94 0.04 10 / 0.6)" }}
            >
              <Heart
                className="w-6 h-6"
                style={{ color: "oklch(0.62 0.14 10)" }}
                fill="currentColor"
              />
            </div>
          </div>

          {/* Title */}
          <h1
            className="font-display text-4xl font-light mb-1"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "oklch(0.32 0.04 15)",
              letterSpacing: "0.02em",
            }}
          >
            The Memories
          </h1>
          <div className="mb-8 mt-3 text-center">
            <p
              className="italic leading-relaxed"
              style={{ color: "oklch(0.42 0.05 20)", fontFamily: "'Cormorant Garamond', serif", fontSize: "15px", letterSpacing: "0.01em" }}
            >
              此情可待成追忆，只是当时已惘然。
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: error ? "oklch(0.55 0.18 20)" : "oklch(0.65 0.06 20)" }}
              />
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="请输入密码"
                autoFocus
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  background: error
                    ? "oklch(0.97 0.02 15)"
                    : "oklch(0.97 0.005 30)",
                  border: error
                    ? "1.5px solid oklch(0.72 0.14 10)"
                    : "1.5px solid oklch(0.91 0.01 40)",
                  color: "oklch(0.28 0.02 30)",
                }}
              />
            </div>

            {error && (
              <p
                className="text-xs text-center"
                style={{ color: "oklch(0.55 0.18 20)", fontFamily: "'Nunito', sans-serif" }}
              >
                密码不正确，请再试一次 ♡
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50"
              style={{
                fontFamily: "'Nunito', sans-serif",
                background: "oklch(0.65 0.12 10)",
                color: "white",
                boxShadow: "0 4px 16px oklch(0.65 0.12 10 / 0.35)",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background =
                  "oklch(0.60 0.14 10)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background =
                  "oklch(0.65 0.12 10)";
              }}
            >
              {loading ? "验证中..." : "尺素如残雪，结为双鲤鱼"}
            </button>
          </form>
        </div>

        {/* Bottom hint */}
        <p
          className="text-center text-xs mt-4"
          style={{ color: "oklch(0.55 0.03 20 / 0.7)", fontFamily: "'Nunito', sans-serif" }}
        >
          ♡
        </p>
      </div>
    </div>
  );
}
