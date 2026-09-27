import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  Camera,
  Check,
  ClipboardCheck,
  Clock,
  Eye,
  FileSearch,
  Loader2,
  MapPin,
  Maximize2,
  PackageCheck,
  Search,
  ShieldAlert,
  ShieldCheck,
  Tag,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fake9jaAPI, formatMediaUrl, getCategoryFallbackImage, type ReportItem } from "@/lib/api";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Fake9ja — Track Product Report Status" },
      { name: "description", content: "Check the real-time review, verification, and laboratory status of your counterfeit product report with Fake9ja." },
      { property: "og:title", content: "Fake9ja — Track a Product Report" },
      { property: "og:description", content: "Real-time investigation progress from receipt to official warning." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Track,
});

function Track() {
  const [id, setId] = useState("EIE-NG-248193");
  const [report, setReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleLookup = async (lookupId?: string) => {
    const target = (lookupId || id).trim().toUpperCase();
    if (!target) return;
    setLoading(true);
    setErrorMsg("");
    const res = await Fake9jaAPI.trackReport(target);
    setLoading(false);
    if (res) {
      setReport(res);
    } else {
      setErrorMsg(`No report registered under Reference ID "${target}". Please verify the code.`);
    }
  };

  useEffect(() => {
    handleLookup("EIE-NG-248193");
  }, []);

  const getStepIndex = (status: string) => {
    switch (status) {
      case "received":
        return 0;
      case "under_review":
        return 1;
      case "verified_fake":
      case "verified_original":
        return 2;
      case "escalated":
        return 3;
      default:
        return 1;
    }
  };

  const currentStep = report ? getStepIndex(report.status) : 1;

  const timelineSteps = [
    {
      title: "Evidence Received & Indexed",
      time: report?.created_at || "Initial step",
      desc: "Photos, video, and market coordinates encrypted and recorded in MySQL registry.",
      icon: ClipboardCheck,
    },
    {
      title: "Assigned to Safety Reviewer",
      time: "Under review",
      desc: "Specialist cross-references manufacturer packaging records, holograms, and NAFDAC PIN databases.",
      icon: FileSearch,
    },
    {
      title: "Verification Verdict Reached",
      time: currentStep >= 2 ? "Completed" : "Pending review",
      desc: report?.status === "verified_fake"
        ? "Confirmed Fake / Substandard. Defect markers catalogued in national risk radar."
        : "Formal verification and lab comparative assessment.",
      icon: BadgeCheck,
    },
    {
      title: "Public Radar Alert & Regulatory Escalation",
      time: currentStep >= 3 ? "Published" : "Pending verdict",
      desc: "Reported batch flagged to community shoppers and escalated for NAFDAC and FCCPC consumer advisories.",
      icon: PackageCheck,
    },
  ];

  return (
    <SiteShell>
      {/* Search Header */}
      <section className="relative overflow-hidden px-4 pb-12 pt-10 sm:px-6 md:px-8 bg-gradient-to-b from-secondary/40 to-background border-b border-border">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-3.5" /> Private Whistleblower Tracker
          </div>

          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Follow Your Case Status
          </h1>

          <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Enter your 6-digit reference code to inspect real-time progress from the Fake9ja inspection desk.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup();
            }}
            className="mx-auto mt-6 flex max-w-md flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
              <Input
                aria-label="Reference ID"
                value={id}
                onChange={(e) => setId(e.target.value.toUpperCase())}
                className="h-11 border-0 pl-10 font-mono text-sm shadow-none uppercase"
                placeholder="e.g. EIE-NG-248193"
              />
            </div>
            <Button
              className="h-11 rounded-xl text-xs sm:text-sm font-bold px-6 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-sm shrink-0"
              type="submit"
              disabled={loading}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Track Report"}
            </Button>
          </form>

          {/* Quick Demo Pre-fill Pills */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <span>Try sample records:</span>
            {["EIE-NG-248193", "EIE-NG-248192", "EIE-NG-248191"].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setId(code);
                  handleLookup(code);
                }}
                className="font-mono text-emerald-500 hover:underline font-bold cursor-pointer"
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Report Status Card */}
      <section className="px-4 py-12 sm:px-6 md:px-8">
        {loading ? (
          <div className="py-20 text-center text-sm text-muted-foreground">
            <Loader2 className="mx-auto size-7 animate-spin text-emerald-500 mb-2" />
            Querying MySQL Intelligence Registry...
          </div>
        ) : errorMsg ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <AlertTriangle className="mx-auto size-10 text-destructive mb-3" />
            <h3 className="font-display text-base font-bold text-foreground">Record Not Found</h3>
            <p className="mt-1 text-xs text-muted-foreground">{errorMsg}</p>
          </div>
        ) : report ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
          >
            {/* Header info */}
            <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  Reference Code
                </span>
                <h2 className="mt-0.5 font-mono text-2xl font-extrabold text-foreground tracking-wide">
                  {report.reference_id}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {report.is_priority && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30">
                    <Zap className="size-3" /> Fast-Track Priority
                  </span>
                )}
                {report.coupon_used && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-mono font-bold text-foreground">
                    <Tag className="size-3 text-emerald-500" /> {report.coupon_used}
                  </span>
                )}
                <Badge
                  className={`text-xs font-extrabold uppercase tracking-wider rounded-xl px-3.5 py-1 ${
                    report.status === "verified_fake"
                      ? "bg-destructive text-white"
                      : report.status === "under_review"
                      ? "bg-amber-500 text-slate-950 font-black"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {report.status.replace("_", " ")}
                </Badge>
              </div>
            </div>

            {/* Product Meta */}
            <div className="mt-6 rounded-2xl bg-secondary/40 p-4 border border-border/80">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <span>{report.category}</span>
                <span className="text-muted-foreground font-normal">Risk: {report.risk_level.toUpperCase()}</span>
              </div>
              <h3 className="mt-1 font-display text-xl font-bold text-foreground">
                {report.product_name}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-emerald-500" /> {report.market_address}
                </span>
                {report.purchase_price && (
                  <span>Price: <strong className="text-foreground">{report.purchase_price}</strong></span>
                )}
                <span>Submitted Anonymously</span>
              </div>
            </div>

            {/* Attached Evidence & Forensic Photos */}
            {(() => {
              const mediaList = (report.media_urls && report.media_urls.length > 0)
                ? report.media_urls.map(formatMediaUrl)
                : [getCategoryFallbackImage(report.category)];

              return (
                <div className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Camera className="size-4 text-emerald-500" />
                      Attached Forensic Packaging Evidence ({mediaList.length} photo{mediaList.length > 1 ? "s" : ""})
                    </span>
                    <span className="text-[11px] text-muted-foreground">Click to inspect in high resolution</span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {mediaList.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(imgUrl)}
                        className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-xl border border-border bg-slate-950"
                      >
                        <img
                          src={imgUrl}
                          alt={`${report.product_name} evidence ${idx + 1}`}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getCategoryFallbackImage(report.category);
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                          <Eye className="size-6 text-white drop-shadow" />
                        </div>
                        <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-mono text-white">
                          Evidence #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Reviewer Findings / Notes */}
            {report.reviewer_note && (
              <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="size-4" /> Official Inspection Finding:
                </div>
                <p className="mt-1.5 text-muted-foreground leading-relaxed">
                  {report.reviewer_note}
                </p>
              </div>
            )}

            {/* Vertical Progress Timeline */}
            <div className="relative mt-8 space-y-6">
              <div className="absolute bottom-6 left-[19px] top-6 w-0.5 bg-border" />
              {timelineSteps.map((step, i) => {
                const Icon = step.icon;
                const isPassed = i < currentStep;
                const isCurrent = i === currentStep;
                return (
                  <div key={step.title} className="relative flex items-start gap-4">
                    <div
                      className={`z-10 grid size-10 shrink-0 place-items-center rounded-2xl border-2 border-card text-xs transition-colors ${
                        isPassed
                          ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30"
                          : isCurrent
                          ? "bg-amber-500 text-slate-950 font-black ring-4 ring-amber-500/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isPassed ? <Check className="size-4 stroke-[3]" /> : <Icon className="size-4" />}
                    </div>

                    <div className="pt-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className={`font-display text-sm font-bold ${isCurrent ? "text-emerald-500" : "text-foreground"}`}>
                          {step.title}
                        </strong>
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {step.time}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </section>

      {/* Lightbox for Evidence Inspection */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 max-w-4xl w-full overflow-hidden rounded-3xl border border-white/20 bg-slate-950 p-4 sm:p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-white">
                    Forensic Packaging Evidence • Case #{report?.reference_id}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedImage(null)}
                  className="rounded-full text-white hover:bg-white/10"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <div className="mt-4 relative aspect-[16/10] overflow-hidden rounded-2xl bg-black flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="High resolution evidence"
                  className="size-full object-contain"
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Direct forensic upload from whistleblower submission</span>
                <a
                  href={selectedImage}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
                >
                  <Maximize2 className="size-3.5" /> Open Full Resolution
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SiteShell>
  );
}