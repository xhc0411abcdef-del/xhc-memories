/**
 * MediaLightbox: Full-screen media viewer overlay.
 * Design: Watercolor Daylight Aesthetic
 * - Dark backdrop with blur
 * - Centered content with navigation arrows
 * - Supports photo, video (with crossOrigin fix), audio
 */

import { useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Music, Calendar } from "lucide-react";
import { MediaItem } from "@/lib/mediaData";

interface MediaLightboxProps {
  item: MediaItem;
  items: MediaItem[];
  onClose: () => void;
  onNavigate: (item: MediaItem) => void;
}

export default function MediaLightbox({
  item,
  items,
  onClose,
  onNavigate,
}: MediaLightboxProps) {
  const currentIndex = items.findIndex((i) => i.id === item.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePrev = useCallback(() => {
    if (hasPrev) onNavigate(items[currentIndex - 1]);
  }, [hasPrev, currentIndex, items, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) onNavigate(items[currentIndex + 1]);
  }, [hasNext, currentIndex, items, onNavigate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, handlePrev, handleNext]);

  // When item changes, reload video
  useEffect(() => {
    if (item.type === "video" && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [item.id, item.type]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(10, 5, 5, 0.92)", backdropFilter: "blur(16px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
        style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.28)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)")
        }
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.28)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)")
          }
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.28)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)")
          }
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Content area — stops click from bubbling to backdrop */}
      <div
        className="flex flex-col items-center w-full px-16 gap-4"
        style={{ maxWidth: "900px", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media */}
        <div className="w-full flex items-center justify-center">
          {item.type === "photo" && (
            <img
              key={item.id}
              src={item.url}
              alt={item.title || "照片"}
              className="rounded-2xl object-contain"
              style={{
                maxHeight: "72vh",
                maxWidth: "100%",
                boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
                display: "block",
              }}
            />
          )}

          {item.type === "video" && (
            <video
              key={item.id}
              ref={videoRef}
              controls
              autoPlay
              playsInline
              className="rounded-2xl"
              style={{
                maxHeight: "72vh",
                maxWidth: "100%",
                width: "100%",
                boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
                background: "#000",
              }}
            >
              <source src={item.url} type="video/mp4" />
              你的浏览器不支持视频播放。
            </video>
          )}

          {item.type === "audio" && (
            <div
              className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center gap-6"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
              }}
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.65 0.12 160 / 0.25)" }}
              >
                <Music className="w-10 h-10" style={{ color: "oklch(0.78 0.10 160)" }} />
              </div>
              <div className="text-center">
                <p
                  className="text-2xl font-light mb-1"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "rgba(255,255,255,0.95)",
                  }}
                >
                  {item.title || "音频"}
                </p>
                {item.description && (
                  <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {item.description}
                  </p>
                )}
              </div>
              <audio
                key={item.id}
                src={item.url}
                controls
                autoPlay
                className="w-full"
                style={{ accentColor: "oklch(0.72 0.14 160)" }}
              />
            </div>
          )}
        </div>

        {/* Info */}
        {(item.title || item.date || item.description) && item.type !== "audio" && (
          <div className="text-center space-y-1">
            {item.title && (
              <h3
                className="text-xl font-light"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                {item.title}
              </h3>
            )}
            {item.date && (
              <span
                className="flex items-center justify-center gap-1 text-xs"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                <Calendar className="w-3 h-3" />
                {formatDate(item.date)}
              </span>
            )}
            {item.description && (
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                {item.description}
              </p>
            )}
          </div>
        )}

        {/* Counter */}
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>
          {currentIndex + 1} / {items.length}
        </p>
      </div>
    </div>
  );
}
