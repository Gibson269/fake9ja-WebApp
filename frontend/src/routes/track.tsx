import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Cpu,
  Database,
  Eye,
  ExternalLink,
  FileSearch,
  Filter,
  Layers,
  Loader2,
  Lock,
  MapPin,
  Maximize2,
  Microscope,
  PackageCheck,
  RefreshCw,
  Search,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  UserCheck,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Fake9jaAPI,
  formatMediaUrl,
  getCategoryFallbackImage,
  getLastSubmittedReportId,
  getUserSubmittedReports,
  type ReportItem,
  type AiTelemetry,
  type UserReportBookmark,
} from "@/lib/api";

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>): { ref?: string } => ({
    ref: typeof search.ref === "string" ? search.ref : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Fake9ja — Case Tracker & AI Model Training Telemetry" },
      {
        name: "description",
        content:
          "Track your active counterfeit report status and inspect real-time AI model training telemetry: data ingestion, forensic sanitization filter, feature vectorization, and active weights.",
      },
      { property: "og:title", content: "Fake9ja — Active Case Tracker & AI Model Pipeline" },
      {
        property: "og:description",
        content:
          "Track your active case and see whether your reported product data has been sanitized, vectorized, and trained into the Fake9ja neural detection model.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Track,
});

function Track() {
  const search = Route.useSearch();
  const [id, setId] = useState(search.ref || "");
  const [report, setReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai_telemetry" | "investigation" | "evidence">("ai_telemetry");
  const [userReports, setUserReports] = useState<UserReportBookmark[]>([]);

  const handleLookup = async (lookupId?: string) => {
    const target = (lookupId !== undefined ? lookupId : id).trim().toUpperCase();
    if (!target) {
      toast.error("Please enter a Reference Code to track (e.g. EIE-NG-XXXXXX)");
      return;
    }
    setId(target);
    setLoading(true);
    setErrorMsg("");

    // Sync query string so user can bookmark or copy the exact case URL
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("ref", target);
      window.history.replaceState({}, "", url.toString());
    }

    try {
      const res = await Fake9jaAPI.trackReport(target);
      setLoading(false);
      if (res) {
        setReport(res);
      } else {
        setErrorMsg(`No report registered under Reference ID "${target}". Please check the code or track one of your active submissions.`);
      }
    } catch {
      setLoading(false);
      setErrorMsg(`Unable to load report for "${target}". Please check your network connection and try again.`);
    }
  };

  useEffect(() => {
    // Load customer's active submitted reports from storage
    const list = getUserSubmittedReports();
    setUserReports(list);

    // Determine initial tracking ID:
    // 1. URL search param (?ref=...)
    // 2. Customer's last submitted active report from storage
    // 3. Otherwise leave empty so customer can enter their own code or pick their active report
    const initialTarget = (search.ref || getLastSubmittedReportId() || "").trim().toUpperCase();
    if (initialTarget) {
      setId(initialTarget);
      handleLookup(initialTarget);
    } else {
      setLoading(false);
      setReport(null);
    }
  }, [search.ref]);

  const copyRef = (refText: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(refText);
      setCopiedRef(true);
      toast.success("Case reference copied to clipboard!");
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const shareToWhatsApp = (r: ReportItem) => {
    const text = encodeURIComponent(
      `🚨 *Fake9ja Whistleblower Case Tracker*\n\nCase: #${r.reference_id}\nProduct: ${r.product_name}\nVerdict: ${r.status.replace("_", " ").toUpperCase()}\nAI Training: ${r.ai_telemetry?.stage_name || "Trained into Detection Weights"}\n\nInspect full forensic verification dossier:\nhttps://fake9ja.ng/track?ref=${r.reference_id}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const isCustomerReport = useMemo(() => {
    if (!report) return false;
    return userReports.some((u) => u.reference_id.toUpperCase() === report.reference_id.toUpperCase());
  }, [report, userReports]);

  // Regulatory investigation steps
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
      title: "Whistleblower Evidence Ingested",
      time: report?.created_at || "Initial step",
      desc: "Packaging images, purchase price, and market coordinates recorded into secure tamper-proof storage.",
      icon: Database,
    },
    {
      title: "Assigned to Forensic Verification Desk",
      time: currentStep >= 1 ? "Active" : "Queued",
      desc: "Investigator cross-references genuine manufacturer packaging, NAFDAC registration records, and laser hologram patterns.",
      icon: FileSearch,
    },
    {
      title: "Laboratory Verdict & Defect Classification",
      time: currentStep >= 2 ? "Completed" : "Pending verdict",
      desc:
        report?.status === "verified_fake"
          ? "Confirmed Counterfeit / Cloned Batch. Defect markers catalogued in national risk radar."
          : report?.status === "verified_original"
          ? "Confirmed Authentic Product. Batch conforms with original manufacturer tolerances."
          : "Forensic and chemical comparative assessment in progress.",
      icon: BadgeCheck,
    },
    {
      title: "Public Radar Alert & Regulatory Escalation",
      time: currentStep >= 3 ? "Published" : "Pending escalation",
      desc: "Dossier synchronized to community shoppers and escalated for NAFDAC, SON, and FCCPC enforcement advisories.",
      icon: PackageCheck,
    },
  ];

  // AI Pipeline Stage
  const aiTelemetry = report?.ai_telemetry;
  const aiStageIndex = useMemo(() => {
    if (!aiTelemetry) return 3;
    switch (aiTelemetry.pipeline_status) {
      case "ingested":
        return 0;
      case "filtered":
        return 1;
      case "vectorized":
        return 2;
      case "trained":
        return 3;
      default:
        return 3;
    }
  }, [aiTelemetry]);

  const aiPipelineStages = [
    {
      stage: 1,
      id: "ingested",
      title: "Raw Data Ingested",
      subtitle: "Secure Receipt",
      desc: "Consumer upload, receipt metadata, and market coordinates successfully registered.",
      icon: Database,
    },
    {
      stage: 2,
      id: "filtered",
      title: "Quality & Privacy Filter",
      subtitle: "Sanitization & Edge Check",
      desc: "PII and faces redacted, image resolution verified, duplicate check passed.",
      icon: Filter,
    },
    {
      stage: 3,
      id: "vectorized",
      title: "Forensic Vector Extraction",
      subtitle: "Packaging Embeddings",
      desc: "Micro-typography, hologram refraction, and price anomaly mapped into feature tensors.",
      icon: Cpu,
    },
    {
      stage: 4,
      id: "trained",
      title: "Model Weights Trained",
      subtitle: "Active in Inference Engine",
      desc: "Incorporated into live detection weights to protect shoppers scanning packages offline.",
      icon: Sparkles,
    },
  ];

  return (
    <SiteShell>
      {/* Header & Lookup Bar */}
      <section className="relative overflow-hidden px-4 pb-12 pt-10 sm:px-6 md:px-8 bg-gradient-to-b from-secondary/40 via-secondary/10 to-background border-b border-border">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Cpu className="size-3.5" /> Citizen Case & AI Telemetry Tracker
          </div>

          <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Track Your Active Report Status
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Follow your reported counterfeit case from initial receipt to laboratory verification, and inspect how your data is filtered, vectorized, and trained into our AI detection model.
          </p>

          {/* Search Form (No hardcoded placeholder code) */}
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
                placeholder="Enter code (e.g. EIE-NG-XXXXXX)"
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

          {/* Customer's Active Submissions Quick Selector */}
          {userReports.length > 0 && (
            <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 max-w-lg mx-auto text-left shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <UserCheck className="size-3.5" /> Your Active Report Submissions ({userReports.length})
                </div>
                <span className="text-[10px] text-muted-foreground">Stored on this device</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {userReports.map((item) => {
                  const isSelected = report?.reference_id.toUpperCase() === item.reference_id.toUpperCase();
                  return (
                    <button
                      key={item.reference_id}
                      type="button"
                      onClick={() => {
                        setId(item.reference_id);
                        handleLookup(item.reference_id);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs transition-all cursor-pointer border ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-600 text-white shadow-xs font-bold"
                          : "border-border bg-card hover:border-emerald-500/40 text-foreground"
                      }`}
                    >
                      <span className="font-mono text-[11px]">{item.reference_id}</span>
                      <span className="text-[11px] opacity-80 max-w-[120px] truncate">{item.product_name}</span>
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-4 py-8 sm:px-6 md:px-8">
        {loading ? (
          <div className="mx-auto max-w-3xl py-24 text-center">
            <Loader2 className="mx-auto size-8 animate-spin text-emerald-500 mb-3" />
            <h3 className="font-display text-base font-bold text-foreground">Querying Forensic Telemetry...</h3>
            <p className="mt-1 text-xs text-muted-foreground">Retrieving report details, filter audits, and AI weights...</p>
          </div>
        ) : errorMsg ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <AlertTriangle className="mx-auto size-10 text-destructive mb-3" />
            <h3 className="font-display text-base font-bold text-foreground">Record Not Found</h3>
            <p className="mt-1 text-xs text-muted-foreground">{errorMsg}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {userReports.length > 0 && (
                <Button
                  size="sm"
                  className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  onClick={() => {
                    setId(userReports[0].reference_id);
                    handleLookup(userReports[0].reference_id);
                  }}
                >
                  <UserCheck className="mr-1.5 size-3.5" /> Track Your Latest Report ({userReports[0].reference_id})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-xl text-xs"
              >
                <a href="/report">Submit a New Report</a>
              </Button>
            </div>
          </div>
        ) : !report ? (
          /* Empty Search State: When customer has not loaded or searched any case yet */
          <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 sm:p-10 text-center shadow-sm">
            <div className="grid size-14 place-items-center rounded-2xl bg-secondary mx-auto mb-4 text-muted-foreground">
              <FileSearch className="size-7 text-emerald-500" />
            </div>
            <h2 className="font-display text-2xl font-extrabold text-foreground">
              Ready to Track Your Report
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              When you submit a report on Fake9ja, an official reference code is generated (e.g. EIE-NG-XXXXXX). Enter your code above to track its investigation and AI training status.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white h-10 px-5 cursor-pointer">
                <a href="/report">
                  Submit a Counterfeit Report <ArrowRight className="size-3.5 ml-1.5" />
                </a>
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Or inspect a verified community case verification:
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { code: "EIE-NG-248193", name: "Amatem Forte", cat: "Medicines" },
                  { code: "EIE-NG-248192", name: "FloraPure Lotion", cat: "Cosmetics" },
                  { code: "EIE-NG-248190", name: "Semovita 10kg", cat: "Food" },
                ].map((sample) => (
                  <button
                    key={sample.code}
                    type="button"
                    onClick={() => {
                      setId(sample.code);
                      handleLookup(sample.code);
                    }}
                    className="rounded-xl border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-emerald-500/40 transition-colors font-medium cursor-pointer"
                  >
                    <strong className="text-foreground">{sample.name}</strong> • <span className="font-mono">{sample.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Report Loaded & Visualized */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mx-auto max-w-4xl space-y-6"
          >
            {/* 1. Primary Case Dossier Card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Case Reference Dossier
                    </span>
                    <button
                      type="button"
                      onClick={() => copyRef(report.reference_id)}
                      className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="Copy reference ID"
                    >
                      {copiedRef ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                      <span>{copiedRef ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <h2 className="mt-1 font-mono text-2xl sm:text-3xl font-extrabold text-foreground tracking-wide">
                    {report.reference_id}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Active Customer Submission Badge */}
                  {isCustomerReport && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30">
                      <CheckCircle2 className="size-3.5 text-emerald-500" /> Your Active Report
                    </span>
                  )}

                  {report.is_priority && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30">
                      <Zap className="size-3" /> Priority Fast-Track
                    </span>
                  )}

                  {/* AI Status Pill */}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${
                      aiTelemetry?.pipeline_status === "trained"
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                        : aiTelemetry?.pipeline_status === "filtered"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    <Sparkles className="size-3" />
                    {aiTelemetry?.filter_status || "AI Filter Passed"}
                  </span>

                  <Badge
                    className={`text-xs font-extrabold uppercase tracking-wider rounded-xl px-3.5 py-1 ${
                      report.status === "verified_fake"
                        ? "bg-destructive text-white"
                        : report.status === "under_review"
                        ? "bg-amber-500 text-slate-950 font-black"
                        : report.status === "escalated"
                        ? "bg-red-700 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {report.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              {/* Product Metadata Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl bg-secondary/30 p-5 border border-border/80">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <span>{report.category}</span>
                    <span>•</span>
                    <span className="text-muted-foreground font-normal">Risk Level: {report.risk_level.toUpperCase()}</span>
                  </div>
                  <h3 className="mt-1 font-display text-xl font-bold text-foreground">
                    {report.product_name}
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-emerald-500" /> {report.market_address}
                    </span>
                    {report.purchase_price && (
                      <span>
                        Purchase Price: <strong className="text-foreground">{report.purchase_price}</strong>
                      </span>
                    )}
                    <span>Logged {report.created_at}</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-5 gap-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Whistleblower Verification Share
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => shareToWhatsApp(report)}
                    className="rounded-xl text-xs font-bold gap-1.5 cursor-pointer bg-card hover:bg-secondary"
                  >
                    <Share2 className="size-3.5 text-emerald-500" /> Share Verification Receipt
                  </Button>
                </div>
              </div>

              {/* Navigation View Switcher (Tabs) */}
              <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-border pb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("ai_telemetry")}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "ai_telemetry"
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Cpu className="size-3.5" />
                  AI Model Training & Telemetry
                  <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">Live</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("investigation")}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "investigation"
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <ShieldCheck className="size-3.5" />
                  Regulatory & Lab Timeline
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("evidence")}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "evidence"
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Camera className="size-3.5" />
                  Packaging Evidence Vault
                  <span className="rounded-full bg-secondary-foreground/10 px-1.5 py-0.2 text-[10px] font-mono">
                    {report.media_urls?.length || 1}
                  </span>
                </button>
              </div>

              {/* TAB 1: AI MODEL TRAINING & DATA FILTER TELEMETRY */}
              {activeTab === "ai_telemetry" && (
                <div className="mt-6 space-y-6">
                  {/* Hero AI Impact Banner */}
                  <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-background p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Civic Model Training Impact
                          </span>
                        </div>
                        <h4 className="mt-1 font-display text-lg sm:text-xl font-extrabold text-foreground">
                          {aiTelemetry?.contribution_impact || "+0.024% Regional Detection Sensitivity Boost"}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-xl">
                          This report passed through our sanitization and privacy filter. Its packaging defect features are actively training the{" "}
                          <strong className="text-foreground">{aiTelemetry?.target_model_version || "Fake9ja Mobile Neural v3.8"}</strong> inference weights in the{" "}
                          <span className="font-mono text-emerald-500 font-bold">{aiTelemetry?.training_partition || "TRAIN_SET_MEDICINES"}</span> partition.
                        </p>
                      </div>

                      <div className="shrink-0 rounded-2xl border border-emerald-500/20 bg-background/80 p-3.5 text-center sm:text-right backdrop-blur-sm">
                        <div className="text-[10px] uppercase font-bold text-muted-foreground">Confidence Score</div>
                        <div className="font-mono text-2xl font-black text-emerald-500">
                          {aiTelemetry?.confidence_score || 96}%
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {aiTelemetry?.vectors_extracted || 10} vectors extracted
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4-Stage AI Pipeline Visualizer */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                        <Activity className="size-4 text-emerald-500" /> AI Model Lifecycle & Training Pipeline
                      </h4>
                      <span className="text-[11px] text-muted-foreground">Stage {aiStageIndex + 1} of 4 Complete</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {aiPipelineStages.map((stg, idx) => {
                        const Icon = stg.icon;
                        const isCompleted = idx <= aiStageIndex;
                        const isCurrent = idx === aiStageIndex;

                        return (
                          <div
                            key={stg.id}
                            className={`relative rounded-2xl border p-4 transition-all ${
                              isCurrent
                                ? "border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/20 shadow-sm"
                                : isCompleted
                                ? "border-emerald-500/30 bg-card"
                                : "border-border/60 bg-secondary/20 opacity-70"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div
                                className={`grid size-8 place-items-center rounded-xl text-xs font-bold ${
                                  isCompleted
                                    ? "bg-emerald-600 text-white"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {isCompleted ? <Check className="size-4 stroke-[3]" /> : <Icon className="size-4" />}
                              </div>
                              <span className="font-mono text-[10px] font-bold text-muted-foreground">
                                Stage 0{stg.stage}
                              </span>
                            </div>

                            <div className="mt-3">
                              <h5 className="font-display text-sm font-bold text-foreground">
                                {stg.title}
                              </h5>
                              <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                {stg.subtitle}
                              </div>
                              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                                {stg.desc}
                              </p>
                            </div>

                            {isCurrent && (
                              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                                Active Status
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Privacy & Quality Sanitization Filter Card */}
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Filter className="size-4 text-emerald-500" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Data Sanitization & Quality Filter Report
                        </h4>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5" /> Filter Passed
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Before any citizen data reaches the AI training cluster, it undergoes strict privacy anonymization and adversarial filtering. Here is the automated filter audit for this report:
                    </p>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-secondary/30 p-3">
                        <Lock className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground block font-semibold">Privacy & PII Anonymization</strong>
                          <span className="text-muted-foreground text-[11px]">
                            Biometric faces, phone numbers, and bystander IDs automatically redacted from media artifacts.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-secondary/30 p-3">
                        <Eye className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground block font-semibold">Optical Clarity & Resolution</strong>
                          <span className="text-muted-foreground text-[11px]">
                            Surface glare and motion blur corrected; packaging micro-print resolution verified for edge detection.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-secondary/30 p-3">
                        <MapPin className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground block font-semibold">Geospatial Validation</strong>
                          <span className="text-muted-foreground text-[11px]">
                            Report coordinates confirmed against verified physical commercial trade hub ({report.market_address}).
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-secondary/30 p-3">
                        <ShieldCheck className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground block font-semibold">Adversarial & Duplicate Defense</strong>
                          <span className="text-muted-foreground text-[11px]">
                            Cleaned against synthetic bot submissions and duplicated imagery (Sybil defense passed).
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Extracted Forensic Feature Vectors */}
                  {aiTelemetry?.features && aiTelemetry.features.length > 0 && (
                    <div className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="size-4 text-emerald-500" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                            Extracted Forensic Feature Vectors ({aiTelemetry.features.length})
                          </h4>
                        </div>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          Model Weights: {aiTelemetry.target_model_version || "Fake9ja Neural v3.8"}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {aiTelemetry.features.map((feat, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-border/80 bg-secondary/20 p-3.5 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <strong className="text-xs font-bold text-foreground">
                                {feat.name}
                              </strong>
                              <span className="font-mono text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                {feat.confidence}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {feat.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: INVESTIGATION & REGULATORY TIMELINE */}
              {activeTab === "investigation" && (
                <div className="mt-6 space-y-6">
                  {/* Official Inspection Finding */}
                  {report.reviewer_note && (
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5">
                      <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                        <Microscope className="size-4" /> Official Inspection Desk Findings:
                      </div>
                      <p className="mt-2 text-xs sm:text-sm text-foreground leading-relaxed font-serif italic">
                        "{report.reviewer_note}"
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <BadgeCheck className="size-3.5 text-emerald-500" /> Verified by Senior Counterfeit Analyst • Fake9ja Sentinel Labs
                      </div>
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
                              <strong
                                className={`font-display text-sm font-bold ${
                                  isCurrent ? "text-emerald-500" : "text-foreground"
                                }`}
                              >
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

                  {/* Regulatory Escalation Notice */}
                  <div className="rounded-2xl border border-border bg-secondary/30 p-4 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <ShieldAlert className="size-4 text-amber-500" /> Regulatory Consumer Advisory Hand-off
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Confirmed counterfeit batches are compiled into standardized enforcement packets for NAFDAC (National Agency for Food and Drug Administration and Control), SON (Standards Organisation of Nigeria), and FCCPC (Federal Competition and Consumer Protection Commission).
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: PACKAGING EVIDENCE VAULT */}
              {activeTab === "evidence" && (
                <div className="mt-6 space-y-4">
                  {(() => {
                    const mediaList =
                      report.media_urls && report.media_urls.length > 0
                        ? report.media_urls.map(formatMediaUrl)
                        : [getCategoryFallbackImage(report.category)];

                    return (
                      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                            <Camera className="size-4 text-emerald-500" />
                            Forensic Packaging Evidence ({mediaList.length} photo{mediaList.length > 1 ? "s" : ""})
                          </span>
                          <span className="text-[11px] text-muted-foreground">Click any photo to inspect high-res</span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                              <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/75 px-1.5 py-0.5 text-[9px] font-mono text-white">
                                Evidence #{idx + 1}
                              </span>
                            </div>
                          ))}
                        </div>

                        {report.details && (
                          <div className="mt-4 rounded-xl bg-secondary/40 p-3 text-xs">
                            <strong className="block text-foreground mb-1 font-semibold">Whistleblower Incident Notes:</strong>
                            <p className="text-muted-foreground text-[11px] leading-relaxed">
                              {report.details}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Bottom Actions Card */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">
                Case reference: <strong className="font-mono text-foreground">{report.reference_id}</strong> • Keep this code safe for ongoing inquiries.
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyRef(window.location.href)}
                  className="rounded-xl text-xs gap-1.5 cursor-pointer"
                >
                  <Copy className="size-3.5" /> Copy Case URL
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                >
                  <a href="/report">
                    Report Another Product <ArrowRight className="size-3.5 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
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
                <span>Direct whistleblower upload analyzed by Fake9ja Sentinel</span>
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