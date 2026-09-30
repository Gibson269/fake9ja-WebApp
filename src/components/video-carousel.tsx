import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  ExternalLink,
  Video,
  Instagram,
  Youtube,
  Share2,
  PlusCircle,
  Cpu,
  Film,
  X,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  loadStoredTestimonies,
  saveStoredTestimonies,
  parseVideoSource,
  getVideoThumbnail,
  type VideoTestimony,
  type VideoPlatform,
} from "@/lib/testimonies";
import { Fake9jaAPI } from "@/lib/api";
import { toast } from "sonner";

export function VideoCarousel() {
  const [items, setItems] = useState<VideoTestimony[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterPlatform, setFilterPlatform] = useState<"All" | "YouTube" | "Instagram" | "TikTok" | "Organic">("All");
  const [activeModalItem, setActiveModalItem] = useState<VideoTestimony | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"focus" | "embed">("focus");
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  // New video link submission state
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newQuote, setNewQuote] = useState("");
  const [newAiFeature, setNewAiFeature] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load testimonies from API + localStorage on mount
  useEffect(() => {
    let isMounted = true;
    const initial = loadStoredTestimonies();
    setItems(initial);

    // Fetch live items from backend if available
    Fake9jaAPI.getVideoTestimonies()
      .then((serverItems) => {
        if (!isMounted || !serverItems || serverItems.length === 0) return;
        const normalized: VideoTestimony[] = serverItems.map((s: any) => {
          const parsed = parseVideoSource(s.source_url || s.local_video_url || "");
          return {
            id: s.id,
            type: parsed.inferredType,
            title: s.title,
            authorName: s.author_name || "Citizen Sentinel",
            authorHandle: s.author_handle || "@citizen",
            sourceUrl: s.source_url || "#",
            embedUrl: s.embed_url || parsed.embedUrl,
            localVideoUrl: s.local_video_url || parsed.localVideoUrl,
            thumbnailUrl: getVideoThumbnail({
              title: s.title,
              thumbnailUrl: s.thumbnail_url,
              sourceUrl: s.source_url,
              embedUrl: s.embed_url,
              tag: s.tag,
              summary: s.summary,
              aiFeature: s.ai_feature,
            }),
            platform: (s.platform || parsed.platform) as VideoPlatform,
            location: s.location || "Nigeria",
            summary: s.summary || "Citizen video report exposing counterfeit packaging anomalies.",
            quote: s.quote || "We (Nigerians) have the power to solve this.",
            date: s.created_at ? new Date(s.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recent",
            tag: s.tag || "Citizen Alert",
            duration: s.duration || "1:00",
            aiFeature: s.ai_feature || "Tamper seal fracture and holographic sheen analysis",
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

  const filteredItems = items.filter((item) => {
    if (filterPlatform === "All") return true;
    if (filterPlatform === "Organic") return item.platform === "Organic" || item.platform === "Local";
    return item.platform === filterPlatform;
  });

  const total = filteredItems.length;

  useEffect(() => {
    if (currentIndex >= total && total > 0) {
      setCurrentIndex(0);
    }
  }, [total, currentIndex]);

  const activeItem: VideoTestimony | undefined = filteredItems[currentIndex] || filteredItems[0];

  const nextSlide = () => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalItem || isAddModalOpen) return;
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModalItem, isAddModalOpen, total]);

  const handleShare = (item: VideoTestimony) => {
    if (navigator.clipboard) {
      const url = item.sourceUrl && item.sourceUrl !== "#" ? item.sourceUrl : window.location.href;
      navigator.clipboard.writeText(url);
      toast.success("Video evidence link copied! Share this alert with fellow Nigerians.");
    }
  };

  const handleAddNewVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please provide a video title.");
      return;
    }

    if (!newUrl.trim() && !selectedFile) {
      toast.error("Please enter a video link (YouTube, Instagram, TikTok, Facebook, etc.) or choose a video file.");
      return;
    }

    setIsSubmitting(true);
    let resolvedUrl = newUrl.trim();
    let resolvedLocalUrl = "";

    if (selectedFile) {
      resolvedLocalUrl = URL.createObjectURL(selectedFile);
      if (!resolvedUrl) resolvedUrl = resolvedLocalUrl;
    }

    const parsed = parseVideoSource(resolvedUrl || resolvedLocalUrl);
    const finalLocalVideoUrl = resolvedLocalUrl || parsed.localVideoUrl;

    const newItem: VideoTestimony = {
      id: `custom-${Date.now()}`,
      type: parsed.inferredType,
      title: newTitle.trim(),
      authorName: newAuthor.trim() || "Citizen Sentinel",
      authorHandle: `@citizen-${Math.floor(100 + Math.random() * 900)}`,
      sourceUrl: resolvedUrl || "#",
      embedUrl: parsed.embedUrl,
      localVideoUrl: finalLocalVideoUrl,
      thumbnailUrl: thumbnailPreview || getVideoThumbnail({ title: newTitle, sourceUrl: resolvedUrl, tag: "", summary: newSummary }) || "/images/hero-scanner.jpg",
      platform: parsed.platform,
      location: newLocation.trim() || "National Markets, Nigeria",
      summary:
        newSummary.trim() ||
        "Citizen recording of suspicious product packaging and anomalies feeding AI computer vision training.",
      quote:
        newQuote.trim() ||
        "We (Nigerians) have the power to solve this. Collective citizen footage teaches the AI model to stop adulteration.",
      date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      tag: "Citizen Video Alert",
      duration: "1:00",
      aiFeature:
        newAiFeature.trim() ||
        "Tamper band break points, barcode misprints, and holographic angle reflections",
    };

    // Attempt to save to backend API
    try {
      await Fake9jaAPI.storeVideoTestimony({
        title: newItem.title,
        source_url: newItem.sourceUrl,
        platform: newItem.platform,
        author_name: newItem.authorName,
        author_handle: newItem.authorHandle,
        location: newItem.location,
        quote: newItem.quote,
        summary: newItem.summary,
        ai_feature: newItem.aiFeature,
        tag: newItem.tag,
        duration: newItem.duration,
        local_video_url: newItem.localVideoUrl,
        video_file: selectedFile,
      });
    } catch {
      // Offline fallback
    }

    const updated = [newItem, ...items];
    setItems(updated);
    saveStoredTestimonies(updated);

    setIsSubmitting(false);
    setIsAddModalOpen(false);
    setFilterPlatform("All");
    setCurrentIndex(0);

    // Reset form
    setNewTitle("");
    setNewUrl("");
    setNewAuthor("");
    setNewLocation("");
    setNewQuote("");
    setNewSummary("");
    setNewAiFeature("");
    setSelectedFile(null);
    setSelectedThumbnail(null);
    setThumbnailPreview("");

    toast.success("Video testimony added! Now visible on the landing carousel.");
  };

  const getPlatformBadge = (platform: VideoPlatform) => {
    switch (platform) {
      case "YouTube":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-600/10 border border-red-600/30 px-2 py-0.5 text-[11px] font-bold text-red-500">
            <Youtube className="size-3" /> YouTube
          </span>
        );
      case "Instagram":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 text-[11px] font-bold text-pink-500">
            <Instagram className="size-3" /> Instagram
          </span>
        );
      case "TikTok":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[11px] font-bold text-cyan-500">
            <Film className="size-3" /> TikTok
          </span>
        );
      case "Facebook":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-600/10 border border-blue-600/30 px-2 py-0.5 text-[11px] font-bold text-blue-500">
            <Video className="size-3" /> Facebook
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-500">
            <Film className="size-3" /> Organic Video
          </span>
        );
    }
  };

  if (!activeItem) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Top Filter and Add Video Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-border bg-card p-1 shadow-xs">
          {(["All", "YouTube", "Instagram", "TikTok", "Organic"] as const).map((plat) => (
            <button
              key={plat}
              onClick={() => {
                setFilterPlatform(plat);
                setCurrentIndex(0);
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                filterPlatform === plat
                  ? "bg-emerald-500 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {plat === "All"
                ? `All Sources (${items.length})`
                : plat === "Organic"
                ? "Organic Clips"
                : plat}
            </button>
          ))}
        </div>

        {/* Quick Add Video Button */}
        <Button
          onClick={() => setIsAddModalOpen(true)}
          size="sm"
          className="rounded-xl font-bold text-xs h-9 px-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
        >
          <PlusCircle className="size-4" />
          <span>+ Add Video Link / Clip</span>
        </Button>
      </div>

      {/* Main Carousel Frame */}
      <div className="relative mx-auto w-full overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl backdrop-blur-sm">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Video className="size-3.5 text-emerald-500" />
              Evidence Clip {currentIndex + 1} of {total}
            </span>
            <span className="hidden sm:inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              AI Vision Training Stream
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle for Embed-friendly platforms */}
            {(activeItem.platform === "Instagram" || activeItem.platform === "YouTube") && (
              <div className="hidden sm:flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-0.5 text-[11px] font-semibold">
                <button
                  onClick={() => setViewMode("focus")}
                  className={`rounded-md px-2 py-0.5 transition-colors cursor-pointer ${
                    viewMode === "focus"
                      ? "bg-card text-foreground font-bold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Video Focus
                </button>
                <button
                  onClick={() => setViewMode("embed")}
                  className={`rounded-md px-2 py-0.5 transition-colors cursor-pointer ${
                    viewMode === "embed"
                      ? "bg-card text-foreground font-bold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Direct Embed
                </button>
              </div>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="size-8 rounded-full border-border bg-secondary/60 hover:bg-secondary cursor-pointer"
              aria-label="Previous video testimony"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="size-8 rounded-full border-border bg-secondary/60 hover:bg-secondary cursor-pointer"
              aria-label="Next video testimony"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Carousel Content View */}
        <div className="p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={String(activeItem.id)}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-center"
            >
              {/* Left Column: Multi-Source Video Canvas */}
              <div className="relative overflow-hidden rounded-2xl border border-border bg-slate-950 aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center group shadow-inner">
                {/* 1. YouTube Video */}
                {activeItem.platform === "YouTube" ? (
                  viewMode === "embed" && activeItem.embedUrl ? (
                    <div className="w-full h-full bg-black">
                      <iframe
                        src={`${activeItem.embedUrl}?rel=0&modestbranding=1`}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={activeItem.title}
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white overflow-hidden">
                      {/* Real Image Preview Background */}
                      <img
                        src={getVideoThumbnail(activeItem)}
                        alt={activeItem.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50 pointer-events-none" />
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                      <div className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-1 text-xs font-bold text-white shadow-lg mb-2">
                        <Youtube className="size-3.5" />
                        <span>YouTube Alert &bull; {activeItem.authorHandle}</span>
                      </div>
                      <h4 className="relative z-10 font-display text-sm sm:text-base md:text-lg font-bold text-white max-w-md line-clamp-2">
                        {activeItem.title}
                      </h4>
                      <p className="relative z-10 mt-2 text-xs text-slate-300 max-w-md line-clamp-2 leading-relaxed">
                        "{activeItem.quote}"
                      </p>
                      <div className="relative z-10 mt-5 flex flex-wrap gap-2.5 justify-center">
                        <Button
                          onClick={() => setActiveModalItem(activeItem)}
                          className="rounded-xl font-bold text-xs h-10 px-5 bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 cursor-pointer"
                        >
                          <Play className="size-3.5 mr-1.5 fill-current" /> Play Full Video
                        </Button>
                        {activeItem.sourceUrl && activeItem.sourceUrl !== "#" && (
                          <Button
                            asChild
                            variant="outline"
                            className="rounded-xl text-xs h-10 px-3.5 border-white/20 bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                          >
                            <a href={activeItem.sourceUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="size-3.5 mr-1.5" /> Open on YouTube
                            </a>
                          </Button>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 z-10">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-red-400" /> {activeItem.location}
                        </span>
                        <span className="font-mono text-red-400 text-[10px]">{activeItem.duration || "Watch"}</span>
                      </div>
                    </div>
                  )
                ) : activeItem.platform === "Instagram" ? (
                  /* 2. Instagram Video */
                  viewMode === "embed" && activeItem.embedUrl ? (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      <iframe
                        src={activeItem.embedUrl}
                        className="w-full h-full border-0"
                        allow="autoplay; encrypted-media; picture-in-picture; web-share"
                        allowFullScreen
                        title={activeItem.title}
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white overflow-hidden">
                      {/* Real Image Preview Background */}
                      <img
                        src={getVideoThumbnail(activeItem)}
                        alt={activeItem.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50 pointer-events-none" />
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                      <div className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 px-3.5 py-1 text-xs font-bold text-white shadow-lg mb-2">
                        <Instagram className="size-3.5" />
                        <span>Instagram Alert &bull; {activeItem.authorHandle}</span>
                      </div>
                      <h4 className="relative z-10 font-display text-sm sm:text-base md:text-lg font-bold text-white max-w-md line-clamp-2">
                        {activeItem.title}
                      </h4>
                      <p className="relative z-10 mt-2 text-xs text-slate-300 max-w-md line-clamp-2 leading-relaxed">
                        "{activeItem.quote}"
                      </p>
                      <div className="relative z-10 mt-5 flex flex-wrap gap-2.5 justify-center">
                        <Button
                          onClick={() => setActiveModalItem(activeItem)}
                          className="rounded-xl font-bold text-xs h-10 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 cursor-pointer"
                        >
                          <Play className="size-3.5 mr-1.5 fill-current" /> Watch Video Extract
                        </Button>
                        {activeItem.sourceUrl && activeItem.sourceUrl !== "#" && (
                          <Button
                            asChild
                            variant="outline"
                            className="rounded-xl text-xs h-10 px-3.5 border-white/20 bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                          >
                            <a href={activeItem.sourceUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="size-3.5 mr-1.5" /> Open on Instagram
                            </a>
                          </Button>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 z-10">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-pink-400" /> {activeItem.location}
                        </span>
                        <span className="font-mono text-pink-400 text-[10px]">{activeItem.duration || "Watch"}</span>
                      </div>
                    </div>
                  )
                ) : activeItem.localVideoUrl ? (
                  /* 3. Organic Local / Direct MP4 Video Player */
                  <div className="relative w-full h-full bg-black flex flex-col items-center justify-center">
                    <video
                      ref={videoPlayerRef}
                      src={activeItem.localVideoUrl}
                      controls
                      playsInline
                      className="w-full h-full object-contain rounded-2xl"
                      poster={activeItem.thumbnailUrl}
                    >
                      Your browser does not support HTML5 video.
                    </video>
                  </div>
                ) : (
                  /* 4. Other Social Embeds (TikTok, Facebook, Web) */
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950">
                    <div className="relative z-10 mb-2">
                      {getPlatformBadge(activeItem.platform)}
                    </div>
                    <h4 className="relative z-10 font-display text-sm sm:text-base font-bold text-white max-w-md line-clamp-2">
                      {activeItem.title}
                    </h4>
                    <p className="relative z-10 mt-2 text-xs text-slate-300 max-w-md line-clamp-2">
                      "{activeItem.quote}"
                    </p>
                    <div className="relative z-10 mt-4 flex gap-2">
                      <Button
                        onClick={() => setActiveModalItem(activeItem)}
                        className="rounded-xl font-bold text-xs h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                      >
                        <Play className="size-3.5 mr-1.5 fill-current" /> Play Video
                      </Button>
                      {activeItem.sourceUrl && activeItem.sourceUrl !== "#" && (
                        <Button
                          asChild
                          variant="outline"
                          className="rounded-xl text-xs h-9 px-3 border-white/20 bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        >
                          <a href={activeItem.sourceUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-3 mr-1" /> View Source
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Key Video Information & AI Training Impact */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {getPlatformBadge(activeItem.platform)}
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <MapPin className="size-3 text-emerald-500" />
                      {activeItem.location}
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {activeItem.tag}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-base sm:text-lg lg:text-xl font-extrabold text-foreground leading-snug">
                    {activeItem.title}
                  </h3>

                  <blockquote className="mt-3 rounded-xl border-l-2 border-emerald-500 bg-secondary/50 p-3 text-xs sm:text-sm text-foreground italic leading-relaxed">
                    “{activeItem.quote}”
                  </blockquote>

                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {activeItem.summary}
                  </p>

                  {/* AI Computer Vision Extraction Feature Box */}
                  <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 flex items-start gap-3">
                    <div className="grid size-8 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Cpu className="size-4" />
                    </div>
                    <div>
                      <strong className="block text-xs font-bold text-foreground">
                        AI Computer Vision Training Relevance:
                      </strong>
                      <span className="text-[11px] text-muted-foreground leading-normal block mt-0.5">
                        {activeItem.aiFeature ||
                          "Optical inspection of print imperfections, tamper seal textures, and price anomaly detection."}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/70">
                  {/* Slide Indicators */}
                  <div className="flex items-center gap-1.5">
                    {filteredItems.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Jump to video slide ${idx + 1}`}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === currentIndex
                            ? "w-6 bg-emerald-500"
                            : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(activeItem)}
                      className="rounded-xl text-xs font-medium cursor-pointer h-8 text-muted-foreground hover:text-foreground"
                    >
                      <Share2 className="size-3.5 mr-1" /> Share Alert
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setActiveModalItem(activeItem)}
                      className="rounded-xl font-bold text-xs h-8 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                    >
                      <Play className="size-3 mr-1 fill-current" /> Expand Theater
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Expanded Theater Video Modal */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md"
            onClick={() => setActiveModalItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl text-foreground"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-secondary/60 shrink-0">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="grid size-7 place-items-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <Video className="size-4" />
                  </span>
                  <div className="truncate">
                    <h4 className="text-xs font-bold truncate text-foreground">
                      {activeModalItem.title}
                    </h4>
                    <span className="text-[10px] text-muted-foreground">
                      {activeModalItem.authorName} ({activeModalItem.authorHandle}) &bull;{" "}
                      {activeModalItem.location} &bull; {activeModalItem.platform}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveModalItem(null)}
                  className="size-8 rounded-full cursor-pointer hover:bg-secondary shrink-0"
                  aria-label="Close video player"
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* Theater Canvas */}
              <div className="relative bg-black flex-1 min-h-[340px] max-h-[65vh] flex items-center justify-center overflow-hidden">
                {activeModalItem.platform === "YouTube" && activeModalItem.embedUrl ? (
                  <iframe
                    src={`${activeModalItem.embedUrl}?autoplay=1&rel=0`}
                    className="w-full h-full aspect-video border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={activeModalItem.title}
                  />
                ) : activeModalItem.platform === "Instagram" && activeModalItem.embedUrl ? (
                  <div className="w-full h-[520px] flex items-center justify-center bg-black">
                    <iframe
                      src={activeModalItem.embedUrl}
                      className="w-full h-full border-0"
                      allow="autoplay; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                      title={activeModalItem.title}
                    />
                  </div>
                ) : activeModalItem.localVideoUrl ? (
                  <video
                    src={activeModalItem.localVideoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain rounded-xl"
                    poster={activeModalItem.thumbnailUrl}
                  >
                    Your browser does not support HTML5 video.
                  </video>
                ) : activeModalItem.embedUrl ? (
                  <iframe
                    src={activeModalItem.embedUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    title={activeModalItem.title}
                  />
                ) : (
                  <div className="p-8 text-center text-white">
                    <Video className="size-12 mx-auto text-emerald-400 mb-2 opacity-80" />
                    <h5 className="font-bold text-sm">{activeModalItem.title}</h5>
                    <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
                      "{activeModalItem.quote}"
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-card border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shrink-0">
                <div className="text-muted-foreground text-[11px] leading-relaxed">
                  <span className="font-semibold text-foreground">AI Training Value:</span>{" "}
                  {activeModalItem.aiFeature || "Extracting tamper proof marks and packaging flaws"}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {activeModalItem.sourceUrl && activeModalItem.sourceUrl !== "#" && (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-xs h-8 cursor-pointer"
                    >
                      <a href={activeModalItem.sourceUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-3 mr-1" /> Open Original Source
                      </a>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => setActiveModalItem(null)}
                    className="rounded-xl text-xs h-8 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Multi-Source Video Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl text-foreground"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-secondary/50">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Film className="size-4 text-emerald-500" />
                    Add Video Testimony from Any Source
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Paste links from YouTube, Instagram, TikTok, Facebook, or upload an organic citizen clip.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAddModalOpen(false)}
                  className="size-8 rounded-full cursor-pointer hover:bg-secondary shrink-0"
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddNewVideo} className="p-5 space-y-3.5 overflow-y-auto flex-1">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Video Title / Headline *
                  </label>
                  <Input
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Counterfeit Antimalarial Blister Packaging in Kano"
                    className="rounded-xl text-xs h-9"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Video Link (YouTube, Instagram, TikTok, Facebook, or MP4)
                  </label>
                  <Input
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or https://instagram.com/reel/..."
                    className="rounded-xl text-xs h-9"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Accepts links from YouTube, Instagram, TikTok, Facebook, Twitter, or direct video URLs.
                  </p>
                </div>

                {/* Local Video File Picker */}
                <div className="rounded-2xl border border-dashed border-border p-3.5 bg-secondary/20">
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Or Upload Citizen Video File (.mp4, .webm, .mov)
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="block w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-600 dark:file:text-emerald-400 hover:file:bg-emerald-500/20 cursor-pointer"
                  />
                </div>

                {/* Thumbnail Image Upload */}
                <div className="rounded-2xl border border-dashed border-amber-500/40 bg-amber-950/10 p-3.5">
                  <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1.5">
                    <svg className="size-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    Upload Thumbnail Image (Optional — .jpg, .png, .webp)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setSelectedThumbnail(file);
                        setThumbnailPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="block w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-600 dark:file:text-amber-400 hover:file:bg-amber-500/20 cursor-pointer"
                  />
                  {thumbnailPreview && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={thumbnailPreview} alt="thumb" className="w-20 h-12 object-cover rounded-lg border border-amber-500/30" />
                      <div className="text-[11px] text-amber-500">
                        <span className="font-semibold block">Thumbnail ready</span>
                        <span className="text-muted-foreground">{selectedThumbnail?.name}</span>
                      </div>
                      <button type="button" onClick={() => { setSelectedThumbnail(null); setThumbnailPreview(""); }} className="ml-auto text-[10px] text-rose-500 hover:underline cursor-pointer">Remove</button>
                    </div>
                  )}
                  {!thumbnailPreview && (
                    <p className="text-[10px] text-muted-foreground mt-1">If not provided, a thumbnail is auto-extracted from the video link.</p>
                  )}
                </div>


                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Sentinel / Creator Name
                    </label>
                    <Input
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Citizen Reporter"
                      className="rounded-xl text-xs h-9"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Nigerian Market / Location
                    </label>
                    <Input
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Sabon Gari Market, Kano"
                      className="rounded-xl text-xs h-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Citizen Quote / Observation
                  </label>
                  <Input
                    value={newQuote}
                    onChange={(e) => setNewQuote(e.target.value)}
                    placeholder="e.g. The hologram was peeling off and the font had visible spelling errors."
                    className="rounded-xl text-xs h-9"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    AI Computer Vision Feature to Train
                  </label>
                  <Input
                    value={newAiFeature}
                    onChange={(e) => setNewAiFeature(e.target.value)}
                    placeholder="e.g. Foil seal light refraction, cap crimping flaws, blurry batch codes"
                    className="rounded-xl text-xs h-9"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl text-xs h-9 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="sm"
                    className="rounded-xl font-bold text-xs h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? "Publishing..." : "Add to Carousel"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
