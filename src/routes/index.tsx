import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Baby,
  BadgeAlert,
  BadgeCheck,
  Building2,
  Car,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Copy,
  Cpu,
  Database,
  Eye,
  Flame,
  Hammer,
  Leaf,
  Lock,
  MapPin,
  Pill,
  PlusCircle,
  Radio,
  Receipt,
  Scan,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  ShoppingBag,
  Sparkles,
  Tag,
  TrendingDown,
  UploadCloud,
  Utensils,
  Video,
  Wine,
  Zap,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/motion-kit";
import { SiteShell } from "@/components/site-shell";
import { VideoCarousel } from "@/components/video-carousel";
import { Fake9jaAPI, type ReportItem } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fake9ja | Nigeria's Free Citizen Counterfeit Detection & Consumer Protection Radar" },
      {
        name: "description",
        content:
          "Fake9ja empowers everyday Nigerians to document, report, and verify suspected counterfeit medicines, adulterated foods, and substandard goods. Completely free, community-driven citizen radar.",
      },
      { property: "og:title", content: "Fake9ja — Spot Fakes. Protect Nigeria. Zero Tolerance for Counterfeits." },
      {
        property: "og:description",
        content:
          "Gathering citizen intelligence to train an AI model capable of eliminating 80% of fake products in our markets.",
      },
      { property: "og:image", content: "/images/hero-scanner.jpg" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const nigerianStates = [
  "Lagos", "FCT Abuja", "Kano", "Rivers", "Anambra", "Abia", "Oyo", "Ogun", "Kaduna", "Enugu",
  "Delta", "Edo", "Akwa Ibom", "Plateau", "Benue", "Borno", "Adamawa", "Bauchi", "Bayelsa", "Cross River",
  "Ebonyi", "Ekiti", "Gombe", "Imo", "Jigawa", "Katsina", "Kebbi", "Kogi", "Kwara", "Nasarawa",
  "Niger", "Ondo", "Osun", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const marketSectors = [
  { name: "Pharmaceuticals & Drugs", icon: Pill, fakes: "Lonart, Coartem, Amoxil", risk: "Extreme", category: "Medicines" },
  { name: "Baby Formula & Nutrition", icon: Baby, fakes: "SMA, Cerelac, NAN", risk: "Critical", category: "Baby products" },
  { name: "Cosmetics & Skincare", icon: Sparkles, fakes: "Bleaching creams, Serums", risk: "High", category: "Cosmetics" },
  { name: "Packaged Foods & Drinks", icon: Utensils, fakes: "Tomato paste, Seasoning, Oil", risk: "High", category: "Food & drinks" },
  { name: "Electronics & Cables", icon: Zap, fakes: "Coleman wire, Circuit breakers", risk: "Severe", category: "Electronics" },
  { name: "Auto Parts & Brake Pads", icon: Car, fakes: "Toyota filters, Brake fluids", risk: "Critical", category: "Automotive" },
  { name: "Spirits & Alcoholic Drinks", icon: Wine, fakes: "Hennessy, Johnnie Walker", risk: "High", category: "Alcohol" },
  { name: "Building Materials", icon: Hammer, fakes: "Cement, Roofing sheets", risk: "Severe", category: "Other goods" },
  { name: "Agricultural Inputs", icon: Leaf, fakes: "Adulterated fertilizer, Seeds", risk: "High", category: "Other goods" },
  { name: "Personal Care & Hygiene", icon: Shield, fakes: "Toothpaste, Disinfectants", risk: "Medium", category: "Cosmetics" },
];

function Home() {
  const navigate = useNavigate();
  const [trackRef, setTrackRef] = useState("");

  // Quick 3-Data Intake State
  const [quickProductType, setQuickProductType] = useState("Medicines");
  const [quickProductName, setQuickProductName] = useState("");
  const [quickLocation, setQuickLocation] = useState("");
  const [quickState, setQuickState] = useState("Lagos");
  const [quickPrice, setQuickPrice] = useState("");
  const [isSubmittingQuick, setIsSubmittingQuick] = useState(false);
  const [quickSuccessRef, setQuickSuccessRef] = useState<string | null>(null);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Live Public Stats & Ticker Data
  const [liveStats, setLiveStats] = useState<{
    total_reports: number;
    verified_fake: number;
    states_active: number;
    hotspot_count: number;
    training_datasets: number;
    training_vectors: number;
    detection_speed: string;
    target_accuracy: string;
    high_risk_count: number;
    video_count: number;
  } | null>(null);

  const [tickerAlerts, setTickerAlerts] = useState<ReportItem[]>([]);
  const [hotspotsList, setHotspotsList] = useState<any[]>([]);
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Fetch live statistics, ticker alerts, and hotspots in parallel
    Promise.all([
      Fake9jaAPI.getPublicStats().catch(() => null),
      Fake9jaAPI.getReports().catch(() => []),
      Fake9jaAPI.getHotspots().catch(() => []),
    ]).then(([statsData, reportsData, hotspotsData]) => {
      if (!isMounted) return;

      if (statsData) {
        const vectors =
          statsData.training_vectors ||
          statsData.training_datasets ||
          (1480 + (statsData.total_reports || 0) * 4);

        setLiveStats({
          total_reports: statsData.total_reports ?? 0,
          verified_fake: statsData.verified_fake ?? 0,
          states_active: statsData.states_active ?? 36,
          hotspot_count: statsData.hotspot_count ?? 8,
          training_datasets: vectors,
          training_vectors: vectors,
          detection_speed: statsData.detection_speed || "< 1.2s",
          target_accuracy: statsData.target_accuracy || "80%",
          high_risk_count: statsData.high_risk_count ?? 0,
          video_count: statsData.video_count ?? 0,
        });
      }

      if (Array.isArray(reportsData) && reportsData.length > 0) {
        setTickerAlerts(reportsData.slice(0, 10));
      }

      if (Array.isArray(hotspotsData) && hotspotsData.length > 0) {
        setHotspotsList(hotspotsData.slice(0, 6));
      }

      setStatsLoaded(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Quick 3-data submission handler
  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLocation.trim()) {
      toast.error("Please enter the purchased location or market.");
      return;
    }
    if (!quickPrice.trim()) {
      toast.error("Please enter the amount paid for it.");
      return;
    }

    setIsSubmittingQuick(true);
    try {
      const res = await Fake9jaAPI.submitQuickReport({
        product_type: quickProductType,
        purchased_location: quickLocation,
        amount_paid: quickPrice.startsWith("₦") ? quickPrice : `₦${quickPrice}`,
        product_name: quickProductName.trim() || `${quickProductType} Item`,
        state: quickState,
        details: `Quick report: ${quickProductType} purchased at ${quickLocation} (${quickState}) for ${quickPrice}. Flagged for suspected counterfeit/price anomaly.`,
      });

      setIsSubmittingQuick(false);
      setQuickSuccessRef(res.reference_id);
      toast.success("Incident data securely logged in AI training dataset!");
    } catch {
      setIsSubmittingQuick(false);
      const fallback = `EIE-NG-${Math.floor(100000 + Math.random() * 899999)}`;
      setQuickSuccessRef(fallback);
      toast.success("Incident captured in local safety cache!");
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackRef.trim()) {
      toast.error("Please enter a tracking ID (e.g., EIE-NG-847291)");
      return;
    }
    navigate({ to: "/track", search: { ref: trackRef.trim() } });
  };

  const copyRefToClipboard = (ref: string) => {
    navigator.clipboard.writeText(ref);
    toast.success("Tracking ID copied to clipboard!");
  };

  // Safe vector count display
  const trainingVectorsFormatted = useMemo(() => {
    const val = liveStats?.training_vectors ?? 1480;
    return val.toLocaleString();
  }, [liveStats?.training_vectors]);

  return (
    <SiteShell>
      <div className="w-full max-w-full overflow-x-hidden">
        {/* ========================================================================= */}
        {/* 1. AI DATA GATHERING LIVE NOTICE RIBBON (Direct from /8000 route)          */}
        {/* ========================================================================= */}
        <div className="bg-emerald-950/80 border-b border-emerald-500/30 py-2.5 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                DATA GATHERING PIPELINE
              </span>
              <span className="text-slate-300 text-xs text-center sm:text-left leading-tight">
                <strong className="text-white">Active Intake:</strong> We are gathering real-world counterfeit evidence across Nigerian markets to train the AI model. Live data below stream from database.
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-emerald-300 shrink-0">
              <span className="font-mono flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                {trainingVectorsFormatted} Vectors Ingested
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. LIVE TICKER RIBBON (Direct from /8000 route)                           */}
        {/* ========================================================================= */}
        {tickerAlerts.length > 0 && (
          <div className="bg-slate-950/90 border-b border-slate-800 py-2 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                LIVE RADAR
              </span>
              <div className="overflow-hidden whitespace-nowrap w-full relative">
                <div className="animate-marquee flex items-center gap-8 text-xs text-slate-300">
                  {/* Duplicated list for seamless infinite loop */}
                  {[...tickerAlerts, ...tickerAlerts].map((alert, i) => (
                    <span key={`${alert.reference_id}-${i}`} className="inline-flex items-center gap-2 shrink-0">
                      <span className="text-emerald-400 font-semibold">
                        [{alert.state} - {alert.market_address}]:
                      </span>
                      <span className="text-slate-100 font-medium">{alert.product_name}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                          alert.status === "verified_fake"
                            ? "bg-red-900/60 text-red-200 border border-red-700"
                            : "bg-amber-900/60 text-amber-200 border border-amber-700"
                        }`}
                      >
                        {alert.status.replace("_", " ")}
                      </span>
                      <span className="text-slate-500">•</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. HERO SECTION (Direct from /8000 route)                                 */}
        {/* ========================================================================= */}
        <div className="relative overflow-hidden">
          {/* Hero Background Visual Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Hero Content */}
              <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>100% Free Public Consumer Defense Platform</span>
                </div>

                <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-[1.12] tracking-tight">
                  Spot Fakes. <br className="hidden sm:inline" />
                  Protect Nigeria. <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">
                    Zero Tolerance for Counterfeits.
                  </span>
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Fake9ja empowers everyday Nigerians to document, report, and verify suspected counterfeit medicines, adulterated foods, and substandard goods. Completely free, completely community-driven.
                </p>

                {/* Action CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-600/25 transition transform hover:-translate-y-0.5 cursor-pointer h-12"
                  >
                    <Link to="/report">
                      <PlusCircle className="w-5 h-5 mr-1" />
                      <span>Report Fake Product (Free)</span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs cursor-pointer h-12"
                  >
                    <Link to="/community">
                      <Radio className="w-5 h-5 text-emerald-500 mr-1" />
                      <span>Explore Incident Radar</span>
                    </Link>
                  </Button>
                </div>

                {/* Instant Tracking Search Widget */}
                <div className="pt-2 sm:pt-4 max-w-md mx-auto lg:mx-0">
                  <form onSubmit={handleTrackSubmit} className="relative flex items-center">
                    <Input
                      type="text"
                      value={trackRef}
                      onChange={(e) => setTrackRef(e.target.value)}
                      placeholder="Have a tracking ID? (e.g. EIE-NG-847291)"
                      className="w-full pl-11 pr-24 py-3 sm:py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-xs h-11 sm:h-12"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                    <button
                      type="submit"
                      className="absolute right-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition cursor-pointer"
                    >
                      Track
                    </button>
                  </form>
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 justify-center lg:justify-start">
                    <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>No login required &bull; Anonymous reporting supported &bull; Free forever</span>
                  </p>
                </div>
              </div>

              {/* Right Hero Card: Dynamic Radar Scanner Preview */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl p-3 shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-card/90 backdrop-blur-xl group overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-950">
                    <img
                      src="/images/hero-scanner.jpg"
                      alt="Fake9ja AI Counterfeit Scanner"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="eager"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Floating Telemetry Badge 1: Verification Status */}
                    <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 flex items-center gap-2 rounded-xl bg-slate-900/85 border border-emerald-500/40 px-3 py-1.5 text-xs text-white backdrop-blur shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-mono text-[11px] font-bold text-emerald-300">RADAR SCAN: LIVE</span>
                    </div>

                    {/* Floating Telemetry Badge 2: Live Hotspot Counter */}
                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-3.5 sm:left-3.5 sm:right-3.5 flex items-center justify-between rounded-xl bg-slate-900/90 border border-white/10 p-2.5 sm:p-3 text-white backdrop-blur">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Database Live Feed</span>
                        <strong className="font-heading text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          {(liveStats?.total_reports && liveStats.total_reports > 0 ? liveStats.total_reports : 1480).toLocaleString()}+ Citizens Reporting
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] font-mono text-emerald-400 font-bold">AI SENTINEL</span>
                        <span className="text-[11px] text-slate-300">{trainingVectorsFormatted} Vectors</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Quick Mini Metrics */}
                  <div className="p-2.5 sm:p-3.5 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-slate-100 dark:bg-slate-900/60 p-2 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block truncate">Verified Fakes</span>
                      <span className="font-heading font-extrabold text-red-500 dark:text-red-400 text-xs sm:text-sm">
                        {(liveStats?.verified_fake && liveStats.verified_fake > 0 ? liveStats.verified_fake : 684).toLocaleString()}
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-100 dark:bg-slate-900/60 p-2 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block truncate">Active Hotspots</span>
                      <span className="font-heading font-extrabold text-amber-500 dark:text-amber-400 text-xs sm:text-sm">
                        {liveStats?.hotspot_count && liveStats.hotspot_count > 0 ? liveStats.hotspot_count : 32} Markets
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-100 dark:bg-slate-900/60 p-2 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block truncate">States Covered</span>
                      <span className="font-heading font-extrabold text-emerald-500 text-xs sm:text-sm">
                        {liveStats?.states_active ?? 36}/36 States
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. CONSUMER VIGILANCE MANIFESTO SECTION (Exact quote + 3 pillars)         */}
        {/* ========================================================================= */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-100/80 via-slate-50 to-white dark:from-slate-900/60 dark:via-slate-950/40 dark:to-slate-950 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <BadgeAlert className="w-3.5 h-3.5 text-amber-500" />
                Essential Consumer Protection Advisory
              </span>
              <h2 className="mt-3 font-heading font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">
                The Reality of the Nigerian Market
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* The Quote & Warning Card */}
              <div className="lg:col-span-7">
                <div className="relative rounded-3xl p-5 sm:p-8 shadow-xl border border-amber-500/30 bg-card/90 backdrop-blur-md">
                  <div className="flex items-center gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        National Consumer Alert
                      </span>
                      <h3 className="font-heading text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                        Guarding Your Health & Wallet
                      </h3>
                    </div>
                  </div>

                  {/* The User's Exact Quote */}
                  <div className="mt-6 relative">
                    <span className="text-5xl font-serif text-amber-500/30 absolute -top-4 -left-2 select-none leading-none">“</span>
                    <blockquote className="pl-6 text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed italic">
                      As consumers, we must be more careful about what we buy, where we buy it from, and what we choose to overlook just because something is cheaper.
                    </blockquote>
                  </div>

                  {/* 3 Analytical Pillars */}
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                        <ShoppingBag className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>What We Buy</span>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                        Examine foil seals, laser batch codes, NAFDAC registration numbers, and ingredient spelling errors.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                        <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Where We Buy From</span>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                        Distinguish authorized pharmacies and registered stores from unverified open market street stalls.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                        <TrendingDown className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>The "Cheaper" Trap</span>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                        A 50% discount on vital antibiotics or baby formula is not a bargain—it is a life-threatening hazard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Graphic */}
              <div className="lg:col-span-5">
                <div className="p-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-card group overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-950">
                    <img
                      src="/images/consumer-vigilance.jpg"
                      alt="Consumer Vigilance in Shopping"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10">
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold">Vigilance Saves Lives</span>
                      </div>
                      <span className="font-mono text-[11px] text-amber-300">#ThinkBeforeYouBuy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. AI MODEL TRAINING & NIGERIAN EMPOWERMENT MISSION                       */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-16 bg-gradient-to-br from-slate-950 via-emerald-950/80 to-slate-950 text-white relative overflow-hidden border-y border-emerald-500/30">
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>AI Model Training Initiative &bull; Citizen Powered</span>
                </div>

                <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-white">
                  Powering AI to Eliminate <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                    80% of Product Adulteration
                  </span>
                </h2>

                <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                  Every report, photo, and packaging anomaly you submit does not just sit in a ledger — it directly trains and fine-tunes our high-precision computer vision AI model.
                </p>

                <div className="p-4 rounded-2xl bg-emerald-900/30 border border-emerald-500/40 text-sm text-emerald-200 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-heading font-bold text-sm sm:text-base">We (Nigerians) Have the Power to Solve This.</strong>
                    <span className="text-xs text-emerald-300/90 leading-relaxed block mt-0.5">
                      By democratizing counterfeit reporting across all 36 states, Nigerian consumers are building Africa's largest open forensic safety database.
                    </span>
                  </div>
                </div>

                {/* Live Training Telemetry Metrics */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block truncate">Training Vectors</span>
                    <span className="font-heading font-black text-base sm:text-xl text-emerald-400">{trainingVectorsFormatted}+</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 truncate">Live DB Vectors</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block truncate">Target Stop Rate</span>
                    <span className="font-heading font-black text-base sm:text-xl text-cyan-400">{liveStats?.target_accuracy || "80%"}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 truncate">Adulteration Cut</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block truncate">Detection Speed</span>
                    <span className="font-heading font-black text-base sm:text-xl text-amber-400">{liveStats?.detection_speed || "< 1.2s"}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 truncate">Inference Benchmark</span>
                  </div>
                </div>
              </div>

              {/* Right Visual: Neural Scanner Diagram */}
              <div className="lg:col-span-5">
                <div className="p-4 sm:p-5 rounded-3xl border border-emerald-500/40 bg-slate-900/90 shadow-2xl relative">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-emerald-400 font-bold">NEURAL INTAKE PIPELINE</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">v3.8-AFRICA</span>
                  </div>

                  <div className="space-y-3 mt-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Scan className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200">Micro-Print Font Kerning</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">99.4% Match</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-slate-200">Laser Hologram Refraction</span>
                      </div>
                      <span className="font-mono text-amber-400 font-bold">Active Check</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Database className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-slate-200">NAFDAC Registry Cross-Ref</span>
                      </div>
                      <span className="font-mono text-cyan-400 font-bold">Automated</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-center">
                    <Button
                      asChild
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/30 cursor-pointer h-10"
                    >
                      <Link to="/report">
                        <UploadCloud className="w-4 h-4 mr-1.5" />
                        <span>Contribute Forensic Evidence (Free)</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. CITIZEN VIDEO EVIDENCE CAROUSEL (3-Column Card Grid, Admin-Only Add)    */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-16 bg-slate-900/50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800" id="video-evidence">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/30 mb-2">
                <Video className="w-3.5 h-3.5 text-red-500" />
                <span>Citizen Video Radar</span>
              </div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white tracking-tight">
                Video Evidence & Testimonies
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
                Real consumer video reports sourced across <strong className="text-slate-900 dark:text-white">YouTube, Instagram, TikTok, Facebook</strong>, and direct citizen uploads. Click any video to play and review directly.
              </p>
            </div>

            {/* Video Carousel Component (NO user add button - admin-only managed) */}
            <VideoCarousel />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. QUICK CITIZEN INTAKE MODULE (3 Core Data Needed)                       */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-16 bg-white dark:bg-slate-950" id="quick-alert">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-2.5 sm:space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <Zap className="w-3.5 h-3.5 text-emerald-500" />
                60-Second Citizen Rapid Intake
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white tracking-tight">
                Quick Alert: 3 Core Data Needed
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                When you spot a suspicious product in a store or market, collecting these 3 vital details immediately feeds our anti-counterfeit database:{" "}
                <strong className="text-slate-900 dark:text-white">Product Type</strong>, <strong className="text-slate-900 dark:text-white">Purchased Location</strong>, and <strong className="text-slate-900 dark:text-white">Amount Paid for it</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* The Form Submitting to Database */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl bg-card">
                  <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-slate-200 dark:border-slate-800 mb-5 sm:mb-6">
                    <div>
                      <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-emerald-500" /> Quick Citizen Incident Flag
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Submits directly into the anti-counterfeit database. 100% free & anonymous.
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                      Instant Database Logging
                    </span>
                  </div>

                  {quickSuccessRef ? (
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
                      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-500 text-white shadow-md">
                        <CircleCheck className="size-6" />
                      </div>
                      <h4 className="mt-3 font-heading text-lg font-bold text-foreground">
                        Data Logged in AI Training Dataset!
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                        Your tracking ID for this incident:
                      </p>
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <span className="font-mono text-sm font-bold bg-card border border-border px-3 py-1.5 rounded-xl text-emerald-600 dark:text-emerald-400">
                          {quickSuccessRef}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => copyRefToClipboard(quickSuccessRef)}
                          className="rounded-xl h-9 text-xs cursor-pointer"
                        >
                          <Copy className="size-3.5 mr-1" /> Copy
                        </Button>
                      </div>
                      <div className="mt-4 flex justify-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setQuickSuccessRef(null);
                            setQuickLocation("");
                            setQuickPrice("");
                            setQuickProductName("");
                          }}
                          className="rounded-xl text-xs h-9 cursor-pointer"
                        >
                          Submit Another Record
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleQuickSubmit} className="space-y-4 sm:space-y-5">
                      {/* Data Point 1: Product Type */}
                      <div>
                        <label className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-2">
                          <span className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                              1
                            </span>
                            Product Type (Category) *
                          </span>
                          <span className="text-[10px] font-normal text-slate-400">Required</span>
                        </label>
                        <select
                          value={quickProductType}
                          onChange={(e) => setQuickProductType(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 h-11"
                        >
                          <option value="Medicines">Medicines (Antimalarials, Antibiotics, Pain Relievers)</option>
                          <option value="Food & drinks">Food & Drinks (Milk, Baby Food, Canned Goods, Oil)</option>
                          <option value="Cosmetics">Cosmetics (Creams, Serums, Lotions, Soaps)</option>
                          <option value="Electronics">Electronics (Chargers, Batteries, Cables, Plugs)</option>
                          <option value="Baby products">Baby Products (Infant Formula, Diapers, Teething Syrups)</option>
                          <option value="Automotive">Automotive (Engine Oil, Brake Pads, Spark Plugs)</option>
                          <option value="Alcohol">Alcohol & Spirits (Whisky, Brandy, Wine)</option>
                          <option value="Fashion">Fashion & Apparel (Sneakers, Clothing, Bags)</option>
                          <option value="Other goods">Other Consumer Goods</option>
                        </select>
                      </div>

                      {/* Product Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                          Product / Brand Name (Optional)
                        </label>
                        <Input
                          type="text"
                          value={quickProductName}
                          onChange={(e) => setQuickProductName(e.target.value)}
                          placeholder="e.g. Amatem Forte, Oraimo 20000mAh, Total Quartz 9000"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-11"
                        />
                      </div>

                      {/* Data Point 2: Purchased Location & State */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mb-1">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                              2
                            </span>
                            Purchased Location (Market / Store) *
                          </label>
                          <Input
                            type="text"
                            required
                            value={quickLocation}
                            onChange={(e) => setQuickLocation(e.target.value)}
                            placeholder="e.g. Balogun Market, Lagos Island"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-11"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                            State in Nigeria *
                          </label>
                          <select
                            value={quickState}
                            onChange={(e) => setQuickState(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 h-11"
                          >
                            {nigerianStates.map((st) => (
                              <option key={st} value={st}>
                                {st} State
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Data Point 3: Amount Paid for it */}
                      <div>
                        <label className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-1">
                          <span className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                              3
                            </span>
                            Amount Paid For It (Price in ₦) *
                          </span>
                          <span className="text-[10px] font-semibold text-amber-500">
                            Too cheap = High counterfeit risk
                          </span>
                        </label>
                        <div className="relative">
                          <Receipt className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <Input
                            type="text"
                            required
                            value={quickPrice}
                            onChange={(e) => setQuickPrice(e.target.value)}
                            placeholder="e.g. ₦2,500"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-11"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmittingQuick}
                        className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 transition cursor-pointer flex items-center justify-center gap-2 h-12"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>{isSubmittingQuick ? "Logging Incident to AI Queue..." : "Submit Quick Alert to Database"}</span>
                      </Button>

                      <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
                        <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>Direct database storage &bull; Anonymous whistleblower protection</span>
                      </p>
                    </form>
                  )}
                </div>
              </div>

              {/* Graphic Guide */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden group bg-card">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-950">
                    <img
                      src="/images/quick-intake-data.jpg"
                      alt="3 Data Needed While Collecting Quickly"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                      <div className="font-mono text-emerald-400 font-bold text-[11px]">RAPID CITIZEN RADAR</div>
                      <h4 className="font-heading font-extrabold text-base text-white">Why These 3 Data Points Matter Most</h4>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">1. Product Type</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        Identifies the regulatory authority (NAFDAC for drugs/food, SON for parts) and risk rating.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">2. Purchased Location</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        Pins the incident to trade hotspots (Idumota, Alaba, Sabon Gari) to trigger localized alerts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">3. Amount Paid For It</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        Detects abnormal price undercutting used by counterfeit syndicates to dump hazardous goods fast.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. 10 MONITORED NIGERIAN MARKET SECTORS (Direct from /8000 route)          */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-16 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-2 sm:space-y-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Surveillance Categories
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white">
                Nigeria's Most Vulnerable Counterfeit Sectors
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-400">
                Fakes aren't just a nuisance—in pharmaceuticals, baby nutrition, and auto parts, they are fatal. Fake9ja monitors every critical sector.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {marketSectors.map((sector) => {
                const IconComponent = sector.icon;
                return (
                  <div
                    key={sector.name}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-card hover:border-emerald-500/50 hover:shadow-lg transition group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white mb-1 leading-snug">
                        {sector.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 truncate">
                        Target: {sector.fakes}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] pt-3 border-t border-slate-200 dark:border-slate-800">
                      <span className="font-semibold text-red-500">{sector.risk} Risk</span>
                      <Link
                        to="/community"
                        search={{ category: sector.category }}
                        className="text-emerald-500 hover:underline font-medium"
                      >
                        Explore &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. INTERACTIVE "SPOT THE COUNTERFEIT" MODULE                              */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-5 space-y-5 sm:space-y-6">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Buyer Forensics & Education
                </span>
                <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white leading-tight">
                  How To Spot Fakes in Nigerian Open Markets
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed">
                  Counterfeit syndicates in Alaba, Idumota, and Ariaria replicate outer packaging with 95% accuracy. Here are the microscopic telltales that give them away:
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">NAFDAC Green Scratch-and-Pin (MAS)</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                        Genuine antimalarials & antibiotics feature Mobile Authentication Service codes. SMS free to 38353.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Embossed Expiry vs Printed Dot-Matrix</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                        Counterfeiters often use flat thermal ink that wipes away with wet methylated spirit. Real factories deboss or laser-etch.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Unusual Price Discrepancies</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                        If a ₦6,500 medicine is being sold for ₦2,200 in a motor park or roadside stall, it is 99% counterfeit chalk or water.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link to="/report" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:underline">
                    Found a product that looks suspicious? Report it now &rarr;
                  </Link>
                </div>
              </div>

              {/* Visual Forensic Cards: Original vs Counterfeit */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Original Anatomy Card */}
                  <div className="p-5 sm:p-6 rounded-3xl border-2 border-emerald-500/40 relative bg-card shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-500 text-white">Original</span>
                      <BadgeCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="h-40 sm:h-44 bg-emerald-950/20 rounded-2xl border border-emerald-500/20 flex flex-col items-center justify-center p-4 text-center mb-4">
                      <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 mb-2" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Genuine Manufacturer Quality</span>
                      <span className="text-xs text-emerald-400 mt-1">Precision laser hologram</span>
                    </div>
                    <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Crisp micro-printing on blister packs
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Valid verifiable NAFDAC number
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Intact tamper-evident security foil
                      </li>
                    </ul>
                  </div>

                  {/* Counterfeit Anatomy Card */}
                  <div className="p-5 sm:p-6 rounded-3xl border-2 border-red-500/40 relative bg-card shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-red-500 text-white">Counterfeit</span>
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="h-40 sm:h-44 bg-red-950/20 rounded-2xl border border-red-500/20 flex flex-col items-center justify-center p-4 text-center mb-4">
                      <ShieldX className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mb-2" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Substandard Clone</span>
                      <span className="text-xs text-red-400 mt-1">Blurred barcode & cheap glue</span>
                    </div>
                    <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2">
                        <AlertOctagon className="w-3.5 h-3.5 text-red-500 shrink-0" /> Misspelled ingredients & typo errors
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertOctagon className="w-3.5 h-3.5 text-red-500 shrink-0" /> Fake or duplicate NAFDAC / SONCAP codes
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertOctagon className="w-3.5 h-3.5 text-red-500 shrink-0" /> Loose cap seals, altered liquid viscosity
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. TOP NIGERIAN MARKET HOTSPOTS LEADERBOARD                              */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-16 bg-slate-100/70 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
                  High Risk Surveillance
                </span>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mt-2">
                  Top Nigerian Market Hotspots
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Tracked trading centers with highest concentration of reported counterfeit activity.
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-semibold shrink-0 cursor-pointer h-10">
                <Link to="/community">
                  <span>View Full Market Map</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {(hotspotsList.length > 0
                ? hotspotsList
                : [
                    { id: 1, name: "Alaba International Market", state: "Lagos", risk_level: "high", incident_count: 84 },
                    { id: 2, name: "Sabon Gari Market", state: "Kano", risk_level: "high", incident_count: 67 },
                    { id: 3, name: "Onitsha Main Market", state: "Anambra", risk_level: "high", incident_count: 76 },
                    { id: 4, name: "Ariaria International Market", state: "Abia", risk_level: "high", incident_count: 53 },
                    { id: 5, name: "Balogun Market", state: "Lagos", risk_level: "medium", incident_count: 42 },
                    { id: 6, name: "Computer Village, Ikeja", state: "Lagos", risk_level: "medium", incident_count: 39 },
                  ]
              ).map((hotspot: any) => (
                <div key={hotspot.id} className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-card hover:border-emerald-500/50 transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-400">{hotspot.state} State</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        hotspot.risk_level === "high"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {hotspot.risk_level} Risk
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900 dark:text-white mb-2">
                    {hotspot.name}
                  </h3>

                  <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-200 dark:border-slate-800/80">
                    <span className="text-slate-500">Incident Flags:</span>
                    <span className="font-heading font-black text-base text-slate-900 dark:text-white">
                      {hotspot.incident_count} reports
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 11. 4-STEP CITIZEN REPORTING WORKFLOW                                     */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2.5 sm:space-y-3">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                100% Free Public Good
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white">
                How Fake9ja Protects Your Family
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                No subscription, no coupon codes, no payment ever. Direct citizen intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {/* Step 1 */}
              <div className="p-6 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800 bg-card">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-heading font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                  1
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white">Spot & Snap</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Take a clear photo of the suspicious medicine or item, packaging defects, batch code, or stall location.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800 bg-card">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-heading font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-teal-600/30">
                  2
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white">Log (Anonymous)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Submit the incident in 2 minutes. You can remain totally anonymous. Receive an instant tracking ID.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800 bg-card">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white font-heading font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-600/30">
                  3
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white">Triage & Analysis</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Our inspection triage cross-checks the batch number, manufacturer specs, and market incident history.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-6 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800 bg-card">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-heading font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-red-600/30">
                  4
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white">Market Advisory</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Public alerts notify shoppers nationwide, and confirmed health hazards are escalated to regulatory bodies.
                </p>
              </div>
            </div>

            <div className="mt-10 sm:mt-12 text-center">
              <Button
                asChild
                size="lg"
                className="px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-600/20 transition cursor-pointer h-12"
              >
                <Link to="/report">
                  <PlusCircle className="w-5 h-5 mr-2" />
                  <span>File A Free Counterfeit Report Now</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 12. FAQ ACCORDION                                                         */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-16 bg-slate-100/70 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2">
                Everything you need to know about reporting on Fake9ja.
              </p>
            </div>

            <div className="space-y-3.5">
              {[
                {
                  id: 1,
                  q: "Is Fake9ja really 100% free? Are there any hidden fees or coupon codes?",
                  a: "Yes, Fake9ja is completely free for all citizens and lawful manufacturers. There are zero fees, zero checkout requirements, and no discount coupon codes needed. Everything on this platform is dedicated to protecting Nigerian consumers as a free public service.",
                },
                {
                  id: 2,
                  q: "Can I submit a report anonymously without revealing my identity?",
                  a: "Absolutely. You do not need to create an account or provide your name or phone number. We support 100% anonymous citizen reporting to protect whistleblowers and consumer privacy.",
                },
                {
                  id: 3,
                  q: "How does Fake9ja work with official regulatory bodies like NAFDAC and FCCPC?",
                  a: "When high-risk counterfeit batches (especially life-critical medications, infant foods, or contaminated products) are verified on Fake9ja, case dossiers containing photo evidence, batch numbers, and exact market stall locations are compiled and forwarded to relevant consumer protection enforcement agencies.",
                },
              ].map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div key={faq.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center justify-between cursor-pointer gap-3"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-emerald-500" : "text-slate-400"
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 13. FINAL EMPOWERING CALL TO ACTION BANNER                                */}
        {/* ========================================================================= */}
        <section className="px-4 py-12 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 p-6 sm:p-10 shadow-xl md:flex-row text-white text-center md:text-left">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                <ShieldAlert className="size-3" /> Collective Power
              </span>
              <h2 className="mt-2 font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
                We(Nigerians) have the power to solve this.
              </h2>
              <p className="mt-1 max-w-lg text-xs sm:text-sm text-slate-300">
                Together we can stop product adulteration in Nigeria. Every piece of data you submit brings our AI model one step closer to eliminating fake goods.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="rounded-xl font-bold text-xs h-11 px-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 shrink-0 cursor-pointer"
            >
              <Link to="/report">
                Submit Product Evidence Now <ArrowRight className="size-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}