import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  ExternalLink,
  X,
  MapPin,
  Sparkles,
  UserCheck,
  ArrowUpRight,
} from "lucide-react";
import {
  loadStoredTestimonies,
  saveStoredTestimonies,
  parseVideoSource,
  getVideoThumbnail,
  type VideoTestimony,
  type VideoPlatform,
} from "@/lib/testimonies";
import { Fake9jaAPI } from "@/lib/api";

export function VideoCarousel() {
  const [items, setItems] = useState<VideoTestimony[]>([]);
  const [activeFilter, setActiveFilter] = useState<"All" | "YouTube" | "Instagram" | "TikTok" | "Facebook" | "Organic">("All");
  const [page, setPage] = useState(0);

  // Responsive page size: 1 on mobile (<640px), 2 on tablet (<1024px), 3 on desktop
  const [pageSize, setPageSize] = useState(3);

  // Active video in player modal (only admin adds, users can view and play)
  const [currentVideo, setCurrentVideo] = useState<VideoTestimony | null>(null);

  // Responsive column detection for seamless mobile experience
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setPageSize(1);
      } else if (width < 1024) {
        setPageSize(2);
      } else {
        setPageSize(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load testimonies from API + localStorage on mount
  useEffect(() => {
    let isMounted = true;
    const initial = loadStoredTestimonies();
    setItems(initial);

    // Fetch live items from backend if available
    Fake9jaAPI.getVideoTestimonies()
      .then((serverItems) => {
        if (!isMounted || !serverItems || !Array.isArray(serverItems) || serverItems.length === 0) return;
        const normalized: VideoTestimony[] = serverItems.map((s: any) => {
          const parsed = parseVideoSource(s?.source_url || s?.local_video_url || "");
          return {
            id: s?.id || `vid-${Date.now()}`,
            type: parsed.inferredType,
            title: s?.title || "Citizen Alert",
            authorName: s?.author_name || "Citizen Sentinel",
            authorHandle: s?.author_handle || "@citizen",
            sourceUrl: s?.source_url || "#",
            embedUrl: s?.embed_url || parsed.embedUrl,
            localVideoUrl: s?.local_video_url || parsed.localVideoUrl,
            thumbnailUrl: getVideoThumbnail({
              title: s?.title,
              thumbnailUrl: s?.thumbnail_url,
              sourceUrl: s?.source_url,
              embedUrl: s?.embed_url,
              tag: s?.tag,
              summary: s?.summary,
              aiFeature: s?.ai_feature,
            }),
            platform: (s?.platform || parsed.platform) as VideoPlatform,
            location: s?.location || "Nigeria",
            summary: s?.summary || "Citizen video report exposing counterfeit packaging anomalies.",
            quote: s?.quote || "We (Nigerians) have the power to solve this.",
            date: s?.created_at
              ? new Date(s.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
              : "Recent",
            tag: s?.tag || "Citizen Alert",
            duration: s?.duration || "1:00",
            aiFeature: s?.ai_feature || "Tamper seal fracture and holographic sheen analysis",
          };
        });

        // Merge without losing initial defaults
        const existingIds = new Set(normalized.map((n) => String(n.id)));
        const merged = [...normalized, ...initial.filter((init) => !existingIds.has(String(init.id)))];
        setItems(merged);
        saveStoredTestimonies(merged);
      })
      .catch(() => {
        // Fallback to local
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter videos
  const filteredVideos = items.filter((v) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Organic") return v.platform === "Organic" || v.platform === "Local";
    return v.platform.toLowerCase() === activeFilter.toLowerCase();
  });

  const maxPage = Math.max(0, Math.ceil(filteredVideos.length / pageSize) - 1);

  // Auto-reset page if filter or resize leaves page out of bounds
  useEffect(() => {
    if (page > maxPage) {
      setPage(0);
    }
  }, [maxPage, page]);

  const visibleVideos = filteredVideos.slice(page * pageSize, page * pageSize + pageSize);

  const next = () => {
    setPage((prev) => (prev >= maxPage ? 0 : prev + 1));
  };

  const prev = () => {
    setPage((prev) => (prev <= 0 ? maxPage : prev - 1));
  };

  const setFilter = (p: typeof activeFilter) => {
    setActiveFilter(p);
    setPage(0);
  };

  const getPlatformDotColor = (platform: VideoPlatform) => {
    switch (platform) {
      case "YouTube":
        return "bg-red-500";
      case "Instagram":
        return "bg-pink-500";
      case "TikTok":
        return "bg-cyan-400";
      case "Facebook":
        return "bg-blue-500";
      default:
        return "bg-emerald-400";
    }
  };

  return (
    <div className="w-full">
      {/* Controls & Filter Bar (Mobile-Optimized Horizontal Scroll) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3.5">
        {/* Filter Pills with touch-friendly horizontal scrolling on mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-0">
          {(["All", "YouTube", "Instagram", "TikTok", "Facebook", "Organic"] as const).map((p) => {
            const isActive = activeFilter === p;
            return (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-xs cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20"
                    : "bg-card text-foreground/80 border-border hover:border-emerald-500/60 hover:text-foreground"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Navigation Pagination Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          <span className="text-[11px] font-mono font-medium text-muted-foreground">
            {page + 1} / {maxPage + 1}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={prev}
              className="p-2 rounded-xl bg-card border border-border text-foreground hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition shadow-xs cursor-pointer active:scale-95"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="p-2 rounded-xl bg-card border border-border text-foreground hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition shadow-xs cursor-pointer active:scale-95"
              aria-label="Next video"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Card Grid (1 col on mobile, 2 on tablet, 3 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {visibleVideos.map((item, idx) => {
            const thumbUrl = getVideoThumbnail(item);
            const isOrganic = item.localVideoUrl || item.platform === "Organic";

            return (
              <motion.div
                key={String(item.id || idx)}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => setCurrentVideo(item)}
                className="group relative rounded-3xl overflow-hidden border border-border/80 bg-card hover:border-emerald-500/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/5 flex flex-col cursor-pointer"
              >
                {/* 16:9 Thumbnail & Video Preview Trigger */}
                <div
                  className="relative aspect-video bg-slate-950 overflow-hidden"
                  onMouseEnter={(e) => {
                    const v = e.currentTarget.querySelector("video");
                    if (v) v.play().catch(() => {});
                  }}
                  onMouseLeave={(e) => {
                    const v = e.currentTarget.querySelector("video");
                    if (v) {
                      v.pause();
                      v.currentTime = 0;
                    }
                  }}
                >
                  {/* Organic Video Live Preview Snippet on hover */}
                  {isOrganic ? (
                    <video
                      src={item.localVideoUrl || item.sourceUrl}
                      poster={thumbUrl}
                      preload="none"
                      muted
                      playsInline
                      loop
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    /* Social / External High-Res Dynamic Thumbnail Preview */
                    <img
                      src={thumbUrl}
                      alt={item.title}
                      decoding="async"
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

                  {/* Platform Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur border border-white/10 text-[11px] font-bold text-white shadow-sm z-10">
                    <span className={`w-2 h-2 rounded-full ${getPlatformDotColor(item.platform)}`} />
                    <span>{item.platform}</span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-slate-200 z-10">
                    {item.duration || "Video"}
                  </div>

                  {/* Big Play Center Overlay Button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 transform group-hover:scale-110 transition duration-300">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Location strip */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 z-10">
                    <span className="flex items-center gap-1 truncate font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item.location || "Nigeria"}</span>
                    </span>
                    <span className="text-emerald-400 font-bold shrink-0">Play Evidence &rarr;</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {item.tag || "Citizen Alert"}
                    </span>

                    <h3 className="font-heading font-bold text-sm sm:text-base text-foreground mt-2 line-clamp-2 leading-snug group-hover:text-emerald-500 transition">
                      {item.title}
                    </h3>

                    {item.quote && (
                      <blockquote className="mt-2 text-xs italic text-muted-foreground border-l-2 border-emerald-500/60 pl-2.5 line-clamp-2">
                        “{item.quote}”
                      </blockquote>
                    )}
                  </div>

                  {/* AI Anomaly Tag & Sentinel Info */}
                  <div className="pt-3 border-t border-border/80 text-[11px] text-muted-foreground space-y-1.5">
                    {item.aiFeature && (
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.aiFeature}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-medium truncate">{item.authorName}</span>
                      <span className="font-mono text-[10px]">{item.authorHandle}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Pagination Indicator Dots */}
      {maxPage > 0 && (
        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-1.5">
          {Array.from({ length: maxPage + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                page === i ? "w-6 bg-emerald-500" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      )}

      {/* In-Page Interactive Video Player Modal (Mobile-friendly full-viewport dialog) */}
      <AnimatePresence>
        {currentVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-md"
            onClick={() => setCurrentVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-slate-900 border border-emerald-500/40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="p-3.5 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
                <div className="flex items-center gap-2.5 truncate pr-2">
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    {currentVideo.platform || "Video Evidence"}
                  </span>
                  <h3 className="font-heading font-bold text-xs sm:text-base text-white truncate max-w-xs sm:max-w-xl">
                    {currentVideo.title}
                  </h3>
                </div>
                <button
                  onClick={() => setCurrentVideo(null)}
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Video Player Container */}
              <div className="relative aspect-video bg-black flex items-center justify-center flex-1 overflow-hidden">
                {/* Direct Organic Video Player */}
                {currentVideo.localVideoUrl || currentVideo.platform === "Organic" ? (
                  <video
                    src={currentVideo.localVideoUrl || currentVideo.sourceUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : currentVideo.embedUrl ? (
                  /* YouTube / Embed Player */
                  <iframe
                    src={`${currentVideo.embedUrl}?autoplay=1&rel=0`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title={currentVideo.title}
                  />
                ) : (
                  /* External Fallback if no embed available */
                  <div className="p-6 sm:p-8 text-center space-y-3 sm:space-y-4">
                    <ExternalLink className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 mx-auto" />
                    <p className="text-white text-sm sm:text-base">
                      This video is hosted externally on{" "}
                      <span className="font-bold text-emerald-400">{currentVideo.platform}</span>.
                    </p>
                    <a
                      href={currentVideo.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition"
                    >
                      <span>Open Video On {currentVideo.platform}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Forensic Footer & Details */}
              <div className="p-3.5 sm:p-5 bg-slate-950/80 border-t border-slate-800 space-y-2.5 sm:space-y-3 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                    <span className="text-slate-300 font-bold text-[11px] sm:text-xs">{currentVideo.authorName}</span>
                    <span className="text-slate-500 font-mono text-[10px]">{currentVideo.authorHandle}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{currentVideo.location}</span>
                  </div>
                </div>

                {currentVideo.summary && (
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {currentVideo.summary}
                  </p>
                )}

                <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 text-[11px] sm:text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{currentVideo.aiFeature || "AI Anomaly Verified"}</span>
                  </div>
                  {currentVideo.sourceUrl && currentVideo.sourceUrl !== "#" && (
                    <a
                      href={currentVideo.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline font-bold text-[10px] sm:text-[11px] shrink-0 ml-2"
                    >
                      Original Source &rarr;
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
