/**
 * AlbumPage: Main memory album gallery.
 * Design: Watercolor Daylight Aesthetic
 * - Warm watercolor header with title
 * - Filter tabs: All / Photos / Videos / Audio
 * - Responsive masonry-style grid
 * - Lightbox for full-screen viewing
 * - Logout button (returns to lock page)
 */

import { useState, useMemo } from "react";
import { Heart, LogOut, Image, Video, Music, Layers, MessageSquareText } from "lucide-react";

import { mediaItems, MediaItem, MediaType } from "@/lib/mediaData";
import MediaCard from "@/components/MediaCard";
import { useAuth } from "@/contexts/AuthContext";

const CHAT_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663522413194/gVumamf6x9RGfwVLjuptu2/chat_viewer_ed6614c9.html";

const BG_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663522413194/gVumamf6x9RGfwVLjuptu2/watercolor-hero-bg-KwJA9naogSVcHCrmA7uaPe.webp";

type FilterType = "all" | MediaType;
type ViewType = FilterType | "chat";

const FILTERS: { key: FilterType; label: string; icon: typeof Layers }[] = [
  { key: "all", label: "全部", icon: Layers },
  { key: "photo", label: "照片", icon: Image },
  { key: "video", label: "视频", icon: Video },
  { key: "audio", label: "音频", icon: Music },
];

const FILTER_COLORS: Record<ViewType, { active: string; text: string }> = {
  all: { active: "oklch(0.65 0.12 10)", text: "white" },
  photo: { active: "oklch(0.65 0.12 10)", text: "white" },
  video: { active: "oklch(0.52 0.14 220)", text: "white" },
  audio: { active: "oklch(0.48 0.14 160)", text: "white" },
  chat: { active: "oklch(0.48 0.14 280)", text: "white" },
};

interface AlbumPageProps {
  onLogout: () => void;
}

export default function AlbumPage({ onLogout }: AlbumPageProps) {
  const { logout } = useAuth();
  const [view, setView] = useState<ViewType>("all");
  const filter: FilterType = view === "chat" ? "all" : view;

  const handleCardClick = (item: MediaItem) => {
    if (item.type === "photo") {
      window.open(item.url, "_blank");
    }
    // video/audio handled inside MediaCard
  };

  const filteredItems = useMemo(() => {
    if (filter === "all") return mediaItems;
    return mediaItems.filter((item) => item.type === filter);
  }, [filter]);

  const counts = useMemo(
    () => ({
      all: mediaItems.length,
      photo: mediaItems.filter((i) => i.type === "photo").length,
      video: mediaItems.filter((i) => i.type === "video").length,
      audio: mediaItems.filter((i) => i.type === "audio").length,
    }),
    []
  );

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div
      className="min-h-screen slide-up"
      style={{ background: "oklch(0.99 0.003 30)" }}
    >
      {/* Header */}
      <header
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url(${BG_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          minHeight: "220px",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(1px)" }}
        />

        <div className="relative z-10 container py-10">
          <div className="flex items-start justify-between">
            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Heart
                  className="w-5 h-5"
                  style={{ color: "oklch(0.62 0.14 10)" }}
                  fill="currentColor"
                />
                <span
                  className="text-sm font-medium tracking-wide"
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    color: "oklch(0.55 0.06 15)",
                  }}
                >
                  我们的回忆
                </span>
              </div>
              <h1
                className="text-5xl font-light leading-tight"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "oklch(0.28 0.04 15)",
                  letterSpacing: "-0.01em",
                }}
              >
                Our Memories
              </h1>
              <p
                className="mt-2 text-sm"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: "oklch(0.48 0.04 20)",
                }}
              >
                {counts.all} 个珍贵瞬间 · {counts.photo} 张照片 · {counts.video} 个视频 ·{" "}
                {counts.audio} 段音频
              </p>
            </div>

            {/* Top-right actions */}
            <div className="flex flex-col gap-2 items-end mt-1">
              {/* Chat link */}
              <button
                onClick={() => window.open(CHAT_URL, "_blank")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  background: "rgba(219,234,254,0.85)",
                  color: "oklch(0.40 0.12 220)",
                  border: "1px solid rgba(193,219,254,0.9)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(219,234,254,1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(219,234,254,0.85)";
                }}
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                聊天记录
              </button>
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  background: "rgba(255,255,255,0.7)",
                  color: "oklch(0.50 0.04 20)",
                  border: "1px solid rgba(255,255,255,0.9)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.9)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.7)";
                }}
              >
                <LogOut className="w-3.5 h-3.5" />
                退出
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filter tabs */}
      <div
        className="sticky top-0 z-20"
        style={{
          background: "rgba(253, 250, 247, 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(0.92 0.01 40)",
        }}
      >
        <div className="container">
          <div className="flex gap-1 py-3 overflow-x-auto">
            {FILTERS.map((f) => {
              const isActive = view === f.key;
              const Icon = f.icon;
              const count = counts[f.key];
              return (
                <button
                  key={f.key}
                  onClick={() => setView(f.key)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200"
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    background: isActive ? FILTER_COLORS[f.key].active : "transparent",
                    color: isActive ? FILTER_COLORS[f.key].text : "oklch(0.50 0.03 30)",
                    boxShadow: isActive ? `0 2px 8px ${FILTER_COLORS[f.key].active}55` : "none",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {f.label}
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.25)" : "oklch(0.93 0.01 40)",
                      color: isActive ? "white" : "oklch(0.55 0.02 30)",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
            {/* Chat tab */}
            <button
              onClick={() => setView("chat")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200"
              style={{
                fontFamily: "'Nunito', sans-serif",
                background: view === "chat" ? FILTER_COLORS.chat.active : "transparent",
                color: view === "chat" ? "white" : "oklch(0.50 0.03 30)",
                boxShadow: view === "chat" ? `0 2px 8px ${FILTER_COLORS.chat.active}55` : "none",
              }}
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              聊天记录
            </button>
          </div>
        </div>
      </div>

      {/* Chat iframe view */}
      {view === "chat" && (
        <div style={{ height: "calc(100vh - 140px)", width: "100%" }}>
          <iframe
            src={CHAT_URL}
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            title="聊天记录"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      )}

      {/* Grid */}
      {view !== "chat" && (
      <main className="container py-8">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.95 0.02 30)" }}
            >
              <Heart className="w-7 h-7" style={{ color: "oklch(0.75 0.08 10)" }} />
            </div>
            <p
              className="text-lg font-light"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "oklch(0.55 0.03 30)",
              }}
            >
              还没有内容，快去添加吧
            </p>
            <p
              className="text-sm text-center max-w-xs"
              style={{
                fontFamily: "'Nunito', sans-serif",
                color: "oklch(0.65 0.02 30)",
              }}
            >
              在 <code className="text-xs bg-gray-100 px-1 rounded">client/src/lib/mediaData.ts</code> 中添加你的照片、视频和音频
            </p>
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            }}
          >
            {filteredItems.map((item, i) => (
              <MediaCard
                key={item.id}
                item={item}
                index={i}
                onClick={() => handleCardClick(item)}
              />
            ))}
          </div>
        )}
      </main>
      )}

      {/* Footer */}
      <footer className="container pb-8 pt-4 text-center">
        <p
          className="text-xs"
          style={{
            fontFamily: "'Nunito', sans-serif",
            color: "oklch(0.72 0.02 30)",
          }}
        >
          Made with{" "}
          <Heart
            className="inline w-3 h-3 mx-0.5"
            style={{ color: "oklch(0.72 0.12 10)" }}
            fill="currentColor"
          />{" "}
          for our memories
        </p>
      </footer>



    </div>
  );
}
