/**
 * MediaLightbox: Full-screen media viewer overlay.
 * Design: Watercolor Daylight Aesthetic
 * - Dark backdrop with blur
 * - Centered content with navigation arrows
 * - Supports photo, video, audio
 */

import { useEffect, useCallback } from "react";
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
      style={{ background: "rgba(20, 10, 10, 0.88)", backdropFilter: "blur(12px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
        style={{ background: "rgba(255,255,255,0.12)", color: "white" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background =
            "rgba(255,255,255,0.22)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background =
            "rgba(255,255,255,0.12)")
        }
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.12)", color: "white" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.22)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.12)")
          }
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.12)", color: "white" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.22)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.12)")
          }
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Content */}
      <div className="flex flex-col items-center max-w-4xl w-full px-16 gap-4">
        {/* Media */}
        <div className="w-full flex items-center justify-center">
          {item.type === "photo" && (
            <img
              src={item.url}
              alt={item.title || ""}
              className="max-h-[70vh] max-w-full object-contain rounded-2xl"
              style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
            />
          )}

          {item.type === "video" && (
            <video
              src={item.url}
              controls
              autoPlay
              className="max-h-[70vh] max-w-full rounded-2xl"
              style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
            />
          )}

          {item.type === "audio" && (
            <div
              className="w-full max-w-md rounded-3xl p-8 flex flex-col items-center gap-6"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.65 0.12 10 / 0.3)" }}
              >
                <Music className="w-10 h-10" style={{ color: "oklch(0.85 0.06 10)" }} />
              </div>
              <div className="text-center">
                <p
                  className="text-xl font-light mb-1"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "rgba(255,255,255,0.95)",
                  }}
                >
                  {item.title || "音频"}
                </p>
                {item.description && (
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {item.description}
                  </p>
                )}
              </div>
              <audio
                src={item.url}
                controls
                autoPlay
                className="w-full"
                style={{ accentColor: "oklch(0.72 0.14 10)" }}
              />
            </div>
          )}
        </div>

        {/* Info */}
        {(item.title || item.date || item.description) && (
          <div className="text-center space-y-1">
            {item.title && (
              <h3
                className="text-xl font-light"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "rgba(255,255,255,0.95)",
                }}
              >
                {item.title}
              </h3>
            )}
            <div className="flex items-center justify-center gap-3">
              {item.date && (
                <span
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  <Calendar className="w-3 h-3" />
                  {formatDate(item.date)}
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                {item.description}
              </p>
            )}
          </div>
        )}

        {/* Counter */}
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          {currentIndex + 1} / {items.length}
        </p>
      </div>
    </div>
  );
}
