import alarmCoverImg from "./Fak€ Products- Nigerians Raise Alarm Over Count€rf€!t Goods Fl00ding the Market, Call On NAFDAC.jpg";
import alarmVid1 from "./Fak€ Products- Nigerians Raise Alarm Over Count€rf€!t Goods Fl00ding the Market, Call On NAFDAC.mp4";
import alarmVid2 from "./Fak€ Products- Nigerians Raise Alarm Over Count€rf€!t Goods Fl00ding the Market, Call On NAFDAC2.mp4";
import alarmVid4 from "./Fak€ Products- Nigerians Raise Alarm Over Count€rf€!t Goods Fl00ding the Market, Call On NAFDAC 4.mp4";
import alarmVid5 from "./Fak€ Products- Nigerians Raise Alarm Over Count€rf€!t Goods Fl00ding the Market, Call On NAFDAC 5.mp4";
import alarmVid6 from "./Fak€ Products- Nigerians Raise Alarm Over Count€rf€!t Goods Fl00ding the Market, Call On NAFDAC 66.mp4";
import alarmVid7 from "./Fak€ Products- Nigerians Raise Alarm Over Count€rf€!t Goods Fl00ding the Market, Call On NAFDAC 7.mp4";
import alarmVid8 from "./Fak€ Products- Nigerians Raise Alarm Over Count€rf€!t Goods Fl00ding the Market, Call On NAFDAC 8.mp4";
import alarmVid10 from "./Fak€ Products- Nigerians Raise Alarm Over Count€rf€!t Goods Fl00ding the Market, Call On NAFDAC 10.mp4";

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

  // Direct MP4 / WebM / Local video
  if (/\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url) || url.startsWith("/videos/") || url.startsWith("/storage/") || url.startsWith("blob:") || url.startsWith("data:")) {
    return {
      platform: "Organic",
      embedUrl: "",
      localVideoUrl: url,
      inferredType: "organic",
    };
  }

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

  return {
    platform: "Other",
    embedUrl: url,
    inferredType: "embed",
  };
}

export function getVideoThumbnail(item: Partial<VideoTestimony> | null | undefined): string {
  if (!item) return alarmCoverImg || "/videos/alarm/alarm-cover.jpg";

  // 1. If explicit valid thumbnail is present and not the generic placeholder
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

  // 3. Fallback to master alarm series cover
  return alarmCoverImg || "/videos/alarm/alarm-cover.jpg";
}

