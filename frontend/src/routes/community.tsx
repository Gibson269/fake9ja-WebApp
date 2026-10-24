import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Camera,
  Clock,
  ExternalLink,
  Eye,
  Flame,
  Grid2X2,
  Map,
  MapPin,
  Maximize2,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { NigeriaMap } from "@/components/nigeria-map";
import { SiteShell } from "@/components/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fake9jaAPI, formatMediaUrl, getCategoryFallbackImage, type ReportItem } from "@/lib/api";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Fake9ja — Live Incident Radar & Market Hotspots" },
      { name: "description", content: "Explore citizen counterfeit product reports and open market hotspots across Nigeria with Fake9ja." },
      { property: "og:title", content: "Fake9ja — Community Incident Radar" },
      { property: "og:description", content: "Live crowd-sourced intelligence on fake products in Nigerian markets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Community,
});

function Community() {
  const [view, setView] = useState<"grid" | "map">("grid");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState<{ src: string; title: string; ref: string } | null>(null);
  const [stats, setStats] = useState<{
    total_reports: number;
    verified_fake: number;
    hotspot_count: number;
    states_active: number;
  } | null>(null);
  const [hotspotsList, setHotspotsList] = useState<any[]>([]);

  const loadReports = async () => {
    setLoading(true);
    const data = await Fake9jaAPI.getReports({
      category: filter,
      search: search.trim() || undefined,
    });
    setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, [filter]);

  useEffect(() => {
    Fake9jaAPI.getPublicStats().then((data) => {
      if (data) {
        setStats({
          total_reports: data.total_reports,
          verified_fake: data.verified_fake,
          hotspot_count: data.hotspot_count,
          states_active: data.states_active,
        });
      }
    });

    Fake9jaAPI.getHotspots().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setHotspotsList(data);
      }
    });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadReports();
  };

  return (
    <SiteShell>
      {/* Hero Header */}
      <section className="relative overflow-hidden px-4 pb-12 pt-10 sm:px-6 md:px-8 bg-gradient-to-b from-secondary/40 to-background border-b border-border">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Fake9ja Live Incident Radar
              </div>
              <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl md:text-5xl tracking-tight">
                What Nigerians Are Flagging, Right Now.
              </h1>
              <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
                All reports are synchronized with our MySQL intelligence queue. Explore verified fake batches and high-risk commercial markets across all 36 states and the FCT.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {[
                [
                  (stats?.total_reports ?? (reports.length > 0 ? reports.length : 9)).toLocaleString(),
                  "Total Reports",
                  `${stats?.states_active ?? 4} States Active`,
                ],
                [
                  (stats?.verified_fake ?? reports.filter((r) => r.status === "verified_fake").length).toLocaleString(),
                  "Verified Fakes",
                  "Confirmed Warnings",
                ],
                [
                  `${stats?.hotspot_count ?? (hotspotsList.length > 0 ? hotspotsList.length : 8)} Hotspots`,
                  "High Alert",
                  "Tracked Markets",
                ],
              ].map(([n, l, s]) => (
                <div key={l} className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-xs">
                  <strong className="font-display text-xl sm:text-2xl font-extrabold text-foreground">{n}</strong>
                  <span className="mt-0.5 block text-xs font-bold text-emerald-600 dark:text-emerald-400">{l}</span>
                  <span className="text-[10px] text-muted-foreground">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Control Bar: Categories & Search */}
      <section className="px-4 py-8 sm:px-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {["All", "Medicines", "Food & drinks", "Cosmetics", "Electronics", "Automotive"].map((x) => (
                <Button
                  size="sm"
                  key={x}
                  variant={filter === x ? "default" : "outline"}
                  onClick={() => setFilter(x)}
                  className={`rounded-xl text-xs font-bold h-9 px-4 cursor-pointer transition-all ${
                    filter === x ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm" : ""
                  }`}
                >
                  {x}
                </Button>
              ))}
            </div>

            {/* Search and View Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search product, market, ID..."
                  className="h-9 pl-9 rounded-xl text-xs"
                />
              </form>

              <Button
                variant="outline"
                size="sm"
                onClick={loadReports}
                title="Refresh MySQL data"
                className="rounded-xl h-9 px-3 cursor-pointer"
              >
                <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              </Button>

              <div className="flex rounded-xl bg-secondary p-0.5 border border-border">
                <Button
                  size="sm"
                  variant={view === "grid" ? "default" : "ghost"}
                  onClick={() => setView("grid")}
                  className="rounded-lg text-xs font-bold h-8 px-3 cursor-pointer"
                >
                  <Grid2X2 className="size-3.5 mr-1.5" />
                  Grid
                </Button>
                <Button
                  size="sm"
                  variant={view === "map" ? "default" : "ghost"}
                  onClick={() => setView("map")}
                  className="rounded-lg text-xs font-bold h-8 px-3 cursor-pointer"
                >
                  <Map className="size-3.5 mr-1.5" />
                  Naija Map
                </Button>
              </div>
            </div>
          </div>

          {/* Main Grid View */}
          {view === "grid" ? (
            <div className="mt-8">
              {loading ? (
                <div className="py-20 text-center text-sm text-muted-foreground">
                  <RefreshCw className="mx-auto size-6 animate-spin text-emerald-500 mb-2" />
                  Connecting to Fake9ja MySQL backend...
                </div>
              ) : reports.length === 0 ? (
                <div className="py-20 text-center">
                  <ShieldCheck className="mx-auto size-12 text-muted-foreground/30" />
                  <p className="mt-3 font-display text-base font-bold">No reports found for "{filter}"</p>
                  <p className="text-xs text-muted-foreground mt-1">Try selecting 'All' or searching for another keyword.</p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {reports.map((r) => {
                    const isFake = r.status === "verified_fake";
                    const isUnderReview = r.status === "under_review";
                    const primaryMedia = (r.media_urls && r.media_urls.length > 0)
                      ? formatMediaUrl(r.media_urls[0])
                      : getCategoryFallbackImage(r.category);

                    return (
                      <article
                        key={r.reference_id}
                        className="group overflow-hidden rounded-2xl border border-border bg-card shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          {/* Card Banner with Real Evidence Photo */}
                          <div
                            onClick={() =>
                              setLightboxImg({
                                src: primaryMedia,
                                title: r.product_name,
                                ref: r.reference_id,
                              })
                            }
                            className="relative aspect-[16/9] cursor-zoom-in overflow-hidden bg-slate-950 p-4 flex flex-col justify-between text-white"
                          >
                            <img
                              src={primaryMedia}
                              alt={r.product_name}
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getCategoryFallbackImage(r.category);
                              }}
                              className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Ambient Scrim Overlay for crisp text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60 z-0" />

                            <div className="flex items-center justify-between z-10">
                              <Badge
                                className={`text-[10px] font-extrabold uppercase tracking-wider rounded-lg px-2.5 py-0.5 shadow-sm ${
                                  isFake
                                    ? "bg-destructive text-white"
                                    : isUnderReview
                                    ? "bg-amber-500 text-slate-950 font-black"
                                    : "bg-emerald-600 text-white"
                                }`}
                              >
                                {r.status.replace("_", " ")}
                              </Badge>

                              <div className="flex items-center gap-1.5">
                                {r.media_urls && r.media_urls.length > 1 && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2 py-0.5 text-[9px] font-mono font-bold text-white border border-white/20">
                                    <Camera className="size-2.5 text-emerald-400" /> +{r.media_urls.length}
                                  </span>
                                )}
                                {r.is_priority && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 backdrop-blur px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-400/30">
                                    <Zap className="size-2.5" /> Fast-Track
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="z-10 flex items-end justify-between">
                              <span className="font-mono text-xs font-bold text-slate-300 drop-shadow">
                                #{r.reference_id}
                              </span>
                              {r.purchase_price && (
                                <span className="rounded-lg bg-black/50 backdrop-blur px-2.5 py-0.5 text-xs font-mono font-bold text-white ring-1 ring-white/20">
                                  {r.purchase_price}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Card Details */}
                          <div className="p-5">
                            <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              <span>{r.category}</span>
                              <span className="text-muted-foreground font-normal lowercase">{r.created_at}</span>
                            </div>

                            <h2 className="mt-1.5 font-display text-base font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                              {r.product_name}
                            </h2>

                            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                              <strong className="text-foreground">Observed Anomaly:</strong> “{r.issue_type}”
                            </p>

                            {r.details && (
                              <p className="mt-1 text-[11px] text-muted-foreground/80 line-clamp-2">
                                {r.details}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="p-5 pt-0">
                          <div className="flex items-center justify-between border-t border-border pt-3.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5 font-medium truncate max-w-[190px]">
                              <MapPin className="size-3.5 text-emerald-500 shrink-0" />
                              <span className="truncate">{r.market_address}</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setLightboxImg({
                                    src: primaryMedia,
                                    title: r.product_name,
                                    ref: r.reference_id,
                                  })
                                }
                                className="text-muted-foreground hover:text-foreground text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="size-3 text-emerald-500" /> Evidence
                              </button>
                              <Link
                                to="/track"
                                className="text-emerald-500 hover:underline font-bold text-xs shrink-0"
                              >
                                Track →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Nigeria Interactive Hotspot Map View */
            <div className="mt-8 grid gap-8 rounded-3xl border border-border bg-card p-6 shadow-sm lg:grid-cols-[1.3fr_.7fr]">
              <div className="rounded-2xl bg-secondary/30 p-6 flex flex-col justify-between border border-border/80">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    National Incident Density Map
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Visualizing verified reports and counterfeit density clusters across Nigerian geopolitical zones.
                  </p>
                </div>

                <div className="my-6">
                  <NigeriaMap />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-muted-foreground pt-3 border-t border-border">
                  <span className="flex items-center gap-1.5"><i className="size-3 rounded-full bg-primary/25" /> Low Threat</span>
                  <span className="flex items-center gap-1.5"><i className="size-3 rounded-full bg-emerald-500" /> Active Surveillance</span>
                  <span className="flex items-center gap-1.5"><i className="size-3 rounded-full bg-destructive" /> Critical Hotspot</span>
                </div>
              </div>

              {/* Active Hotspot Feed */}
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Highest Incident Stalls
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Locations currently generating the highest volume of consumer warnings.
                </p>

                <div className="mt-5 space-y-3">
                  {reports.slice(0, 5).map((r) => (
                    <div key={r.reference_id} className="rounded-xl border border-border bg-secondary/40 p-3.5 hover:bg-secondary/70 transition-colors">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono">#{r.reference_id}</span>
                        <span className="text-muted-foreground">{r.state}</span>
                      </div>
                      <strong className="mt-1 block text-sm font-bold text-foreground">{r.product_name}</strong>
                      <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3 text-destructive" /> {r.market_address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Hotspots Leaderboard Section */}
      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 md:px-8 border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.85fr_1.15fr] items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-destructive/20 px-3 py-1 text-xs font-bold text-destructive uppercase tracking-wider">
              <Flame className="size-3.5" /> High Risk Open Markets
            </div>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              Nigerian Market Hotspot Watch
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              These wholesale and retail distribution hubs currently account for over 65% of flagged counterfeit reports logged into the Fake9ja system. Exercise extreme caution and inspect seals when buying in these locations.
            </p>
            <div className="mt-6">
              <Button asChild size="default" className="rounded-xl font-bold text-xs h-10 px-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950">
                <Link to="/report">
                  Report a Market Stall Now →
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {(hotspotsList.length > 0
              ? hotspotsList.slice(0, 6)
              : [
                  { name: "Balogun Market, Lagos Island", state: "Lagos", incident_count: 186, trend: "up", risk_level: "high" },
                  { name: "Sabon Gari Market, Kano", state: "Kano", incident_count: 142, trend: "up", risk_level: "high" },
                  { name: "Onitsha Main Market", state: "Anambra", incident_count: 163, trend: "up", risk_level: "high" },
                  { name: "Computer Village, Ikeja", state: "Lagos", incident_count: 121, trend: "stable", risk_level: "medium" },
                  { name: "Ariaria International Market, Aba", state: "Abia", incident_count: 97, trend: "up", risk_level: "high" },
                  { name: "Ladipo Auto Spare Parts Market", state: "Lagos", incident_count: 90, trend: "up", risk_level: "high" },
                ]
            ).map((h: any, i: number) => (
              <div
                key={h.id || h.name}
                className="grid grid-cols-[32px_1fr_auto_auto] items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs backdrop-blur hover:bg-white/10 transition-colors"
              >
                <strong className="font-display text-base font-extrabold text-emerald-400">
                  #{i + 1}
                </strong>
                <div>
                  <strong className="text-white text-sm block">{h.name}</strong>
                  <span className="text-[11px] text-slate-400">
                    {h.state} • Risk: {h.risk_level ? String(h.risk_level).toUpperCase() : "HIGH"}
                  </span>
                </div>
                <span className="font-mono font-bold text-white text-xs">{h.incident_count} reports</span>
                {h.trend === "up" ? (
                  <span className="flex items-center text-rose-400 font-bold text-[11px]">
                    <ArrowUp className="size-3.5 mr-0.5" /> High
                  </span>
                ) : (
                  <span className="flex items-center text-amber-400 font-bold text-[11px]">
                    <TrendingUp className="size-3.5 mr-0.5" /> Watch
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forensic Evidence Lightbox Modal */}
      <AnimatePresence>
        {lightboxImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImg(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 max-w-4xl w-full overflow-hidden rounded-3xl border border-white/20 bg-slate-950 p-4 sm:p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    Evidence Case #{lightboxImg.ref}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white mt-0.5">
                    {lightboxImg.title}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLightboxImg(null)}
                  className="rounded-full text-white hover:bg-white/10"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <div className="mt-4 relative aspect-[16/10] overflow-hidden rounded-2xl bg-black flex items-center justify-center">
                <img
                  src={lightboxImg.src}
                  alt={lightboxImg.title}
                  className="size-full object-contain"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  Verified Forensic Evidence Archive • Fake9ja Sentinel
                </span>
                <div className="flex gap-2">
                  <a
                    href={lightboxImg.src}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
                  >
                    <Maximize2 className="size-3.5" /> Full Resolution
                  </a>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-lg h-8 px-3 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                  >
                    <Link to="/track">Track Case</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SiteShell>
  );
}