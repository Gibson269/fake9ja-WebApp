export type VideoPlatform = "YouTube" | "Instagram" | "TikTok" | "Facebook" | "X" | "Organic" | "Local" | "Other";

export interface VideoTestimony {
  id: string | number;
  type?: "instagram" | "local" | "embed" | "youtube" | "tiktok" | "facebook" | "organic" | undefined;
  title: string;
  authorName: string;
  authorHandle: string;
  sourceUrl: string;
  embedUrl: string;
  localVideoUrl?: string | undefined;
  thumbnailUrl?: string | undefined;
  platform: VideoPlatform;
  location: string;
  summary: string;
  quote: string;
  date: string;
  tag: string;
  duration?: string | undefined;
  aiFeature?: string | undefined;
  is_active?: boolean | undefined;
}

export function parseVideoSource(rawUrl: string): {
  platform: VideoPlatform;
  embedUrl: string;
  localVideoUrl?: string;
  inferredType: "instagram" | "local" | "embed" | "youtube" | "tiktok" | "facebook" | "organic";
} {
  const url = (rawUrl || "").trim();

  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/i);
  if (ytMatch && ytMatch[1]) {
    return {
      platform: "YouTube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
      inferredType: "youtube",
    };
  }

  // Instagram
  const igMatch = url.match(/instagram\.com\/(?:p|reel|reels)\/([a-zA-Z0-9_-]+)/i);
  if (igMatch && igMatch[1]) {
    return {
      platform: "Instagram",
      embedUrl: `https://www.instagram.com/p/${igMatch[1]}/embed/`,
      inferredType: "instagram",
    };
  }

  // TikTok
  const ttMatch = url.match(/tiktok\.com\/(?:@[^\/]+\/video\/|v\/)?([0-9]+)/i);
  if (ttMatch && ttMatch[1]) {
    return {
      platform: "TikTok",
      embedUrl: `https://www.tiktok.com/embed/v2/${ttMatch[1]}`,
      inferredType: "tiktok",
    };
  }

  // Facebook
  if (/facebook\.com|fb\.watch/i.test(url)) {
    return {
      platform: "Facebook",
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`,
      inferredType: "facebook",
    };
  }

  // X / Twitter
  if (/(?:twitter|x)\.com/i.test(url)) {
    return {
      platform: "X",
      embedUrl: url,
      inferredType: "embed",
    };
  }

  // Direct MP4 / WebM / Local video
  if (/\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url) || url.startsWith("/videos/") || url.startsWith("/storage/")) {
    return {
      platform: "Organic",
      embedUrl: "",
      localVideoUrl: url,
      inferredType: "organic",
    };
  }

  return {
    platform: "Other",
    embedUrl: url,
    inferredType: "embed",
  };
}

export function getVideoThumbnail(item: Partial<VideoTestimony> | null | undefined): string {
  if (!item) return "/images/consumer-vigilance.jpg";

  // 1. If explicit valid thumbnail is present and not the generic tablet placeholder
  if (
    item.thumbnailUrl &&
    !item.thumbnailUrl.includes("photo-1584308666744-24d5c474f2ae") &&
    item.thumbnailUrl !== "/images/hero-scanner.jpg"
  ) {
    return item.thumbnailUrl;
  }

  // 2. YouTube auto-extract high-quality thumbnail
  const ytMatch = (item.sourceUrl || item.embedUrl || "").match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/i
  );
  if (ytMatch && ytMatch[1]) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }

  // 3. Keyword / Category contextual matching
  const text = `${item.title || ""} ${item.tag || ""} ${item.summary || ""} ${item.aiFeature || ""}`.toLowerCase();
  if (text.includes("oil") || text.includes("engine") || text.includes("auto") || text.includes("motor")) {
    return "/images/counterfeit-oil.jpg";
  }
  if (text.includes("drink") || text.includes("traffic") || text.includes("tunde") || text.includes("commuter") || text.includes("bottle") || text.includes("water")) {
    return "/images/quick-intake-data.jpg";
  }
  if (text.includes("cosmetic") || text.includes("lotion") || text.includes("cream") || text.includes("bleach") || text.includes("baby")) {
    return "/images/counterfeit-cosmetics.jpg";
  }
  if (text.includes("rice") || text.includes("food") || text.includes("grain") || text.includes("sabon gari") || text.includes("seasoning")) {
    return "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("charger") || text.includes("phone") || text.includes("electronic") || text.includes("alaba") || text.includes("plug")) {
    return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("malaria") || text.includes("syrup") || text.includes("antibiotic") || text.includes("cough") || text.includes("pharma")) {
    return "/images/counterfeit-malaria.jpg";
  }

  return "/images/consumer-vigilance.jpg";
}

export const initialVideoTestimonies: VideoTestimony[] = [
  {
    id: "ig-daveplay-counterfeit-alarm",
    type: "instagram",
    title: "Fake Products: Nigerians Raise Alarm Over Counterfeit Goods Flooding the Market",
    authorName: "Daveplay Blog",
    authorHandle: "@daveplayblog",
    sourceUrl: "https://www.instagram.com/p/Dc3JLiuCMS9/?img_index=11&stkn=MW5xNGp0MnJpcjZsNA==",
    embedUrl: "https://www.instagram.com/p/Dc3JLiuCMS9/embed/",
    thumbnailUrl: "/images/consumer-vigilance.jpg",
    platform: "Instagram",
    location: "Lagos / National Markets",
    summary: "Viral citizen outcry showing fake and adulterated goods circulating in open markets, urging NAFDAC and consumers to take immediate collective action.",
    quote: "Nigerians are raising the alarm on counterfeit goods infiltrating daily food and medicines. We must look closer at what we buy.",
    date: "September 2026",
    tag: "Market Alert",
    duration: "1:24",
    aiFeature: "Foil seal light refraction, cap crimping flaws, and blurry regulatory stamps",
  },
  {
    id: "ig-tunde-ednut-commute-alert",
    type: "instagram",
    title: "Public Alert on Market Adulteration & Dangerous Consumption",
    authorName: "King Tunde Ednut",
    authorHandle: "@mazitundeednut",
    sourceUrl: "https://www.instagram.com/p/Dd3lqxWkaO_/?img_index=1&stkn=cjE4bnp6NDl4dHVy",
    embedUrl: "https://www.instagram.com/p/Dd3lqxWkaO_/embed/",
    thumbnailUrl: "/images/quick-intake-data.jpg",
    platform: "Instagram",
    location: "Lagos Transit / Commuter Hubs",
    summary: "Crucial public awareness video highlighting street-sold drinks and questionable packaged goods sold to everyday commuters in traffic.",
    quote: "This is why vigilance is crucial: dangerous, adulterated drinks and items end up in unsuspecting hands every single day.",
    date: "September 2026",
    tag: "Consumer Vigilance",
    duration: "0:58",
    aiFeature: "Bottle plastic thickness, tamper band break points, and counterfeit liquid color tone",
  },
  {
    id: "yt-nafdac-open-market-raid",
    type: "youtube",
    title: "Counterfeit Medicine Alert & Laboratory Forensics Briefing",
    authorName: "Consumer Protection Sentinel",
    authorHandle: "@consumer_radar_ng",
    sourceUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    platform: "YouTube",
    location: "Onitsha Head Bridge Market, Anambra",
    summary: "Forensic breakdown showing subtle variations in cloned pharmaceutical blister foils, mismatched batch numbering, and missing NAFDAC scratch PINs.",
    quote: "We (Nigerians) have the power to solve this. When we upload suspicious samples, the AI system learns to identify clones in seconds.",
    date: "September 2026",
    tag: "Forensic Investigation",
    duration: "2:15",
    aiFeature: "Micro-font kerning anomalies and barcode parity checksum validation",
  },
  {
    id: "local-citizen-voice-abuja",
    type: "organic",
    title: "Citizen Sentinel: Exposing Cloned Antibiotics in Wuse Market",
    authorName: "Amina & Chidi",
    authorHandle: "Citizen Report #EIE-NG-402",
    sourceUrl: "#",
    embedUrl: "",
    localVideoUrl: "/videos/fake-medicine-alert.mp4",
    thumbnailUrl: "/images/counterfeit-malaria.jpg",
    platform: "Organic",
    location: "Wuse Market, Abuja",
    summary: "Direct citizen phone recording demonstrating how foil texture and barcode print misalignments revealed a cloned malaria prescription pack.",
    quote: "Together as Nigerians we can stop this. When we upload what we see, the AI model learns every fake print pattern.",
    date: "October 2026",
    tag: "Organic Citizen Video",
    duration: "0:45",
    aiFeature: "Micro-font kerning anomalies and barcode parity checksum validation",
  },
  {
    id: "local-citizen-onitsha-oil",
    type: "organic",
    title: "Undercover Motorist: Identifying Diluted Engine Oil in Onitsha",
    authorName: "Engr. Obinna",
    authorHandle: "Citizen Report #EIE-NG-789",
    sourceUrl: "#",
    embedUrl: "",
    localVideoUrl: "/videos/onitsha-oil-check.mp4",
    thumbnailUrl: "/images/counterfeit-oil.jpg",
    platform: "Organic",
    location: "Main Market, Onitsha",
    summary: "Video inspection showing cloned manufacturer labels with peeling holographic stickers on synthetic motor lubricants.",
    quote: "If we don't document it, more engines will knock. Submitting this video teaches the AI to flag this cloned batch immediately.",
    date: "October 2026",
    tag: "Organic Citizen Video",
    duration: "1:15",
    aiFeature: "Hologram angle sheen and cap thread variance detection",
  },
];

const STORAGE_KEY = "fake9ja_video_testimonies_v3";

export function loadStoredTestimonies(): VideoTestimony[] {
  if (typeof window === "undefined") return initialVideoTestimonies;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialVideoTestimonies;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const ids = new Set(parsed.map((item: VideoTestimony) => String(item.id)));
      const missingInitial = initialVideoTestimonies.filter((init) => !ids.has(String(init.id)));
      return [...parsed, ...missingInitial];
    }
  } catch (err) {
    console.error("Failed to load video testimonies from localStorage", err);
  }
  return initialVideoTestimonies;
}

export function saveStoredTestimonies(items: VideoTestimony[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save video testimonies to localStorage", err);
  }
}