export const initialVideoTestimonies: VideoTestimony[] = [
  {
    id: "alarm-video-part-1",
    type: "local",
    title: "Fak€ Products: Nigerians Raise Alarm Over Count€rf€!t Goods Fl00ding the Market (Part 1)",
    authorName: "Daveplay Blog",
    authorHandle: "@daveplayblog",
    sourceUrl: "https://www.instagram.com/p/Dc3JLiuCMS9/?img_index=1",
    embedUrl: "",
    localVideoUrl: alarmVid1,
    thumbnailUrl: alarmCoverImg,
    platform: "Instagram",
    location: "Lagos / National Open Markets",
    summary: "Viral citizen exposé exposing rampant counterfeit fast-moving consumer goods, Oral-B toothpaste counterfeits, and duplicate packaging circulating freely in major commercial centers.",
    quote: "Nigerians are raising the alarm on counterfeit goods infiltrating daily food and consumables. We must look closer at what we buy.",
    date: "October 2026",
    tag: "Market Alert",
    duration: "1:00",
    aiFeature: "Oral-B crimp seal analysis, print kerning distortion & barcode parity validation",
  },
  {
    id: "alarm-video-part-2",
    type: "local",
    title: "Fak€ Products: Adulterated Consumables & Tampered Household Goods (Part 2)",
    authorName: "Daveplay Blog",
    authorHandle: "@daveplayblog",
    sourceUrl: "https://www.instagram.com/p/Dc3JLiuCMS9/?img_index=2",
    embedUrl: "",
    localVideoUrl: alarmVid2,
    thumbnailUrl: alarmCoverImg,
    platform: "Instagram",
    location: "Idumota & Trade Fair Complex, Lagos",
    summary: "Citizen demonstration comparing authentic manufacturer goods with hazardous knockoffs sold at regular retail prices across popular shopping hubs.",
    quote: "If you observe the cap seal and the print quality carefully, you will immediately notice the difference between original and clone.",
    date: "October 2026",
    tag: "Consumer Vigilance",
    duration: "1:00",
    aiFeature: "Tamper band breakage detection & packaging gloss micro-sheen variance",
  },
  {
    id: "alarm-video-part-4",
    type: "local",
    title: "Fak€ Products: Chemical Food Coatings & Synthetic Produce Alert (Part 3)",
    authorName: "Citizen Consumer Sentinel",
    authorHandle: "@citizen_sentinel_ng",
    sourceUrl: "https://www.instagram.com/p/Dc3JLiuCMS9/?img_index=4",
    embedUrl: "",
    localVideoUrl: alarmVid4,
    thumbnailUrl: alarmCoverImg,
    platform: "Organic",
    location: "Mile 12 & Bodija Markets, Ibadan / Lagos",
    summary: "Forensic hot-water test uncovering dangerous artificial paraffin wax coatings and toxic preservation chemicals applied to fresh market produce to mask decay.",
    quote: "Look at the boiling water test—the artificial wax layer melts off right before your eyes. This is what unsuspecting families consume!",
    date: "October 2026",
    tag: "Food Safety Alert",
    duration: "0:42",
    aiFeature: "Wax melting light refraction & surface color saturation index",
  },
  {
    id: "alarm-video-part-5",
    type: "local",
    title: "Fak€ Products: Diluted Drinks & Duplicate Beverage Packaging (Part 4)",
    authorName: "Citizen Vigilance Hub",
    authorHandle: "@nigeria_market_watch",
    sourceUrl: "https://www.instagram.com/p/Dc3JLiuCMS9/?img_index=5",
    embedUrl: "",
    localVideoUrl: alarmVid5,
    thumbnailUrl: alarmCoverImg,
    platform: "TikTok",
    location: "Onitsha Main Market, Anambra",
    summary: "Undercover footage exposing syndicates refilling branded liquor, soft drinks, and bottled water with unwholesome concoctions and resealing with counterfeit caps.",
    quote: "They reuse original empty bottles and recap them with adulterated spirits and soft drinks. Check the crown cap ridge before drinking!",
    date: "October 2026",
    tag: "Beverages Alert",
    duration: "1:00",
    aiFeature: "Cap crown re-crimping ridges & fill-line height anomaly detection",
  },
  {
    id: "alarm-video-part-6",
    type: "local",
    title: "Fak€ Products: Cloned Prescription Drugs & Distorted Foil Seals (Part 5)",
    authorName: "Daveplay Blog",
    authorHandle: "@daveplayblog",
    sourceUrl: "https://www.instagram.com/p/Dc3JLiuCMS9/?img_index=6",
    embedUrl: "",
    localVideoUrl: alarmVid6,
    thumbnailUrl: alarmCoverImg,
    platform: "Instagram",
    location: "Sabon Gari Market, Kano",
    summary: "Urgent market warning identifying cloned pharmaceutical blister packs with fake batch numbers and blurred typography circulating without regulatory clearance.",
    quote: "Counterfeit antimalarials and antibiotics have flooded open drug sections. Always verify the NAFDAC registration number and scratch PIN.",
    date: "October 2026",
    tag: "Pharmaceutical Raid",
    duration: "0:57",
    aiFeature: "Foil texture grain analysis & batch code typeface mismatch",
  },
  {
    id: "alarm-video-part-7",
    type: "local",
    title: "Fak€ Products: Adulterated Baby Formula & Toxic Cosmetics (Part 6)",
    authorName: "Consumer Rights Advocacy NG",
    authorHandle: "@consumer_advocacy_ng",
    sourceUrl: "https://www.instagram.com/p/Dc3JLiuCMS9/?img_index=7",
    embedUrl: "",
    localVideoUrl: alarmVid7,
    thumbnailUrl: alarmCoverImg,
    platform: "Organic",
    location: "Alaba International & Computer Village, Lagos",
    summary: "Citizen testing highlighting mercury-heavy cosmetic clones, counterfeit lotions, and adulterated infant formula with compromised security foils.",
    quote: "Our children and mothers are at risk. Toxic chemical bleaching creams and cloned baby food are killing Nigerians slowly.",
    date: "October 2026",
    tag: "Cosmetics & Infant Alert",
    duration: "1:00",
    aiFeature: "Security foil seal integrity & micro-print alignment verification",
  },
  {
    id: "alarm-video-part-8",
    type: "local",
    title: "Fak€ Products: Recycled Engine Oil & Electrical Hazard Hardware (Part 7)",
    authorName: "Daveplay Blog",
    authorHandle: "@daveplayblog",
    sourceUrl: "https://www.instagram.com/p/Dc3JLiuCMS9/?img_index=8",
    embedUrl: "",
    localVideoUrl: alarmVid8,
    thumbnailUrl: alarmCoverImg,
    platform: "Instagram",
    location: "Ladipo Auto Spares Market, Lagos",
    summary: "Detailed investigation revealing recycled black sludge packaged into duplicate motor oil canisters and hazardous undersized electrical cables.",
    quote: "Rebottled transformer oil sold as synthetic lubricant knocks your car engine in under a month. Inspect the plastic seam before paying.",
    date: "October 2026",
    tag: "Automotive Alert",
    duration: "0:55",
    aiFeature: "Holographic tamper sticker sheen & canister mold seam irregularity",
  },
  {
    id: "alarm-video-part-10",
    type: "local",
    title: "Fak€ Products: Urgent Citizen Call On NAFDAC & Enforcement Action (Part 8)",
    authorName: "Daveplay Blog",
    authorHandle: "@daveplayblog",
    sourceUrl: "https://www.instagram.com/p/Dc3JLiuCMS9/?img_index=10",
    embedUrl: "",
    localVideoUrl: alarmVid10,
    thumbnailUrl: alarmCoverImg,
    platform: "Instagram",
    location: "National Appeal / Abuja Headquarters",
    summary: "Final urgent call to action demanding nationwide regulatory crackdowns, intensified market raids, and public crowdsourced surveillance against counterfeit cartels.",
    quote: "NAFDAC and security agencies must step in immediately. Every citizen must report counterfeit products to protect Nigerian lives.",
    date: "October 2026",
    tag: "NAFDAC Urgent Appeal",
    duration: "0:09",
    aiFeature: "Official regulatory stamp validation & emergency priority flag",
  },
];

const STORAGE_KEY = "fake9ja_video_testimonies_alarm_v4";

export function loadStoredTestimonies(): VideoTestimony[] {
  if (typeof window === "undefined") return initialVideoTestimonies;
  try {
    // Purge obsolete legacy demo keys
    window.localStorage.removeItem("fake9ja_video_testimonies");
    window.localStorage.removeItem("fake9ja_video_testimonies_v2");
    window.localStorage.removeItem("fake9ja_video_testimonies_v3");

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialVideoTestimonies));
      return initialVideoTestimonies;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Filter out any legacy dummy demo ids
      const filteredParsed = parsed.filter(
        (item: VideoTestimony) =>
          !["ig-tunde-ednut-commute-alert", "yt-nafdac-open-market-raid", "local-citizen-voice-abuja", "local-citizen-onitsha-oil"].includes(String(item.id))
      );
      const filteredIds = new Set(filteredParsed.map((item: VideoTestimony) => String(item.id)));
      const missingInitial = initialVideoTestimonies.filter((init) => !filteredIds.has(String(init.id)));
      const finalItems = [...filteredParsed, ...missingInitial];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(finalItems));
      return finalItems;
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
