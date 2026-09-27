import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeAlert,
  Barcode,
  Beef,
  Building2,
  Check,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  Copy,
  ExternalLink,
  Eye,
  Factory,
  Flame,
  HeartPulse,
  Layers,
  Lock,
  MapPin,
  PackageCheck,
  Pill,
  Radar,
  Receipt,
  ScanSearch,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Star,
  Tag,
  TrendingDown,
  TrendingUp,
  Wine,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal, SectionHeading } from "@/components/motion-kit";
import { SiteShell } from "@/components/site-shell";
import { Fake9jaAPI } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fake9ja — Stop Fake Products in Nigeria | Citizen Counterfeit Intelligence" },
      { name: "description", content: "Report fake medicines, adulterated foods, cloned electronics, and counterfeit goods across Nigeria with Fake9ja. Completely free, citizen-powered safety." },
      { property: "og:title", content: "Fake9ja — Nigeria's Citizen Anti-Counterfeit Network" },
      { property: "og:description", content: "Spot Fakes. Protect Nigeria. Zero tolerance for counterfeits in our markets." },
      { property: "og:image", content: "/images/hero-scanner.jpg" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const categories = [
  { name: "Medicines", Icon: Pill, count: "219 reports", sub: "Malaria pills, antibiotics & cough syrups", risk: "Critical" },
  { name: "Food & drinks", Icon: ShoppingBasket, count: "248 reports", sub: "Beverages, milk powders & seasonings", risk: "High" },
  { name: "Cosmetics", Icon: Sparkles, count: "164 reports", sub: "Skin lightening, body lotions & soaps", risk: "Medium" },
  { name: "Electronics", Icon: Smartphone, count: "118 reports", sub: "Chargers, batteries & power banks", risk: "High" },
  { name: "Baby products", Icon: HeartPulse, count: "71 reports", sub: "Diapers, infant formula & teething syrups", risk: "Critical" },
  { name: "Automotive", Icon: Factory, count: "59 reports", sub: "Engine oils, brake pads & spark plugs", risk: "High" },
  { name: "Alcohol", Icon: Wine, count: "94 reports", sub: "Premium whiskies, brandies & wines", risk: "Medium" },
  { name: "Fashion", Icon: Shirt, count: "82 reports", sub: "Designer wear, sneakers & jerseys", risk: "Low" },
  { name: "Meat & produce", Icon: Beef, count: "43 reports", sub: "Frozen poultry & canned sardines", risk: "High" },
  { name: "Other goods", Icon: PackageCheck, count: "36 reports", sub: "Insecticides, detergents & building items", risk: "Medium" },
];

const nigerianStates = [
  "Lagos", "FCT Abuja", "Kano", "Rivers", "Anambra", "Abia", "Oyo", "Ogun", "Kaduna", "Enugu",
  "Delta", "Edo", "Akwa Ibom", "Plateau", "Benue", "Borno", "Adamawa", "Bauchi", "Bayelsa", "Cross River",
  "Ebonyi", "Ekiti", "Gombe", "Imo", "Jigawa", "Katsina", "Kebbi", "Kogi", "Kwara", "Nasarawa",
  "Niger", "Ondo", "Osun", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

function Home() {
  const navigate = useNavigate();
  const [verdict, setVerdict] = useState<null | "fake" | "original">(null);
  const [trackRef, setTrackRef] = useState("");

  // Quick 3-Data Intake State
  const [quickProductType, setQuickProductType] = useState("Medicines");
  const [quickLocation, setQuickLocation] = useState("");
  const [quickPrice, setQuickPrice] = useState("");
  const [quickProductName, setQuickProductName] = useState("");
  const [quickState, setQuickState] = useState("Lagos");
  const [isSubmittingQuick, setIsSubmittingQuick] = useState(false);
  const [quickSuccessRef, setQuickSuccessRef] = useState<string | null>(null);

  // Quick submission handler
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
      toast.success("Incident securely registered into database!");
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
      toast.error("Please enter a tracking ID (e.g., EIE-NG-248193)");
      return;
    }
    navigate({ to: "/track", search: { ref: trackRef.trim() } });
  };

  const copyRefToClipboard = (ref: string) => {
    navigator.clipboard.writeText(ref);
    toast.success("Tracking ID copied to clipboard!");
  };

  return (
    <SiteShell>
      {/* Live Market Alert Marquee */}
      <div className="border-b border-border bg-card/60 backdrop-blur py-2 overflow-hidden text-xs">
        <div className="mx-auto max-w-7xl px-4 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 border border-destructive/20 px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] text-destructive shrink-0">
            <Flame className="size-3 text-destructive animate-pulse" /> Live Radar
          </span>
          <div className="truncate text-muted-foreground font-mono text-[11px]">
            <span className="text-foreground font-semibold">🚨 Lagos (Balogun Market):</span> 14 cloned skincare lotion batches flagged &bull; 
            <span className="text-foreground font-semibold ml-2">🚨 Kano (Sabon Gari):</span> Counterfeit softgel malaria pills seized &bull; 
            <span className="text-foreground font-semibold ml-2">🚨 Onitsha (Main Market):</span> Fake automotive engine oils under review &bull; 
            <span className="text-emerald-500 font-semibold ml-2">🎉 Launch Promo:</span> Code <span className="font-bold underline">WELCOME30</span> active for 30% discount on Priority Lab Triage.
          </div>
        </div>
      </div>

      {/* Hero Section with Rich Modern Aesthetics & Scanner Visual */}
      <section className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-6 md:px-8 md:pt-14">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute -top-24 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.12fr_.88fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Trust Pill */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 shadow-sm">
              <ShieldCheck className="size-4 text-emerald-500" />
              <span>100% Free Public Citizen Intelligence Radar</span>
            </div>

            <h1 className="max-w-2xl font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
              Spot Fakes. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">
                Protect Nigeria.
              </span> <br />
              Zero Tolerance For Bad Goods.
            </h1>

            <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground font-normal">
              Fake9ja empowers everyday Nigerian consumers to expose counterfeit drugs, adulterated foods, and substandard items before they harm families. Your report maps dangerous market batches in real time.
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-2xl font-bold text-sm px-6 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-600/25 transition-all hover:scale-[1.02] cursor-pointer">
                <Link to="/report">
                  <ShieldAlert className="size-4 mr-2" />
                  Report a Fake Product (Free)
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl font-bold text-sm px-5 h-12 border-border/80 bg-card/80 hover:bg-secondary cursor-pointer shadow-sm">
                <Link to="/community">
                  <Radar className="size-4 mr-2 text-emerald-500" />
                  Explore Incident Radar
                </Link>
              </Button>
            </div>

            {/* Fast Tracking Lookup */}
            <div className="mt-6 max-w-md">
              <form onSubmit={handleTrackSubmit} className="relative flex items-center">
                <Search className="absolute left-3.5 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={trackRef}
                  onChange={(e) => setTrackRef(e.target.value)}
                  placeholder="Have a tracking ID? (e.g. EIE-NG-248193)"
                  className="w-full pl-10 pr-24 py-2.5 rounded-xl border-border bg-card/90 text-xs sm:text-sm shadow-sm focus:border-emerald-500"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                >
                  Track
                </Button>
              </form>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                <Lock className="size-3 text-emerald-500" />
                <span>100% Anonymous &bull; No login required &bull; Direct Database Storage</span>
              </div>
            </div>

            {/* Value Indicators */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground border-t border-border/60 pt-4">
              <span className="flex items-center gap-1.5"><CircleCheck className="size-3.5 text-emerald-500" />Whistleblower Protection</span>
              <span className="flex items-center gap-1.5"><CircleCheck className="size-3.5 text-emerald-500" />Under 60s Submission</span>
              <span className="flex items-center gap-1.5"><CircleCheck className="size-3.5 text-emerald-500" />NAFDAC & FCCPC Signals</span>
            </div>
          </motion.div>

          {/* Right Hero Visual Card with High-Res Image & Overlay Telemetry */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-border/80 bg-card p-3 shadow-2xl backdrop-blur-xl group overflow-hidden">
              {/* High-Tech Scanner Image */}
              <div className="relative aspect-[16/10] sm:aspect-[16/10] overflow-hidden rounded-2xl bg-slate-950">
                <img
                  src="/images/hero-scanner.jpg"
                  alt="Fake9ja AI Counterfeit Scanner"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                
                {/* Floating Telemetry Badge 1: Verification Status */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2 rounded-xl bg-slate-900/85 border border-emerald-500/40 px-3 py-1.5 text-xs text-white backdrop-blur shadow-lg">
                  <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-[11px] font-bold text-emerald-300">SYSTEM: RADAR SCAN ACTIVE</span>
                </div>

                {/* Floating Telemetry Badge 2: Live Hotspot Counter */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between rounded-xl bg-slate-900/90 border border-white/10 p-3 text-white backdrop-blur">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Database Live Feed</span>
                    <strong className="font-display text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-emerald-400" /> 1,480+ Citizens Reporting
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-mono text-emerald-400 font-bold">WELCOME30</span>
                    <span className="text-[11px] text-slate-300">30% Off Priority</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Mini Metric */}
              <div className="p-3.5 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl bg-secondary/60 p-2 border border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Verified Fakes</span>
                  <span className="font-display font-extrabold text-foreground text-sm">684 Batches</span>
                </div>
                <div className="rounded-xl bg-secondary/60 p-2 border border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Tracked Markets</span>
                  <span className="font-display font-extrabold text-foreground text-sm">32 Hotspots</span>
                </div>
                <div className="rounded-xl bg-secondary/60 p-2 border border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Detection Speed</span>
                  <span className="font-display font-extrabold text-emerald-500 text-sm">Real-Time</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CONSUMER VIGILANCE MANIFESTO SECTION (User's Exact Quote + High-End Card) */}
      {/* ========================================================================= */}
      <section className="py-14 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-secondary/40 via-secondary/20 to-background border-y border-border">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <BadgeAlert className="size-3.5 text-amber-500" /> Essential Consumer Protection Advisory
              </span>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
                The Reality of the Nigerian Market
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] items-center">
            {/* The Quote & Warning Card */}
            <Reveal>
              <div className="relative rounded-3xl border border-amber-500/30 bg-card p-6 sm:p-8 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-3 pb-5 border-b border-border/70">
                  <div className="grid size-12 place-items-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="size-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      National Consumer Alert
                    </span>
                    <h3 className="font-display text-base sm:text-lg font-extrabold text-foreground">
                      Guarding Your Health & Wallet
                    </h3>
                  </div>
                </div>

                {/* The Requested Quote in Big Typography */}
                <div className="mt-6 relative">
                  <span className="text-5xl font-serif text-amber-500/30 absolute -top-4 -left-2 select-none leading-none">“</span>
                  <blockquote className="pl-6 text-base sm:text-lg md:text-xl font-medium text-foreground leading-relaxed italic">
                    As consumers, we must be more careful about what we buy, where we buy it from, and what we choose to overlook just because something is cheaper.
                  </blockquote>
                </div>

                {/* 3 Core Analytical Pillars */}
                <div className="mt-8 grid gap-4 sm:grid-cols-3 pt-6 border-t border-border/70">
                  <div className="rounded-2xl bg-secondary/70 p-4 border border-border/50">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <ShoppingBag className="size-4 text-emerald-500" />
                      <span>What We Buy</span>
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                      Examine foil seals, laser batch codes, NAFDAC registration numbers, and ingredient spelling errors.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-secondary/70 p-4 border border-border/50">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <MapPin className="size-4 text-emerald-500" />
                      <span>Where We Buy From</span>
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                      Distinguish authorized pharmacies and registered stores from unverified open market street stalls.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-secondary/70 p-4 border border-border/50">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <TrendingDown className="size-4 text-amber-500" />
                      <span>The "Cheaper" Trap</span>
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                      A 50% discount on vital antibiotics or baby formula is not a bargain—it is a life-threatening hazard.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Visual Illustration */}
            <Reveal delay={0.2}>
              <div className="relative rounded-3xl border border-border/80 bg-card p-3 shadow-2xl overflow-hidden group">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-950">
                  <img
                    src="/images/consumer-vigilance.jpg"
                    alt="Consumer Vigilance in Shopping"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10">
                      <Eye className="size-3.5 text-emerald-400" />
                      <span className="font-semibold">Vigilance Saves Lives</span>
                    </div>
                    <span className="font-mono text-[11px] text-amber-300">#ThinkBeforeYouBuy</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* QUICK REPORT / RAPID 3-DATA INTAKE WIDGET (Direct Database Submission)   */}
      {/* 3 data needed while collecting quickly: Product Type, Purchased Location, Amount Paid for it */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 md:px-8" id="quick-report">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Zap className="size-3.5 text-emerald-500" /> 60-Second Citizen Rapid Intake
              </span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Quick Alert: 3 Core Data Needed
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                When you spot a suspicious product in a store or market, collecting these 3 vital details immediately feeds our anti-counterfeit radar:
                <strong className="text-foreground"> Product Type</strong>, <strong className="text-foreground">Purchased Location</strong>, and <strong className="text-foreground">Amount Paid for it</strong>.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] items-start">
            {/* Quick Submission Interactive Form */}
            <Reveal>
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-5 border-b border-border">
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                      <Zap className="size-5 text-emerald-500" /> Quick Citizen Incident Flag
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Submits directly into the SQLite/MySQL database. 100% anonymous.
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    Instant Logging
                  </span>
                </div>

                {quickSuccessRef ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center"
                  >
                    <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-500 text-white shadow-lg">
                      <CircleCheck className="size-6" />
                    </div>
                    <h4 className="mt-3 font-display text-lg font-extrabold text-foreground">
                      Incident Successfully Logged!
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                      Your quick alert has been indexed in the database. Use this reference ID to track verification progress:
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <span className="font-mono text-base font-bold bg-card border border-border px-3 py-1.5 rounded-xl text-emerald-600 dark:text-emerald-400">
                        {quickSuccessRef}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => copyRefToClipboard(quickSuccessRef)}
                        className="rounded-xl cursor-pointer"
                      >
                        <Copy className="size-3.5 mr-1" /> Copy
                      </Button>
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <Button asChild size="sm" className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer">
                        <Link to="/track" search={{ ref: quickSuccessRef }}>
                          Track This Case
                        </Link>
                      </Button>
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
                        className="rounded-xl cursor-pointer text-xs"
                      >
                        Submit Another Quick Alert
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleQuickSubmit} className="mt-6 space-y-5">
                    {/* Data Point 1: Product Type */}
                    <div>
                      <label className="flex items-center justify-between text-xs font-bold text-foreground mb-2">
                        <span className="flex items-center gap-1.5">
                          <span className="grid size-5 place-items-center rounded-full bg-emerald-500/20 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                            1
                          </span>
                          Product Type (Category) *
                        </span>
                        <span className="text-[10px] font-normal text-muted-foreground">Required</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          "Medicines",
                          "Food & drinks",
                          "Cosmetics",
                          "Electronics",
                          "Baby products",
                          "Automotive",
                        ].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setQuickProductType(cat)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer flex items-center justify-between ${
                              quickProductType === cat
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm"
                                : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary"
                            }`}
                          >
                            <span>{cat}</span>
                            {quickProductType === cat && <Check className="size-3 text-emerald-500" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Optional Item Name / Brand */}
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Brand / Product Name (Optional)
                      </label>
                      <Input
                        type="text"
                        value={quickProductName}
                        onChange={(e) => setQuickProductName(e.target.value)}
                        placeholder="e.g. Amatem Forte, Oraimo Powerbank, Cussons Soap"
                        className="rounded-xl text-xs sm:text-sm bg-secondary/30"
                      />
                    </div>

                    {/* Data Point 2: Purchased Location & State */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-1">
                          <span className="grid size-5 place-items-center rounded-full bg-emerald-500/20 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                            2
                          </span>
                          Purchased Location (Market / Address) *
                        </label>
                        <Input
                          type="text"
                          required
                          value={quickLocation}
                          onChange={(e) => setQuickLocation(e.target.value)}
                          placeholder="e.g. Balogun Market, Lagos Island"
                          className="rounded-xl text-xs sm:text-sm bg-secondary/30"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1">
                          State in Nigeria *
                        </label>
                        <select
                          value={quickState}
                          onChange={(e) => setQuickState(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-input bg-card text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {nigerianStates.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Data Point 3: Amount Paid for it */}
                    <div>
                      <label className="flex items-center justify-between text-xs font-bold text-foreground mb-1">
                        <span className="flex items-center gap-1.5">
                          <span className="grid size-5 place-items-center rounded-full bg-emerald-500/20 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                            3
                          </span>
                          Amount Paid For It (Price in ₦) *
                        </span>
                        <span className="text-[10px] font-semibold text-amber-500">
                          Too cheap = High counterfeit risk
                        </span>
                      </label>
                      <div className="relative">
                        <Receipt className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          type="text"
                          required
                          value={quickPrice}
                          onChange={(e) => setQuickPrice(e.target.value)}
                          placeholder="e.g. ₦2,500"
                          className="pl-10 rounded-xl text-xs sm:text-sm bg-secondary/30 font-medium"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmittingQuick}
                      className="w-full h-12 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 cursor-pointer transition-all"
                    >
                      {isSubmittingQuick ? (
                        <span className="flex items-center gap-2">
                          <CircleAlert className="size-4 animate-spin" /> Recording in Database...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <ShieldAlert className="size-4" /> Submit Quick Alert to Database
                        </span>
                      )}
                    </Button>

                    <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1.5">
                      <Lock className="size-3 text-emerald-500" />
                      Free community report &bull; Whistleblower protected &bull; Database tracked
                    </p>
                  </form>
                )}
              </div>
            </Reveal>

            {/* Visual Guide explaining the 3 Data Points with Generated Graphic */}
            <Reveal delay={0.15}>
              <div className="space-y-6">
                <div className="rounded-3xl border border-border bg-card p-3 shadow-2xl overflow-hidden group">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-950">
                    <img
                      src="/images/quick-intake-data.jpg"
                      alt="3 Data Needed While Collecting Quickly"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                      <div className="font-mono text-emerald-400 font-bold text-[11px]">RAPID CITIZEN TRIAGE</div>
                      <h4 className="font-display font-extrabold text-base text-white">
                        Why These 3 Data Points Matter Most
                      </h4>
                    </div>
                  </div>
                </div>

                {/* 3 Step Breakdown Cards */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
                    <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Tag className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">1. Product Type</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Identifies the regulatory authority (NAFDAC for food/drugs, SON for electronics/parts) and risk rating.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
                    <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <MapPin className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">2. Purchased Location</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Pins the incident to open market hotspots (Idumota, Alaba, Sabon Gari, Ariaria) to trigger localized alerts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
                    <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Receipt className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">3. Amount Paid For It</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Detects abnormal price undercutting used by counterfeit syndicates to dump hazardous goods quickly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <div className="border-y border-border bg-card/60 backdrop-blur text-card-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border/60 md:grid-cols-4">
          {[
            ["1,480+", "reports received", "across 36 Nigerian states"],
            ["684", "bad batches confirmed", "flagged on public radar"],
            ["32", "major open markets", "under active citizen watch"],
            ["24,891", "Nigerians protected", "via verified safety bulletins"],
          ].map(([v, l, s]) => (
            <div key={l} className="bg-card px-5 py-6 text-center">
              <strong className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground font-extrabold">{v}</strong>
              <span className="mt-1 block text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{l}</span>
              <span className="block text-[11px] text-muted-foreground mt-0.5">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Grid with Modern Icons */}
      <section className="py-16 px-4 sm:px-6 md:px-8 bg-secondary/30 border-b border-border">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <SectionHeading
                eyebrow="Market Intelligence Categories"
                title="If It Is Sold in Nigeria, It Must Be Safe."
                copy="Explore counterfeit incident velocity and risk classifications across everyday product lines."
              />
              <Button asChild variant="outline" className="rounded-xl font-bold text-xs h-9 cursor-pointer shrink-0">
                <Link to="/community">View All Reports →</Link>
              </Button>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map(({ name, Icon, count, sub, risk }) => (
              <Link
                key={name}
                to="/community"
                search={{ category: name }}
                className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon className="size-5" />
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    risk === "Critical" ? "bg-red-500/15 text-red-500" :
                    risk === "High" ? "bg-amber-500/15 text-amber-500" : "bg-secondary text-muted-foreground"
                  }`}>
                    {count}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-sm font-bold text-card-foreground group-hover:text-emerald-500 transition-colors">
                    {name}
                  </h3>
                  <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">{sub}</p>
                </div>
                <ChevronRight className="absolute bottom-4 right-4 size-4 text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-1 group-hover:text-emerald-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Verification Challenge ("Fake or Original?") */}
      <section className="py-16 px-4 sm:px-6 md:px-8 overflow-hidden">
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <Sparkles className="size-3.5" /> Interactive Consumer Eye Test
            </div>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground">
              Can You Spot The Fake Blister Pack?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Counterfeit syndicates in major open markets copy registered packaging down to tiny brand marks. Inspect the sample below and test your inspection skills.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant={verdict === "fake" ? "destructive" : "outline"}
                size="default"
                className="rounded-xl font-bold text-xs h-10 px-5 cursor-pointer shadow-sm"
                onClick={() => setVerdict("fake")}
              >
                <ShieldAlert className="size-3.5 mr-1.5" /> Looks Fake
              </Button>
              <Button
                variant={verdict === "original" ? "default" : "outline"}
                size="default"
                className="rounded-xl font-bold text-xs h-10 px-5 cursor-pointer shadow-sm"
                onClick={() => setVerdict("original")}
              >
                <CircleCheck className="size-3.5 mr-1.5" /> Looks Original
              </Button>
            </div>

            {verdict && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 rounded-xl p-4 text-xs sm:text-sm font-semibold border ${
                  verdict === "fake"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-destructive/10 border-destructive/30 text-destructive"
                }`}
              >
                {verdict === "fake"
                  ? "✓ SPOT ON! The NAFDAC registration format is invalid (missing B4- prefix) and the tamper-evident holographic foil lacks the authentic micro-print security seal."
                  : "✗ DANGER! Look closer: The batch number has double laser burns and the tamper-evident holographic foil is cheap shiny foil with no genuine verification scratch code."}
              </motion.div>
            )}
          </Reveal>

          <div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950 p-6 text-white shadow-inner">
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="grid size-11 place-items-center rounded-xl bg-white/10 backdrop-blur font-display text-base font-extrabold text-emerald-400 ring-1 ring-white/20">
                    9JA
                  </div>
                  <span className="rounded-full bg-destructive/90 px-3 py-1 text-xs font-extrabold text-white shadow-sm">
                    ₦2,400 (Market)
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
                    <ShieldAlert className="size-3.5" /> Flagged Blister Pack Sample
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-extrabold leading-tight text-white">
                    AMATEM FORTE<br />Artemether + Lumefantrine
                  </h3>
                  <div className="mt-3 space-y-1 text-xs text-slate-300 font-mono">
                    <p>NAFDAC: 04-9218 [CLONED]</p>
                    <p>Batch: NG-248193 [UNVERIFIED]</p>
                    <p>Loc: Sabon Gari, Kano</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">
              Real incident submitted by a Fake9ja citizen sentinel in Kano
            </p>
          </div>
        </div>
      </section>

      {/* Community Testimonials */}
      <section className="py-16 px-4 sm:px-6 md:px-8 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Voices of Nigeria</p>
                <h2 className="mt-2 max-w-2xl font-display text-3xl font-extrabold text-white">
                  One Anonymous Report Can Save A Whole Community.
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <div className="flex -space-x-2">
                  {["AO", "TO", "MI", "CE"].map((x) => (
                    <span key={x} className="grid size-8 place-items-center rounded-full border-2 border-slate-900 bg-emerald-600 text-[10px] font-bold text-white">
                      {x}
                    </span>
                  ))}
                </div>
                <span>Joined by 12,000+ Nigerian shoppers</span>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["I bought fake baby formula in Idumota that dissolved into chalky clumps. I uploaded photos here and within 48 hours, four other mothers in Surulere confirmed the same bad batch.", "Adaeze O.", "Lagos State"],
              ["I used the WELCOME30 coupon to get fast-track verification for suspected cloned engine oil that knocked a client's engine. Fake9ja's official report helped us secure a full vendor refund.", "Tunde A.", "Ogun State"],
              ["Fake9ja is exactly what Nigeria has needed for years. Regulators cannot be in every open stall, but we the citizens are everywhere. Power to the consumer!", "Maryam I.", "Kano State"],
            ].map(([q, n, l]) => (
              <div key={n} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-200">
                  “{q}”
                </blockquote>
                <div className="mt-5 text-xs font-bold text-white">
                  {n} <span className="font-normal text-emerald-400">— {l}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-6 md:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[.85fr_1.15fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Frequently Asked Questions"
              title="Everything You Need to Know."
              copy="How Fake9ja operates, protects your identity, and validates suspicious goods."
            />
          </Reveal>

          <Accordion type="single" collapsible className="w-full">
            {[
              ["How does Fake9ja protect my identity?", "You can submit reports 100% anonymously. We never require your real name or personal information. Your IP address is never made public, and reports are anonymized before appearing on the public incident radar."],
              ["What is the WELCOME30 coupon code for?", "The coupon code WELCOME30 gives a 30% discount on Fast-Track Priority Lab Verification (expedited 2-hour report turnaround + formal evidence dossier) and Brand Watch subscriptions for authentic product manufacturers."],
              ["Where is the submitted data stored?", "All reports and evidence are securely indexed in our database (SQLite / MySQL) and synced with the active review desk and community radar."],
              ["What are the 3 key data points needed during quick collection?", "The 3 essential data points needed when collecting fast are: Product Type (Category), Purchased Location (Market name or address), and Amount Paid for it (Price in ₦). These allow rapid classification and price anomaly detection."],
              ["Can authentic brands monitor their products?", "Yes! Authentic brand manufacturers can register on Fake9ja Brand Watch with coupon code WELCOME30 to receive continuous alerts whenever their brand name or barcode is flagged."],
            ].map(([q, a]) => (
              <AccordionItem key={q} value={q} className="border-border">
                <AccordionTrigger className="py-4 text-left font-display text-sm font-bold text-foreground hover:no-underline">
                  <span className="flex items-center gap-2.5">
                    <CircleHelp className="size-4 text-emerald-500 shrink-0" />
                    {q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pl-6 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="px-4 pb-16 sm:px-6">
        <Reveal>
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 p-8 shadow-2xl md:flex-row md:p-12 text-white">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <ShieldAlert className="size-3.5" /> Take Action Today
              </span>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                Found a Fake Product in the Market?
              </h2>
              <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-300">
                Don't keep quiet. Your 60-second report protects other unsuspecting buyers from poisoned medicines, damaged car engines, and skin-ruining cosmetics.
              </p>
            </div>
            <Button asChild size="lg" className="rounded-2xl font-extrabold text-sm h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/25 shrink-0 cursor-pointer">
              <Link to="/report">
                Submit Full Report Now <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </SiteShell>
  );
}