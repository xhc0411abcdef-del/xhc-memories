/**
 * MediaCard: Individual media item card for the album grid.
 * Design: Watercolor Daylight Aesthetic
 * - Soft rounded card with warm shadow
 * - Color-coded type badge (rose=photo, blue=video, mint=audio)
 * - Hover: float up + shadow deepen
 * - Click: always fires onClick (pointer-events fixed)
 */

import { useState } from "react";
import { Image, Video, Music, Play, Calendar } from "lucide-react";
import { MediaItem } from "@/lib/mediaData";

interface MediaCardProps {
  item: MediaItem;
  index: number;
  onClick: () => void;
}

const TYPE_CONFIG = {
  photo: {
    label: "照片",
    icon: Image,
    badgeBg: "oklch(0.94 0.04 10)",
    badgeColor: "oklch(0.52 0.14 10)",
  },
  video: {
    label: "视频",
    icon: Video,
    badgeBg: "oklch(0.93 0.04 220)",
    badgeColor: "oklch(0.45 0.12 220)",
  },
  audio: {
    label: "音频",
    icon: Music,
    badgeBg: "oklch(0.93 0.04 160)",
    badgeColor: "oklch(0.42 0.12 160)",
  },
};

export default function MediaCard({ item, index, onClick }: MediaCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const config = TYPE_CONFIG[item.type];
  const Icon = config.icon;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric", year: "numeric" });
  };

  const renderThumbnail = () => {
    if (item.type === "photo") {
      if (imgError) {
        return (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "oklch(0.96 0.02 10)" }}
          >
            <Image className="w-10 h-10" style={{ color: "oklch(0.75 0.08 10)" }} />
          </div>
        );
      }
      return (
        <img
          src={item.url}
          alt={item.title || "照片"}
          draggable={false}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{
            transform: hovered ? "scale(1.06)" : "scale(1)",
            pointerEvents: "none", // prevent img from swallowing clicks
            userSelect: "none",
          }}
          onError={() => setImgError(true)}
        />
      );
    }

    if (item.type === "video") {
      return (
        <div className="w-full h-full relative overflow-hidden" style={{ pointerEvents: "none" }}>
          {item.cover && !imgError ? (
            <img
              src={item.cover}
              alt={item.title || "视频"}
              draggable={false}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform: hovered ? "scale(1.06)" : "scale(1)", pointerEvents: "none" }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "oklch(0.93 0.04 220)" }}
            >
              <Video className="w-10 h-10" style={{ color: "oklch(0.50 0.12 220)" }} />
            </div>
          )}
          {/* Play overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
            style={{ background: "rgba(0,0,0,0.22)", opacity: hovered ? 1 : 0.65 }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.92)" }}
            >
              <Play className="w-6 h-6 ml-1" style={{ color: "oklch(0.45 0.12 220)" }} fill="currentColor" />
            </div>
          </div>
        </div>
      );
    }

    if (item.type === "audio") {
      return (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-3"
          style={{
            background: `linear-gradient(135deg, oklch(0.96 0.03 160), oklch(0.92 0.06 160))`,
            pointerEvents: "none",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "oklch(0.88 0.08 160 / 0.5)" }}
          >
            <Music className="w-7 h-7" style={{ color: "oklch(0.42 0.12 160)" }} />
          </div>
          {/* Waveform decoration */}
          <div className="flex items-end gap-0.5 h-6">
            {[3, 5, 8, 6, 10, 7, 4, 9, 5, 3, 7, 5].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full"
                style={{
                  height: `${h * 2}px`,
                  background: "oklch(0.55 0.1 160 / 0.5)",
                }}
              />
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`打开${config.label}：${item.title || ""}`}
      className="fade-in-up rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{
        animationDelay: `${index * 60}ms`,
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
        boxShadow: hovered
          ? "0 12px 32px rgba(200, 120, 120, 0.2), 0 4px 12px rgba(0,0,0,0.08)"
          : "0 2px 12px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        background: "white",
        border: "1px solid oklch(0.93 0.01 40)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        {renderThumbnail()}

        {/* Type badge */}
        <div
          className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            fontFamily: "'Nunito', sans-serif",
            background: config.badgeBg,
            color: config.badgeColor,
            pointerEvents: "none",
          }}
        >
          <Icon className="w-3 h-3" />
          {config.label}
        </div>
      </div>

      {/* Info */}
      <div className="px-3.5 py-3">
        {item.title && (
          <h3
            className="text-base font-medium truncate mb-0.5"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "oklch(0.28 0.02 30)",
              fontSize: "1.05rem",
            }}
          >
            {item.title}
          </h3>
        )}
        <div className="flex items-center gap-1">
          {item.date && (
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: "oklch(0.60 0.02 30)", fontFamily: "'Nunito', sans-serif" }}
            >
              <Calendar className="w-3 h-3" />
              {formatDate(item.date)}
            </span>
          )}
        </div>
        {item.description && (
          <p
            className="text-xs mt-1 line-clamp-1"
            style={{ color: "oklch(0.65 0.02 30)", fontFamily: "'Nunito', sans-serif" }}
          >
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}
