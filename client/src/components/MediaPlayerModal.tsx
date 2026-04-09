import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { MediaItem } from "@/lib/mediaData";

interface MediaPlayerModalProps {
  item: MediaItem;
  onClose: () => void;
}

export default function MediaPlayerModal({ item, onClose }: MediaPlayerModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-3xl mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors"
          aria-label="关闭"
        >
          <X size={28} />
        </button>

        {/* Title */}
        <p className="text-white/70 text-sm text-center mb-3 truncate px-8">
          {item.title}
        </p>

        {/* Player */}
        <div className="rounded-2xl overflow-hidden bg-black shadow-2xl">
          {item.type === "video" ? (
            <video
              src={item.url}
              controls
              autoPlay
              className="w-full max-h-[70vh]"
              style={{ display: "block" }}
            >
              您的浏览器不支持视频播放。
            </video>
          ) : (
            <div className="p-8 flex flex-col items-center gap-6 bg-gradient-to-br from-rose-50 to-amber-50">
              {/* Album art placeholder */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-200 to-amber-200 flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" fill="none" className="w-14 h-14 text-rose-400" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <p className="text-rose-700 font-medium text-base text-center">{item.title}</p>
              <audio
                src={item.url}
                controls
                autoPlay
                className="w-full"
                style={{ display: "block" }}
              >
                您的浏览器不支持音频播放。
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
