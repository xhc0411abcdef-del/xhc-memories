/**
 * mediaData.ts — Your Memory Album Content
 * ==========================================
 * Add your own photos, videos, and audio files here.
 *
 * HOW TO ADD YOUR MEDIA:
 * 1. Upload your files using: manus-upload-file --webdev /path/to/your/file
 * 2. Copy the returned CDN URL
 * 3. Add a new entry to the appropriate array below
 *
 * TYPES:
 *   - type: "photo" | "video" | "audio"
 *   - url: CDN URL of your file
 *   - title: Display title (optional)
 *   - date: Date string like "2024-02-14" (optional)
 *   - description: Short caption (optional)
 *   - cover: Thumbnail image URL for video/audio (optional)
 */

export type MediaType = "photo" | "video" | "audio";

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  title?: string;
  date?: string;
  description?: string;
  cover?: string; // thumbnail for video/audio
}

// =============================================
// ADD YOUR MEDIA ITEMS HERE
// =============================================
export const mediaItems: MediaItem[] = [
  // ---- PHOTOS ----
  // Example:
  // {
  //   id: "photo-1",
  //   type: "photo",
  //   url: "https://your-cdn-url/photo.jpg",
  //   title: "第一次见面",
  //   date: "2023-06-15",
  //   description: "那天阳光很好",
  // },

  // ---- VIDEOS ----
  // Example:
  // {
  //   id: "video-1",
  //   type: "video",
  //   url: "https://your-cdn-url/video.mp4",
  //   title: "一起去海边",
  //   date: "2023-08-20",
  //   cover: "https://your-cdn-url/video-cover.jpg",
  // },

  // ---- AUDIO ----
  // Example:
  // {
  //   id: "audio-1",
  //   type: "audio",
  //   url: "https://your-cdn-url/audio.m4a",
  //   title: "你说的那句话",
  //   date: "2023-12-25",
  //   description: "圣诞节的录音",
  // },

  // =============================================
  // DEMO ITEMS (remove these when adding your own)
  // =============================================
  {
    id: "demo-photo-1",
    type: "photo",
    url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800",
    title: "春日午后",
    date: "2024-03-15",
    description: "阳光透过树叶洒下来",
  },
  {
    id: "demo-photo-2",
    type: "photo",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
    title: "一起散步",
    date: "2024-04-02",
    description: "傍晚的公园",
  },
  {
    id: "demo-photo-3",
    type: "photo",
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800",
    title: "咖啡时光",
    date: "2024-02-14",
    description: "情人节的下午茶",
  },
  {
    id: "demo-photo-4",
    type: "photo",
    url: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800",
    title: "夕阳西下",
    date: "2024-05-20",
    description: "海边的黄昏",
  },
  {
    id: "demo-photo-5",
    type: "photo",
    url: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800",
    title: "城市夜景",
    date: "2024-06-10",
  },
  {
    id: "demo-video-1",
    type: "video",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "第一次旅行",
    date: "2024-07-01",
    description: "一起去看海",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
  },
  {
    id: "demo-audio-1",
    type: "audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    title: "我们的歌",
    date: "2024-01-01",
    description: "第一次听到这首歌的那天",
  },
  {
    id: "demo-audio-2",
    type: "audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    title: "生日快乐",
    date: "2024-09-18",
    description: "你生日那天录的",
  },
];
