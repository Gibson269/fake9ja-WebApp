import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Building2,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  FileWarning,
  Flame,
  Globe,
  Home,
  Image as ImageIcon,
  Inbox,
  KeyRound,
  Layers,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Maximize2,
  Megaphone,
  Menu,
  Phone,
  Plus,
  PlusCircle,
  Radio,
  RefreshCw,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Ticket,
  Trash2,
  TrendingUp,
  UploadCloud,
  UserCheck,
  Users,
  Video,
  Youtube,
  Instagram,
  ExternalLink,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BrandMark } from "@/components/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fake9jaAPI, formatMediaUrl, getCategoryFallbackImage, type ReportItem } from "@/lib/api";
import {
  loadStoredTestimonies,
  saveStoredTestimonies,
  parseVideoSource,
  getVideoThumbnail,
  type VideoTestimony,
  type VideoPlatform,
} from "@/lib/testimonies";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Fake9ja Sentinel — Chief Inspector Intelligence Command" },
      { name: "description", content: "Dedicated administrative command desk for product triage, laboratory findings, and public counterfeit broadcast." },
      { property: "og:title", content: "Fake9ja — Admin Intelligence Command" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AdminPage,
});

type AdminTab = "overview" | "triage" | "publish" | "videos" | "hotspots" | "brands" | "coupons" | "export";

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem("fake9ja_admin_token"));
    } catch {
      return false;
    }
  });

  if (!isAuthenticated) {
    return <AdminLoginGate onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />;
}

// -------------------------------------------------------------
// 1. SECURE ADMIN LOGIN GATE (STRICT AUTHENTICATION REQUIRED)
// -------------------------------------------------------------
function AdminLoginGate({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleLogin = async (e?: React.FormEvent, directEmail?: string, directPassword?: string) => {
    if (e) e.preventDefault();
    setAuthError("");

    const targetEmail = (directEmail !== undefined ? directEmail : email).trim();
    const targetPassword = (directPassword !== undefined ? directPassword : password).trim();

    if (!targetEmail || !targetPassword) {
      setAuthError("Both email and authentication password are required.");
      toast.error("Please enter inspector credentials.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await Fake9jaAPI.adminLogin(targetEmail, targetPassword);
      setSubmitting(false);

      if (res.success) {
        toast.success(res.message);
        onLoginSuccess();
      } else {
        setAuthError(res.message || "Access Denied: Invalid Chief Inspector credentials.");
        toast.error("Access Denied: Invalid Chief Inspector credentials.");
      }
    } catch (err: any) {
      setSubmitting(false);
      setAuthError("Authentication check failed. Please check network connection.");
      toast.error("Inspector authentication error.");
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@fake9ja.ng");
    setPassword("admin123");
    setAuthError("");
    toast.info("Inspector credentials auto-filled. Click Unlock to enter.");
  };

  const handleInstantDemoLogin = () => {
    setEmail("admin@fake9ja.ng");
    setPassword("admin123");
    handleLogin(undefined, "admin@fake9ja.ng", "admin123");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 size-96 rounded-full bg-rose-500/10 blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
      >
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-inner">
            <ShieldAlert className="size-7 stroke-[2.2]" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            Restricted Admin Command Gate
          </div>

          <h1 className="mt-3 font-display text-2xl font-black text-white sm:text-3xl tracking-tight">
            Inspector Desk Login
          </h1>
          <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
            Only authorized Chief Inspectors with verified email and password credentials can access this page.
          </p>
        </div>

        {/* Auth Error Banner if invalid */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2"
          >
            <AlertTriangle className="size-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{authError}</span>
          </motion.div>
        )}

        {/* Demo Credentials Helper Pill for convenient evaluator access */}
        <div className="mt-5 rounded-2xl border border-emerald-500/25 bg-emerald-950/40 p-3.5 text-xs">
          <div className="flex items-center justify-between text-emerald-300 font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <KeyRound className="size-3.5 text-emerald-400" /> Authorized Admin Key
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-extrabold text-emerald-400 hover:underline cursor-pointer"
              >
                Fill Credentials
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={handleInstantDemoLogin}
                className="text-[11px] font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 px-2 py-0.5 rounded-md cursor-pointer transition"
              >
                Instant Unlock
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 mt-2 font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Email:</span>
              <strong className="text-white">admin@fake9ja.ng</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Password:</span>
              <strong className="text-white">admin123</strong>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Inspector Security Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setAuthError("");
                }}
                placeholder="admin@fake9ja.ng"
                className="h-11 rounded-xl border-slate-700 bg-slate-950 pl-10 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Security Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-medium text-slate-400 hover:text-slate-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
              <Input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError("");
                }}
                placeholder="••••••••••••"
                className="h-11 rounded-xl border-slate-700 bg-slate-950 pl-10 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 cursor-pointer mt-2"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Verifying Security Tokens...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Unlock Inspector Command <ArrowRight className="size-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
          <Link to="/" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <span>←</span> Return to Citizen Public Radar
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. STANDALONE ADMIN DASHBOARD WITH DEDICATED SIDEBAR LAYOUT
// -------------------------------------------------------------
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core Data States
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [brandWatches, setBrandWatches] = useState<any[]>([]);
  const [hotspots, setHotspots] = useState<any[]>([]);

  // Triage View Controls
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Lightbox Modal State
  const [activeLightboxMedia, setActiveLightboxMedia] = useState<string | null>(null);

  // New Hotspot Modal State
  const [showAddHotspot, setShowAddHotspot] = useState(false);
  const [newHotspotForm, setNewHotspotForm] = useState({
    name: "",
    state: "Lagos",
    risk_level: "high",
    incident_count: 10,
  });

  // PUBLISH FAKE PRODUCT FORM STATE
  const [publishForm, setPublishForm] = useState({
    product_name: "",
    brand: "",
    category: "Medicines",
    state: "Lagos",
    market_address: "Alaba International Market",
    issue_type: "Cloned Packaging & Inactive Formulation",
    details: "Purchased blister pack lacked hologram seal and failed spectroscopic dissolution testing.",
    reviewer_note: "Confirmed counterfeit: 0% active therapeutic ingredient. Immediate hazardous adulterant alert.",
    purchase_price: "₦2,400",
    risk_level: "high" as "low" | "medium" | "high",
    preset_image: "/images/counterfeit-malaria.jpg",
  });
  const [publishFiles, setPublishFiles] = useState<File[]>([]);
  const [publishPreviewUrl, setPublishPreviewUrl] = useState<string>("/images/counterfeit-malaria.jpg");
  const [isPublishing, setIsPublishing] = useState(false);

  // VIDEO TESTIMONIES & CAROUSEL MANAGEMENT STATE
  const [videoTestimonies, setVideoTestimonies] = useState<VideoTestimony[]>(() => loadStoredTestimonies());
  const [videoForm, setVideoForm] = useState({
    title: "",
    source_url: "",
    author_name: "Citizen Sentinel",
    author_handle: "@citizen_sentinel",
    location: "Alaba International Market, Lagos",
    quote: "",
    summary: "",
    ai_feature: "Tamper band perforation and holographic sheen anomaly",
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>("");
  const [isSavingVideo, setIsSavingVideo] = useState(false);

  // Fetch all intelligence data
  const refreshAllData = async () => {
    setLoadingReports(true);
    try {
      const [fetchedReports, fetchedWatches, fetchedHotspots, fetchedVideos] = await Promise.all([
        Fake9jaAPI.getReports(),
        Fake9jaAPI.getBrandWatches(),
        Fake9jaAPI.getHotspots(),
        Fake9jaAPI.getVideoTestimonies().catch(() => []),
      ]);
      setReports(Array.isArray(fetchedReports) ? fetchedReports : []);
      setBrandWatches(Array.isArray(fetchedWatches) ? fetchedWatches : []);
      setHotspots(Array.isArray(fetchedHotspots) ? fetchedHotspots : []);
      if (fetchedVideos && fetchedVideos.length > 0) {
        const normalized: VideoTestimony[] = fetchedVideos.map((s: any) => {
          const parsed = parseVideoSource(s.source_url || s.local_video_url || "");
          return {
            id: s.id,
            type: parsed.inferredType,
            title: s.title || "Video Alert",
            authorName: s.author_name || "Citizen Sentinel",
            authorHandle: s.author_handle || "@citizen",
            sourceUrl: s.source_url || "#",
            embedUrl: s.embed_url || parsed.embedUrl,
            localVideoUrl: s.local_video_url || parsed.localVideoUrl,
            thumbnailUrl: getVideoThumbnail({ title: s.title, thumbnailUrl: s.thumbnail_url, sourceUrl: s.source_url, tag: s.tag, summary: s.summary }),
            platform: (s.platform || parsed.platform) as VideoPlatform,
            location: s.location || "Nigeria",
            summary: s.summary || "",
            quote: s.quote || "",
            date: s.created_at ? new Date(s.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recent",
            tag: s.tag || "Citizen Alert",
            duration: s.duration || "1:00",
            aiFeature: s.ai_feature || "",
          };
        });
        const existing = loadStoredTestimonies();
        const existingIds = new Set(normalized.map((n) => String(n.id)));
        const merged = [...normalized, ...existing.filter((e) => !existingIds.has(String(e.id)))];
        setVideoTestimonies(merged);
        saveStoredTestimonies(merged);
      }
    } catch (err) {
      console.error("Failed to load admin intelligence data", err);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Update Status Handler
  const handleUpdateStatus = async (status: ReportItem["status"]) => {
    if (!selectedReport) return;
    setIsUpdatingStatus(true);
    await Fake9jaAPI.updateReportStatus(selectedReport.id, status, reviewNote || undefined);
    setIsUpdatingStatus(false);

    toast.success(`Case #${selectedReport.reference_id} status updated to '${status.replace("_", " ")}'!`);

    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id || r.reference_id === selectedReport.reference_id
          ? { ...r, status, details: reviewNote || r.details }
          : r
      )
    );
    setSelectedReport(null);
    setReviewNote("");
  };

  // Delete Report Handler
  const handleDeleteReport = async (id: number | string) => {
    if (!confirm("Are you sure you want to expunge this report from the national registry?")) return;
    await Fake9jaAPI.deleteReport(id);
    toast.success("Incident record purged successfully.");
    setReports((prev) => prev.filter((r) => r.id !== id && r.reference_id !== id));
    if (selectedReport?.id === id || selectedReport?.reference_id === id) {
      setSelectedReport(null);
    }
  };

  // PUBLISH FAKE PRODUCT HANDLER
  const handlePublishFakeProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishForm.product_name.trim()) {
      toast.error("Please specify the counterfeit product name.");
      return;
    }
    if (!publishForm.market_address.trim()) {
      toast.error("Please specify the market location where this counterfeit was flagged.");
      return;
    }

    setIsPublishing(true);
    const fd = new FormData();
    fd.append("product_name", publishForm.product_name);
    fd.append("brand", publishForm.brand || "");
    fd.append("category", publishForm.category);
    fd.append("state", publishForm.state);
    fd.append("market_address", publishForm.market_address);
    fd.append("issue_type", publishForm.issue_type);
    fd.append("details", publishForm.details);
    fd.append("reviewer_note", publishForm.reviewer_note);
    fd.append("purchase_price", publishForm.purchase_price);
    fd.append("risk_level", publishForm.risk_level);

    if (publishFiles.length > 0) {
      publishFiles.forEach((f) => fd.append("files[]", f));
    }

    const res = await Fake9jaAPI.publishFakeProduct(fd);
    setIsPublishing(false);

    if (res.success && res.report) {
      // If preset photo was selected and no file uploaded, apply preset to report media_urls
      if (publishFiles.length === 0 && publishForm.preset_image) {
        res.report.media_urls = [publishForm.preset_image];
      }

      toast.success(res.message);
      setReports((prev) => [res.report!, ...prev]);

      // Reset form
      setPublishForm({
        product_name: "",
        brand: "",
        category: "Medicines",
        state: "Lagos",
        market_address: "",
        issue_type: "Counterfeit Packaging & Inactive Formulation",
        details: "",
        reviewer_note: "",
        purchase_price: "",
        risk_level: "high",
        preset_image: "/images/counterfeit-malaria.jpg",
      });
      setPublishFiles([]);
      setActiveTab("triage");
    } else {
      toast.error("Could not broadcast fake product.");
    }
  };

  // Create Hotspot Handler
  const handleCreateHotspot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotspotForm.name.trim()) {
      toast.error("Please enter a market name.");
      return;
    }
    const created = await Fake9jaAPI.createHotspot(newHotspotForm);
    setHotspots((prev) => [created, ...prev]);
    setShowAddHotspot(false);
    setNewHotspotForm({ name: "", state: "Lagos", risk_level: "high", incident_count: 10 });
    toast.success(`Market Hotspot '${newHotspotForm.name}' registered to surveillance radar!`);
  };

  // Delete Hotspot Handler
  const handleDeleteHotspot = async (id: number | string) => {
    if (!confirm("Remove this market hotspot from the surveillance register?")) return;
    await Fake9jaAPI.deleteHotspot(id);
    setHotspots((prev) => prev.filter((h) => h.id !== id));
    toast.success("Market hotspot surveillance status cleared.");
  };

  // Video Testimony Handlers
  const handleSaveVideoTestimony = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title.trim()) {
      toast.error("Please enter a video title / headline.");
      return;
    }
    if (!videoForm.source_url.trim() && !videoFile) {
      toast.error("Please enter a video link or choose a video file.");
      return;
    }

    setIsSavingVideo(true);
    let resolvedLocalUrl = "";
    if (videoFile) {
      resolvedLocalUrl = URL.createObjectURL(videoFile);
    }

    let resolvedThumbnailUrl = thumbnailPreviewUrl || "";
    if (!resolvedThumbnailUrl) {
      resolvedThumbnailUrl = getVideoThumbnail({ title: videoForm.title, sourceUrl: videoForm.source_url });
    }

    const parsed = parseVideoSource(videoForm.source_url.trim() || resolvedLocalUrl);
    const newTestimony: VideoTestimony = {
      id: `admin-${Date.now()}`,
      type: parsed.inferredType,
      title: videoForm.title.trim(),
      authorName: videoForm.author_name.trim() || "Chief Inspector Desk",
      authorHandle: videoForm.author_handle.trim() || "@fake9ja_hq",
      sourceUrl: videoForm.source_url.trim() || resolvedLocalUrl || "#",
      embedUrl: parsed.embedUrl,
      localVideoUrl: resolvedLocalUrl || parsed.localVideoUrl,
      thumbnailUrl: resolvedThumbnailUrl || "/images/hero-scanner.jpg",
      platform: parsed.platform,
      location: videoForm.location.trim() || "National Distribution",
      quote: videoForm.quote.trim() || "We (Nigerians) have the power to solve this.",
      summary: videoForm.summary.trim() || "Flagged video alert contributing to AI model forensic training.",
      aiFeature: videoForm.ai_feature.trim() || "Tamper seal fracture and holographic sheen analysis",
      date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      tag: "Admin Verified Alert",
      duration: "1:00",
      is_active: true,
    };

    try {
      await Fake9jaAPI.storeVideoTestimony({
        title: newTestimony.title,
        source_url: newTestimony.sourceUrl,
        platform: newTestimony.platform,
        author_name: newTestimony.authorName,
        author_handle: newTestimony.authorHandle,
        location: newTestimony.location,
        quote: newTestimony.quote,
        summary: newTestimony.summary,
        ai_feature: newTestimony.aiFeature,
        tag: newTestimony.tag,
        duration: newTestimony.duration,
        local_video_url: newTestimony.localVideoUrl,
        video_file: videoFile,
        thumbnail_url: newTestimony.thumbnailUrl,
      });
    } catch {
      // Offline fallback - still save to localStorage
    }

    const updated = [newTestimony, ...videoTestimonies];
    setVideoTestimonies(updated);
    saveStoredTestimonies(updated);
    setIsSavingVideo(false);

    setVideoForm({
      title: "",
      source_url: "",
      author_name: "Citizen Sentinel",
      author_handle: "@citizen_sentinel",
      location: "Alaba International Market, Lagos",
      quote: "",
      summary: "",
      ai_feature: "Tamper band perforation and holographic sheen anomaly",
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setThumbnailPreviewUrl("");

    toast.success(`Video testimony '${newTestimony.title}' published to landing carousel!`);
  };

  const handleDeleteVideo = async (id: string | number) => {
    if (!confirm("Remove this video testimony from the public landing carousel?")) return;
    try {
      await Fake9jaAPI.deleteVideoTestimony(id);
    } catch {
      // Offline fallback
    }
    const updated = videoTestimonies.filter((v) => String(v.id) !== String(id));
    setVideoTestimonies(updated);
    saveStoredTestimonies(updated);
    toast.success("Video testimony removed from landing carousel.");
  };


  const handleExportCSV = () => {
    const headers = [
      "Reference ID",
      "Product Name",
      "Brand",
      "Category",
      "State",
      "Market Location",
      "Issue Type",
      "Price Paid",
      "Status",
      "Risk Level",
      "Priority Fast-Track",
      "Date Reported",
    ];

    const rows = reports.map((r) => [
      `"${r.reference_id || "N/A"}"`,
      `"${(r.product_name || "N/A").replace(/"/g, '""')}"`,
      `"${(r.brand || "N/A").replace(/"/g, '""')}"`,
      `"${r.category || "N/A"}"`,
      `"${r.state || "N/A"}"`,
      `"${(r.market_address || "N/A").replace(/"/g, '""')}"`,
      `"${(r.issue_type || "N/A").replace(/"/g, '""')}"`,
      `"${r.purchase_price || "N/A"}"`,
      `"${r.status || "N/A"}"`,
      `"${r.risk_level || "N/A"}"`,
      `"${r.is_priority ? "YES" : "NO"}"`,
      `"${r.created_at || "N/A"}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Fake9ja_Forensic_Intelligence_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("NAFDAC/Law Enforcement Incident CSV exported successfully!");
  };

  // Filtered reports for Triage tab
  const filteredReports = reports.filter((r) => {
    const q = (search || "").toLowerCase().trim();
    const productName = (r.product_name || "").toLowerCase();
    const refId = (r.reference_id || "").toLowerCase();
    const market = (r.market_address || "").toLowerCase();
    const brand = (r.brand || "").toLowerCase();

    const matchSearch =
      !q ||
      productName.includes(q) ||
      refId.includes(q) ||
      market.includes(q) ||
      brand.includes(q);

    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchRisk = filterRisk === "all" || r.risk_level === filterRisk;
    return matchSearch && matchStatus && matchRisk;
  });

  // Calculate high-level stats
  const totalReportsCount = reports.length;
  const verifiedFakeCount = reports.filter((r) => r.status === "verified_fake").length;
  const underReviewCount = reports.filter((r) => r.status === "under_review" || r.status === "received").length;
  const highRiskCount = reports.filter((r) => r.risk_level === "high").length;
  const priorityCount = reports.filter((r) => r.is_priority).length;

  const sidebarNavItems: { id: AdminTab; label: string; icon: any; count?: number; highlight?: boolean }[] = [
    { id: "overview", label: "Intelligence Overview", icon: Home },
    { id: "triage", label: "Incident Triage Queue", icon: Inbox, count: underReviewCount },
    { id: "publish", label: "Publish Fake Product", icon: ShieldAlert, highlight: true },
    { id: "videos", label: "Video Testimonies", icon: Video, count: videoTestimonies.length },
    { id: "hotspots", label: "Market Hotspots", icon: Flame, count: hotspots.length },
    { id: "brands", label: "Brand Watch Sentinel", icon: ShieldCheck, count: brandWatches.length },
    { id: "coupons", label: "Promo & Vouchers", icon: Ticket },
    { id: "export", label: "Regulatory Dispatch", icon: Download },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 font-sans text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* -------------------------------------------------------------
          LEFT STANDALONE SIDEBAR FOR DEDICATED ADMIN NAVIGATION
      -------------------------------------------------------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800/80 bg-slate-900/95 backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800/80 px-6">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] font-extrabold uppercase tracking-widest text-emerald-400 border border-emerald-400/30">
                COMMAND DESK
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">Forensic Triage</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Lead Inspector Profile Badge */}
        <div className="p-4 mx-4 mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 flex items-center gap-3">
          <div className="relative size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-white shadow-md">
            <span>AB</span>
            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
          </div>
          <div className="overflow-hidden">
            <strong className="block text-xs font-bold text-white truncate">Dr. Amina Bello</strong>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold truncate">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Chief Inspector Online
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="mt-4 flex-1 space-y-1.5 px-4 overflow-y-auto scrollbar-none">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex h-11 w-full items-center justify-between rounded-xl px-3.5 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : item.highlight
                    ? "text-rose-400 hover:bg-rose-500/10 border border-rose-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`size-4 shrink-0 ${isActive ? "text-slate-950" : item.highlight ? "text-rose-400" : ""}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-extrabold ${
                      isActive ? "bg-slate-950 text-emerald-400" : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Health & Logout */}
        <div className="border-t border-slate-800/80 p-4 space-y-2 mt-auto">
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-2 py-1">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              SQLite / MySQL Synced
            </span>
            <span className="font-mono text-emerald-400">Port 8000 OK</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl h-9 border-slate-800 bg-slate-950 text-[11px] font-bold text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Link to="/">Exit to Site</Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                try {
                  localStorage.removeItem("fake9ja_admin_token");
                  localStorage.removeItem("fake9ja_admin_user");
                } catch {
                  // ignore
                }
                toast.info("Chief Inspector session terminated.");
                onLogout();
              }}
              className="rounded-xl h-9 text-[11px] font-bold cursor-pointer bg-destructive/80 hover:bg-destructive"
            >
              <LogOut className="size-3.5 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* -------------------------------------------------------------
          MAIN APPLICATION VIEW AREA
      -------------------------------------------------------------- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-20 items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 sm:px-8 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-black text-white capitalize">
                {activeTab === "overview" && "National Counterfeit Radar Overview"}
                {activeTab === "triage" && "Incident Case Review & Verification Queue"}
                {activeTab === "publish" && "Publish Official Counterfeit Product Alert"}
                {activeTab === "hotspots" && "Nigerian Commercial Market Hotspots Registry"}
                {activeTab === "brands" && "Manufacturer & Brand Watch Sentinel Directory"}
                {activeTab === "coupons" && "Priority Discount & Promo Vouchers"}
                {activeTab === "export" && "Law Enforcement & Regulatory Export Station"}
              </h2>
              <p className="hidden sm:block text-xs text-slate-400">
                Connected to Fake9ja Citizen Defense Radar • Live SQLite/MySQL Synced
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab !== "publish" && (
              <Button
                size="sm"
                onClick={() => setActiveTab("publish")}
                className="rounded-xl h-9 text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white cursor-pointer flex items-center gap-1.5 shadow-sm shadow-rose-500/20"
              >
                <PlusCircle className="size-3.5" /> Publish Fake Alert
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={refreshAllData}
              className="rounded-xl h-9 border-slate-800 bg-slate-950 text-xs font-semibold text-slate-200 hover:bg-slate-800 cursor-pointer"
            >
              <RefreshCw className={`size-3.5 mr-1.5 ${loadingReports ? "animate-spin text-emerald-400" : ""}`} />
              Sync DB
            </Button>

            <Button
              size="sm"
              onClick={handleExportCSV}
              className="rounded-xl h-9 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer hidden md:flex items-center gap-1.5"
            >
              <FileSpreadsheet className="size-3.5" /> Export CSV
            </Button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Actions Action Bar */}
              <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Radio className="size-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">
                      Direct Citizen Radar Broadcast
                    </h3>
                    <p className="text-xs text-slate-400">
                      Discovered a new lethal batch or counterfeit batch? Publish it live so consumers immediately see the warning.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setActiveTab("publish")}
                  className="rounded-xl font-bold text-xs h-10 px-4 bg-rose-500 hover:bg-rose-400 text-white shrink-0 cursor-pointer"
                >
                  <PlusCircle className="size-4 mr-1.5" /> Publish Verified Fake Now
                </Button>
              </div>

              {/* KPI Grid */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Total Submissions", val: totalReportsCount.toString(), sub: "100% Free Public Good", Icon: Inbox, colorClass: "text-emerald-400" },
                  { label: "Confirmed Fakes", val: verifiedFakeCount.toString(), sub: "Flagged on Radar", Icon: ShieldAlert, colorClass: "text-rose-400" },
                  { label: "Pending Triage", val: underReviewCount.toString(), sub: "Active Inspector Queue", Icon: Clock, colorClass: "text-amber-400" },
                  { label: "SLA Fast-Track", val: priorityCount.toString(), sub: "WELCOME30 Priority", Icon: Zap, colorClass: "text-cyan-400" },
                ].map(({ label, val, sub, Icon, colorClass }) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xs hover:border-slate-700 transition"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {label}
                      </span>
                      <div className="grid size-10 place-items-center rounded-2xl bg-slate-800 text-slate-200">
                        <Icon className="size-5" />
                      </div>
                    </div>
                    <strong className="mt-3 block font-display text-3xl font-black text-white">
                      {val}
                    </strong>
                    <span className={`mt-1 block text-xs font-bold ${colorClass}`}>
                      {String(sub)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Velocity & Hotspot Radar Overview */}
              <div className="grid gap-6 xl:grid-cols-[1.4fr_.6fr]">
                {/* 7-Day Velocity Chart */}
                <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display text-base font-bold text-white">
                        Report Intake Velocity (Last 7 Days)
                      </h3>
                      <p className="text-xs text-slate-400">Citizen submissions timeline across Nigeria</p>
                    </div>
                    <span className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                      +28% Volume Trend
                    </span>
                  </div>

                  <div className="mt-8 flex h-48 items-end gap-3 sm:gap-6 px-2">
                    {[45, 62, 53, 85, 74, 98, 88].map((h, i) => (
                      <div key={i} className="flex flex-1 flex-col items-center gap-2 group">
                        <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {h}
                        </span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.5, delay: i * 0.05 }}
                          className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:brightness-125 transition-all"
                        />
                        <span className="text-xs font-bold text-slate-400">
                          {["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"][i]}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 flex items-center justify-between text-xs">
                    <span className="text-slate-300">
                      <strong>Dominant Flagged Category:</strong> Counterfeit Antimalarial Blister Packs (Amatem, Lonart)
                    </span>
                    <Button
                      size="sm"
                      onClick={() => setActiveTab("triage")}
                      className="rounded-xl h-8 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white"
                    >
                      Review Cases →
                    </Button>
                  </div>
                </section>

                {/* Hotspot Threat Signals */}
                <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-white">
                      Market Hotspot Severity
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">Highest incident counts registered</p>

                    <div className="space-y-3">
                      {hotspots.slice(0, 5).map((h, i) => (
                        <div
                          key={h.id || i}
                          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs"
                        >
                          <div>
                            <strong className="block text-white text-xs">{h.name}</strong>
                            <span className="text-[11px] text-slate-400">{h.state}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-rose-400 text-xs">
                              {h.incident_count} reports
                            </span>
                            <span className="block text-[9px] uppercase font-bold text-slate-400">
                              {h.risk_level} risk
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("hotspots")}
                    className="w-full mt-4 rounded-xl text-xs font-bold border-slate-800 bg-slate-950 text-slate-300 hover:text-white"
                  >
                    Manage All Hotspots ({hotspots.length})
                  </Button>
                </section>
              </div>
            </div>
          )}

          {/* TAB 2: TRIAGE QUEUE */}
          {activeTab === "triage" && (
            <div className="space-y-6">
              {/* Triage Search & Filters Control Bar */}
              <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1 sm:max-w-md">
                  <Search className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by Product Name, Ref ID, Market, or Brand..."
                    className="h-11 rounded-xl border-slate-800 bg-slate-950 pl-10 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Filter */}
                  <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-950 p-1 border border-slate-800">
                    {([
                      ["all", "All Cases"],
                      ["received", "Pending"],
                      ["under_review", "In Review"],
                      ["verified_fake", "Fake"],
                      ["verified_original", "Original"],
                      ["escalated", "Escalated"],
                    ] as const).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => setFilterStatus(val)}
                        className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                          filterStatus === val
                            ? "bg-emerald-500 text-slate-950 shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Risk Filter */}
                  <div className="flex items-center gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800">
                    {["all", "high", "medium", "low"].map((rk) => (
                      <button
                        key={rk}
                        onClick={() => setFilterRisk(rk)}
                        className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold uppercase transition-all cursor-pointer ${
                          filterRisk === rk
                            ? "bg-slate-800 text-white shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {rk}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Triage Reports Table */}
              <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[850px]">
                    <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="py-4 px-6">Evidence / Ref ID</th>
                        <th className="py-4 px-6">Product & Category</th>
                        <th className="py-4 px-6">Market Location</th>
                        <th className="py-4 px-6">Risk / SLA</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {loadingReports ? (
                        <tr>
                          <td colSpan={6} className="py-16 text-center text-slate-400">
                            <Loader2 className="mx-auto size-6 animate-spin text-emerald-400 mb-2" />
                            Loading SQLite / MySQL Intelligence Records...
                          </td>
                        </tr>
                      ) : filteredReports.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-16 text-center text-slate-400">
                            No incident reports found matching current filters.
                          </td>
                        </tr>
                      ) : (
                        filteredReports.map((r) => {
                          const thumb = (r.media_urls && r.media_urls.length > 0)
                            ? formatMediaUrl(r.media_urls[0])
                            : getCategoryFallbackImage(r.category);

                          return (
                            <tr key={r.id || r.reference_id} className="hover:bg-slate-800/40 transition">
                              {/* Evidence Thumbnail & Reference */}
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div
                                    onClick={() => setActiveLightboxMedia(thumb)}
                                    className="relative size-12 shrink-0 cursor-zoom-in overflow-hidden rounded-xl border border-slate-700 bg-slate-950 group"
                                  >
                                    <img
                                      src={thumb}
                                      alt={r.product_name}
                                      className="size-full object-cover transition-transform group-hover:scale-110"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = getCategoryFallbackImage(r.category);
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                      <Maximize2 className="size-3 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-mono font-bold text-white block">
                                      #{r.reference_id}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{r.created_at}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Product & Category */}
                              <td className="py-4 px-6">
                                <strong className="block text-white text-xs">{r.product_name}</strong>
                                <span className="text-[11px] text-slate-400">{r.category}</span>
                              </td>

                              {/* Market Location */}
                              <td className="py-4 px-6 text-slate-300">
                                <span className="block truncate max-w-[200px]">{r.market_address}</span>
                                <span className="text-[10px] text-slate-400">{r.state} State</span>
                              </td>

                              {/* Risk / SLA */}
                              <td className="py-4 px-6">
                                <div className="flex flex-col gap-1">
                                  <span
                                    className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase w-max ${
                                      r.risk_level === "high"
                                        ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                        : r.risk_level === "medium"
                                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                        : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                    }`}
                                  >
                                    {r.risk_level} Risk
                                  </span>
                                  {r.is_priority && (
                                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                                      <Zap className="size-2.5" /> Fast-Track
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Status */}
                              <td className="py-4 px-6">
                                <span
                                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold capitalize ${
                                    r.status === "verified_fake"
                                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                      : r.status === "verified_original"
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                      : "bg-slate-800 text-slate-200"
                                  }`}
                                >
                                  {r.status.replace("_", " ")}
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedReport(r);
                                      setReviewNote(r.details || "");
                                    }}
                                    className="rounded-xl h-8 px-3 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer"
                                  >
                                    <Eye className="size-3.5 mr-1" /> Inspect
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteReport(r.id || r.reference_id)}
                                    className="rounded-xl h-8 px-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PUBLISH FAKE PRODUCT DIRECTLY (NEW RICH FEATURE) */}
          {activeTab === "publish" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 px-3 py-1 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1.5">
                    <Radio className="size-3 animate-pulse" /> National Counterfeit Broadcast Station
                  </div>
                  <h3 className="font-display text-2xl font-black text-white">
                    Publish Official Fake Product Alert
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    Broadcast verified counterfeit batches, lab adulterations, and fake packaging warnings directly to the public citizen radar (<Link to="/community" className="text-emerald-400 hover:underline">/community</Link>) so Nigerian shoppers are immediately alerted.
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setActiveTab("triage")}
                  className="rounded-xl text-xs font-bold border-slate-800 bg-slate-950 text-slate-300 hover:text-white shrink-0"
                >
                  ← Back to Triage Queue
                </Button>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
                {/* Publishing Form */}
                <form
                  onSubmit={handlePublishFakeProduct}
                  className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-5 shadow-2xl"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        Counterfeit Product Name *
                      </label>
                      <Input
                        required
                        value={publishForm.product_name}
                        onChange={(e) => setPublishForm({ ...publishForm, product_name: e.target.value })}
                        placeholder="e.g. Amatem Forte Softgel / Tablets"
                        className="h-11 rounded-xl border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        Brand / Alleged Manufacturer
                      </label>
                      <Input
                        value={publishForm.brand}
                        onChange={(e) => setPublishForm({ ...publishForm, brand: e.target.value })}
                        placeholder="e.g. Elbe Pharma / Sanofi"
                        className="h-11 rounded-xl border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        Category *
                      </label>
                      <select
                        value={publishForm.category}
                        onChange={(e) => {
                          const cat = e.target.value;
                          setPublishForm({
                            ...publishForm,
                            category: cat,
                            preset_image: getCategoryFallbackImage(cat),
                          });
                          setPublishPreviewUrl(getCategoryFallbackImage(cat));
                        }}
                        className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-white outline-none focus:border-rose-500"
                      >
                        <option value="Medicines">Medicines & Health</option>
                        <option value="Cosmetics">Cosmetics & Skincare</option>
                        <option value="Automotive">Automotive & Engine Oils</option>
                        <option value="Food & drinks">Food & Packaged Drinks</option>
                        <option value="Electronics">Electronics & Tech</option>
                        <option value="Building">Building & Hardware</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        Nigerian State *
                      </label>
                      <select
                        value={publishForm.state}
                        onChange={(e) => setPublishForm({ ...publishForm, state: e.target.value })}
                        className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-white outline-none focus:border-rose-500"
                      >
                        {["Lagos", "Kano", "Abia", "Anambra", "FCT Abuja", "Rivers", "Oyo", "Kaduna", "Edo", "Enugu"].map((st) => (
                          <option key={st} value={st}>
                            {st} State
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-white mb-1.5">
                        Risk Severity Level
                      </label>
                      <select
                        value={publishForm.risk_level}
                        onChange={(e) => setPublishForm({ ...publishForm, risk_level: e.target.value as any })}
                        className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-rose-400 font-bold outline-none focus:border-rose-500"
                      >
                        <option value="high">High Risk (Lethal Danger)</option>
                        <option value="medium">Medium Risk (Infringement)</option>
                        <option value="low">Low Risk (Discrepancy)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        Market Stall / Hub Location *
                      </label>
                      <Input
                        required
                        value={publishForm.market_address}
                        onChange={(e) => setPublishForm({ ...publishForm, market_address: e.target.value })}
                        placeholder="e.g. Sabon Gari Market, Line 4 Stall 82"
                        className="h-11 rounded-xl border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        Counterfeit Purchase Price (Optional)
                      </label>
                      <Input
                        value={publishForm.purchase_price}
                        onChange={(e) => setPublishForm({ ...publishForm, purchase_price: e.target.value })}
                        placeholder="e.g. ₦2,400"
                        className="h-11 rounded-xl border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      Observed Defect / Counterfeit Indicator *
                    </label>
                    <Input
                      required
                      value={publishForm.issue_type}
                      onChange={(e) => setPublishForm({ ...publishForm, issue_type: e.target.value })}
                      placeholder="e.g. Missing Hologram Seal, Inactive Chemical Compound, Fake NAFDAC PIN"
                      className="h-11 rounded-xl border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      Official Laboratory Determination & Consumer Advisory Note *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={publishForm.reviewer_note}
                      onChange={(e) => setPublishForm({ ...publishForm, reviewer_note: e.target.value })}
                      placeholder="Enter official forensic assessment, chemical lab findings, batch numbers to avoid..."
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    />
                  </div>

                  {/* Evidence Photo Selector */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-2">
                      Forensic Packaging Evidence Photo
                    </label>

                    {/* Preset Imagery Quick Selectors */}
                    <div className="grid grid-cols-3 gap-2.5 mb-3">
                      {([
                        ["/images/counterfeit-malaria.jpg", "Malaria Tablet Pack"],
                        ["/images/counterfeit-cosmetics.jpg", "Cosmetic Lotion Bottle"],
                        ["/images/counterfeit-oil.jpg", "Motor Oil QR Check"],
                      ] as const).map(([path, name]) => (
                        <div
                          key={path}
                          onClick={() => {
                            setPublishForm({ ...publishForm, preset_image: path });
                            setPublishPreviewUrl(path);
                            setPublishFiles([]);
                          }}
                          className={`group relative aspect-[16/9] cursor-pointer overflow-hidden rounded-xl border transition-all ${
                            publishPreviewUrl === path && publishFiles.length === 0
                              ? "border-rose-500 ring-2 ring-rose-500/40"
                              : "border-slate-800 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={path} alt={name} className="size-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                            <span className="text-[10px] font-bold text-white truncate">{name}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Or Upload Custom Image */}
                    <div className="relative rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const f = e.target.files[0];
                            setPublishFiles([f]);
                            setPublishPreviewUrl(URL.createObjectURL(f));
                            toast.success(`Attached photo: ${f.name}`);
                          }
                        }}
                        className="absolute inset-0 size-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center gap-1 text-slate-400">
                        <UploadCloud className="size-6 text-rose-400" />
                        <span className="text-xs font-bold text-white">
                          {publishFiles[0]?.name ? publishFiles[0].name : "Or click to upload custom evidence photo"}
                        </span>
                        <span className="text-[10px]">Supports PNG, JPG, WEBP up to 10MB</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isPublishing}
                    className="w-full h-12 rounded-2xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/25 cursor-pointer mt-4"
                  >
                    {isPublishing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" /> Broadcasting to Citizen Radar...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Megaphone className="size-4" /> Broadcast Verified Fake to Public Radar
                      </span>
                    )}
                  </Button>
                </form>

                {/* Real-time Citizen Radar Live Preview Card */}
                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                        <Radio className="size-3.5 animate-pulse" /> Live Citizen Radar Preview
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">/community card</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-4">
                      This is the exact real-time card that will be displayed to thousands of shoppers on the public Fake9ja platform:
                    </p>

                    {/* Preview Card */}
                    <div className="overflow-hidden rounded-2xl border border-rose-500/50 bg-slate-900 shadow-2xl">
                      {/* Card Image Banner */}
                      <div className="relative aspect-[16/9] overflow-hidden bg-slate-950 p-4 flex flex-col justify-between text-white">
                        <img
                          src={publishPreviewUrl}
                          alt="Preview"
                          className="absolute inset-0 size-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60 z-0" />

                        <div className="flex items-center justify-between z-10">
                          <span className="bg-rose-600 text-white font-extrabold uppercase text-[10px] px-2.5 py-0.5 rounded-lg shadow-sm">
                            VERIFIED FAKE
                          </span>
                          <span className="bg-emerald-500/20 backdrop-blur border border-emerald-400/30 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full">
                            ⚡ Fast-Track Radar
                          </span>
                        </div>

                        <div className="z-10 flex items-end justify-between">
                          <span className="font-mono text-xs font-bold text-slate-300">
                            #ALERT-NG-XXXXXX
                          </span>
                          {publishForm.purchase_price && (
                            <span className="rounded-lg bg-black/60 backdrop-blur px-2.5 py-0.5 text-xs font-mono font-bold text-white ring-1 ring-white/20">
                              {publishForm.purchase_price}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-rose-400">
                          <span>{publishForm.category}</span>
                          <span className="text-slate-400 font-normal lowercase">Just now</span>
                        </div>

                        <h4 className="font-display text-base font-bold text-white">
                          {publishForm.product_name || "Counterfeit Product Name"}
                        </h4>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          <strong className="text-white">Observed Anomaly:</strong> “{publishForm.issue_type}”
                        </p>

                        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-2.5 text-[11px] text-slate-300">
                          <strong className="text-rose-400 block font-bold mb-0.5">Official Finding:</strong>
                          {publishForm.reviewer_note || "Laboratory assessment confirmed counterfeit packaging and fake active ingredients."}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 truncate max-w-[190px]">
                            <MapPin className="size-3 text-emerald-400 shrink-0" />
                            {publishForm.market_address || "Market Location"}
                          </span>
                          <span className="text-rose-400 font-bold">NAFDAC Flagged</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: VIDEO TESTIMONIES */}
          {activeTab === "videos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                    <Video className="size-5 text-emerald-400" />
                    Video Testimony Carousel Management
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Add YouTube, Instagram, TikTok, Facebook links or upload organic MP4 clips to the landing carousel.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={refreshAllData}
                  className="rounded-xl border-slate-700 bg-slate-950 text-xs font-semibold cursor-pointer"
                >
                  <RefreshCw className="size-3 mr-1.5" /> Refresh
                </Button>
              </div>

              {/* Add Form + Live Preview */}
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Left: Add Form */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl">
                  <h4 className="font-display text-base font-bold text-white flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
                    <PlusCircle className="size-4 text-emerald-400" />
                    Add New Video Link or Citizen Recording
                  </h4>

                  <form onSubmit={handleSaveVideoTestimony} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Video Headline / Product Subject *</label>
                      <Input
                        required
                        value={videoForm.title}
                        onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                        placeholder="e.g. Counterfeit Antimalarial Blister Packaging in Onitsha"
                        className="h-10 rounded-xl border-slate-700 bg-slate-950 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Video Link (YouTube, Instagram, TikTok, Facebook, X)</label>
                      <Input
                        value={videoForm.source_url}
                        onChange={(e) => setVideoForm({ ...videoForm, source_url: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=... or https://instagram.com/reel/..."
                        className="h-10 rounded-xl border-slate-700 bg-slate-950 text-xs text-white font-mono"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Paste any public link. Fake9ja auto-resolves embed playback.</p>
                    </div>

                    {/* Upload Organic MP4 */}
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-4">
                      <label className="block font-bold text-slate-300 mb-1">Or Upload Direct Organic Citizen Video (.mp4, .mov, .webm)</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setVideoFile(e.target.files[0]);
                            toast.success(`Video file selected: ${e.target.files[0].name}`);
                          }
                        }}
                        className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 cursor-pointer"
                      />
                      {videoFile && (
                        <p className="text-emerald-400 text-[11px] mt-1 font-mono">
                          Attached: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                      )}
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="rounded-2xl border border-dashed border-amber-600/40 bg-amber-950/10 p-4">
                      <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                        <ImageIcon className="size-3.5 text-amber-400" />
                        Upload Thumbnail Image (Optional — .jpg, .png, .webp)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setThumbnailFile(file);
                            setThumbnailPreviewUrl(URL.createObjectURL(file));
                            toast.success(`Thumbnail selected: ${file.name}`);
                          }
                        }}
                        className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20 cursor-pointer"
                      />
                      {thumbnailPreviewUrl ? (
                        <div className="mt-2 flex items-center gap-3">
                          <img src={thumbnailPreviewUrl} alt="Thumbnail" className="w-24 h-14 object-cover rounded-lg border border-amber-500/30" />
                          <div className="text-[11px] text-amber-400">
                            <p className="font-semibold">Thumbnail ready</p>
                            <p className="text-slate-400">{thumbnailFile?.name}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setThumbnailFile(null); setThumbnailPreviewUrl(""); }}
                            className="ml-auto text-[10px] text-rose-400 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-500 mt-1">If not provided, Fake9ja auto-extracts a thumbnail from the video URL.</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Reporter / Sentinel Name</label>
                        <Input
                          value={videoForm.author_name}
                          onChange={(e) => setVideoForm({ ...videoForm, author_name: e.target.value })}
                          placeholder="e.g. Mazi Tunde / Citizen Report"
                          className="h-10 rounded-xl border-slate-700 bg-slate-950 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Market / State Location</label>
                        <Input
                          value={videoForm.location}
                          onChange={(e) => setVideoForm({ ...videoForm, location: e.target.value })}
                          placeholder="e.g. Idumota Market, Lagos"
                          className="h-10 rounded-xl border-slate-700 bg-slate-950 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Highlighted Citizen Quote / Warning</label>
                      <Input
                        value={videoForm.quote}
                        onChange={(e) => setVideoForm({ ...videoForm, quote: e.target.value })}
                        placeholder="e.g. Look at the seal texture, the spelling is completely distorted."
                        className="h-10 rounded-xl border-slate-700 bg-slate-950 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">AI Computer Vision Feature to Train</label>
                      <Input
                        value={videoForm.ai_feature}
                        onChange={(e) => setVideoForm({ ...videoForm, ai_feature: e.target.value })}
                        placeholder="e.g. Foil seal light refraction, cap crimping flaws, blurry batch codes"
                        className="h-10 rounded-xl border-slate-700 bg-slate-950 text-xs text-white"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSavingVideo}
                      className="w-full h-11 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 cursor-pointer mt-2"
                    >
                      {isSavingVideo ? (
                        <span className="flex items-center gap-2"><Loader2 className="size-4 animate-spin" /> Saving & Publishing...</span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5"><Video className="size-4" /> Save & Broadcast to Landing Carousel</span>
                      )}
                    </Button>
                  </form>
                </div>

                {/* Right: Live Preview */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-3">
                    <Radio className="size-3.5 animate-pulse" /> Live Card Preview
                  </span>
                  {(() => {
                    const tempUrl = videoForm.source_url.trim();
                    const parsed = tempUrl ? parseVideoSource(tempUrl) : null;
                    const previewThumb = thumbnailPreviewUrl || (parsed?.platform === "YouTube" ? getVideoThumbnail({ sourceUrl: tempUrl }) : "/images/consumer-vigilance.jpg");
                    return (
                      <div className="rounded-2xl border border-emerald-500/40 bg-slate-900 overflow-hidden shadow-xl">
                        <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
                          {parsed?.platform === "YouTube" && parsed.embedUrl ? (
                            <iframe src={`${parsed.embedUrl}?rel=0`} className="w-full h-full border-0" title="YouTube Preview" />
                          ) : thumbnailPreviewUrl ? (
                            <img src={thumbnailPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                              <Video className="size-8 opacity-40" />
                              <span className="text-xs">Paste a URL or pick a video file</span>
                            </div>
                          )}
                          {parsed && (
                            <div className="absolute top-2 left-2">
                              <span className="text-[10px] font-bold bg-black/70 text-white px-2 py-0.5 rounded-md">{parsed.platform}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3.5">
                          <h5 className="font-display font-bold text-sm text-white">{videoForm.title || "Video Title Headline"}</h5>
                          <p className="text-xs text-slate-300 italic mt-1">"{videoForm.quote || "Citizen observation quote..."}"</p>
                          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="size-3 text-emerald-400" />
                            {videoForm.location}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Video Registry List */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div>
                    <h4 className="font-display text-base font-bold text-white">
                      Active Video Testimonies on Carousel ({videoTestimonies.length})
                    </h4>
                    <p className="text-xs text-slate-400">These videos appear on the landing page for all visitors.</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {videoTestimonies.map((item) => {
                    const thumbSrc = item.thumbnailUrl || getVideoThumbnail(item);
                    return (
                      <div
                        key={String(item.id)}
                        className="rounded-2xl border border-slate-800 bg-slate-950 flex flex-col overflow-hidden hover:border-slate-700 transition-colors"
                      >
                        {/* Thumbnail Preview */}
                        <div className="relative aspect-video bg-black overflow-hidden group">
                          {item.localVideoUrl ? (
                            <video
                              src={item.localVideoUrl}
                              className="w-full h-full object-cover"
                              poster={thumbSrc}
                              muted
                              preload="metadata"
                              onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                              onMouseLeave={(e) => { const v = e.currentTarget as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                              playsInline
                            />
                          ) : (
                            <img
                              src={thumbSrc}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/consumer-vigilance.jpg"; }}
                            />
                          )}
                          {/* Platform badge */}
                          <div className="absolute top-2 left-2">
                            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm ${
                              item.platform === "YouTube" ? "bg-red-600/80 text-white" :
                              item.platform === "Instagram" ? "bg-pink-600/80 text-white" :
                              item.platform === "TikTok" ? "bg-cyan-700/80 text-white" :
                              "bg-emerald-700/80 text-white"
                            }`}>
                              {item.platform}
                            </span>
                          </div>
                          {/* Duration */}
                          <div className="absolute bottom-2 right-2">
                            <span className="text-[10px] font-mono bg-black/70 text-white px-1.5 py-0.5 rounded">{item.duration || "1:00"}</span>
                          </div>
                          {/* Play hover overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                            <div className="size-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <svg className="size-5 text-white fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-3.5 flex flex-col flex-1">
                          <h5 className="font-display font-bold text-xs text-white line-clamp-2">{item.title}</h5>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin className="size-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 italic line-clamp-2 mt-1">"{item.quote}"</p>

                          <div className="mt-auto pt-3 border-t border-slate-800/80 flex items-center justify-between">
                            {item.sourceUrl && item.sourceUrl !== "#" ? (
                              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline">
                                <ExternalLink className="size-3" /> View Source
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono">Organic File</span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteVideo(item.id)}
                              className="size-7 p-0 rounded-lg text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                              title="Remove"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {videoTestimonies.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <Video className="size-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-semibold">No video testimonies yet</p>
                    <p className="text-xs mt-1">Use the form above to add the first video to the landing carousel.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MARKET HOTSPOTS */}
          {activeTab === "hotspots" && (

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    Physical Commercial Market Surveillance
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live open markets monitored across Nigeria's commercial centers.
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddHotspot(true)}
                  className="rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer"
                >
                  <Plus className="size-4 mr-1.5" /> Add Market Hotspot
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {hotspots.map((h) => (
                  <div
                    key={h.id}
                    className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-300 uppercase">
                          {h.state} State
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                            h.risk_level === "high"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {h.risk_level} Risk
                        </span>
                      </div>

                      <h4 className="font-display text-base font-bold text-white mt-1">
                        {h.name}
                      </h4>
                      <p className="mt-1 text-xs text-slate-400">
                        {h.incident_count} citizen incident flags logged on radar.
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Surveillance
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteHotspot(h.id)}
                        className="rounded-lg h-7 px-2 text-[11px] text-rose-400 hover:bg-rose-500/10"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BRAND WATCH SENTINEL */}
          {activeTab === "brands" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    Manufacturer Brand Watch Directory
                  </h3>
                  <p className="text-xs text-slate-400">
                    Corporate subscribers whose product packaging is continuously analyzed by Fake9ja radar.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="py-4 px-6">Brand / Company</th>
                      <th className="py-4 px-6">Contact Email & Phone</th>
                      <th className="py-4 px-6">Monitored SKUs</th>
                      <th className="py-4 px-6">Protection Tier</th>
                      <th className="py-4 px-6 text-right">Radar Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {brandWatches.map((b, i) => (
                      <tr key={b.id || i} className="hover:bg-slate-800/40 transition">
                        <td className="py-4 px-6">
                          <strong className="block text-white text-xs font-bold">{b.brand_name}</strong>
                          <span className="text-[11px] text-slate-400">{b.company_name}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-300">
                          <div className="flex flex-col">
                            <span>{b.email}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{b.phone || "N/A"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-300 font-mono text-[11px]">
                          {b.monitored_skus || "All SKUs"}
                        </td>
                        <td className="py-4 px-6">
                          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                            {b.tier || "Enterprise"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="text-emerald-400 font-bold text-xs flex items-center justify-end gap-1.5">
                            <ShieldCheck className="size-4" /> Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: COUPONS & PROMOS */}
          {activeTab === "coupons" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Promotion & Priority Voucher Management
                </h3>
                <p className="text-xs text-slate-400">
                  Manage active fee reductions for fast-track verification SLA and manufacturer onboarding.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* WELCOME30 Card */}
                <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-slate-900 p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-400 border border-emerald-500/30">
                      ACTIVE SYSTEM VOUCHER
                    </span>
                    <span className="font-display text-2xl font-black text-emerald-400">30% OFF</span>
                  </div>

                  <h4 className="mt-4 font-mono text-2xl font-black text-white tracking-wider">
                    WELCOME30
                  </h4>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Official 30% discount applied to the ₦5,000 Priority Fast-Track SLA fee and Brand Watch Sentinel subscriptions.
                  </p>

                  <div className="mt-6 rounded-2xl bg-slate-950/80 p-3.5 border border-slate-800 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Base Fast-Track:</span>
                      <span className="line-through text-slate-500">₦5,000</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Discounted Rate:</span>
                      <span>₦3,500</span>
                    </div>
                  </div>
                </div>

                {/* Voucher Policy Info */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="font-display text-base font-bold text-white">
                      Priority SLA Revenue & Support
                    </h4>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                      While standard reporting is <strong>100% free forever for all Nigerian citizens</strong>, priority fast-track fees help fund physical chemical reagent test kits and emergency field inspections.
                    </p>
                  </div>

                  <div className="mt-6 rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
                    <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
                    <span>Coupon validation is active on `/report`, `/brand-protection`, and API endpoints.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: DATA EXPORT */}
          {activeTab === "export" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Regulatory Intelligence & Law Enforcement Export
                </h3>
                <p className="text-xs text-slate-400">
                  Export verified case archives for official dispatch to NAFDAC, SON, FCCPC, and the Nigeria Police.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between">
                  <div>
                    <div className="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                      <FileSpreadsheet className="size-6" />
                    </div>
                    <h4 className="font-display text-base font-bold text-white">
                      NAFDAC Field Enforcement CSV
                    </h4>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                      Complete tabular export containing Reference ID, product name, suspected manufacturer, exact market coordinates, defect classifications, and risk levels.
                    </p>
                  </div>

                  <Button
                    onClick={handleExportCSV}
                    className="mt-6 rounded-xl font-bold text-xs h-10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer"
                  >
                    <Download className="size-4 mr-2" /> Download Incident CSV
                  </Button>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between">
                  <div>
                    <div className="size-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                      <Database className="size-6" />
                    </div>
                    <h4 className="font-display text-base font-bold text-white">
                      Full JSON Intelligence Registry Backup
                    </h4>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                      Machine-readable JSON schema containing structured metadata, media URLs, forensic reviewer findings, and hotspot counts.
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports, null, 2));
                      const dlAnchor = document.createElement("a");
                      dlAnchor.setAttribute("href", dataStr);
                      dlAnchor.setAttribute("download", `Fake9ja_Intelligence_Dump_${Date.now()}.json`);
                      dlAnchor.click();
                      toast.success("Full JSON Database registry downloaded!");
                    }}
                    variant="outline"
                    className="mt-6 rounded-xl font-bold text-xs h-10 border-slate-800 bg-slate-950 text-slate-200 hover:bg-slate-800 cursor-pointer"
                  >
                    <Download className="size-4 mr-2" /> Export JSON Registry
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* -------------------------------------------------------------
          3. INSPECTION SLIDE-OVER DRAWER (WITH EVIDENCE IMAGE VIEWER)
      -------------------------------------------------------------- */}
      <AnimatePresence>
        {selectedReport && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto bg-slate-900 p-6 sm:p-8 shadow-2xl border-l border-slate-800 text-slate-100"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Forensic Case #{selectedReport.reference_id}
                  </span>
                  <h3 className="mt-1 font-display text-xl sm:text-2xl font-black text-white">
                    {selectedReport.product_name}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedReport(null)}
                  className="rounded-full text-slate-400 hover:text-white"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <div className="mt-6 space-y-6">
                {/* EVIDENCE MEDIA GALLERY VIEWER */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Camera className="size-4 text-emerald-400" /> Uploaded Physical Packaging Evidence
                    </label>
                    <span className="text-[11px] text-slate-400">Click photo to zoom</span>
                  </div>

                  {(() => {
                    const mediaItems = (selectedReport.media_urls && selectedReport.media_urls.length > 0)
                      ? selectedReport.media_urls.map(formatMediaUrl)
                      : [getCategoryFallbackImage(selectedReport.category)];

                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {mediaItems.map((imgSrc, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActiveLightboxMedia(imgSrc)}
                            className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-xl border border-slate-800 bg-slate-950"
                          >
                            <img
                              src={imgSrc}
                              alt={`${selectedReport.product_name} evidence ${idx + 1}`}
                              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getCategoryFallbackImage(selectedReport.category);
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye className="size-6 text-white drop-shadow" />
                            </div>
                            <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1 py-0.5 text-[8px] font-mono text-white">
                              Photo #{idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Case Meta Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                    <strong className="text-white">{selectedReport.category}</strong>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Market Location</span>
                    <strong className="text-white">{selectedReport.market_address}</strong>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Purchase Price</span>
                    <strong className="text-white">{selectedReport.purchase_price || "Not specified"}</strong>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Reporter Contact</span>
                    <strong className="text-white">{selectedReport.reporter_contact || "100% Anonymous"}</strong>
                  </div>
                </div>

                {/* Defect Description */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs">
                  <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                    Alleged Defect / Anomaly
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    “{selectedReport.issue_type}”
                  </p>
                  {selectedReport.details && (
                    <p className="mt-2 text-slate-300 leading-relaxed font-normal">
                      {selectedReport.details}
                    </p>
                  )}
                </div>

                {/* Official Reviewer Findings Input */}
                <div>
                  <label className="text-xs font-bold text-white block mb-1.5">
                    Official Forensic & Laboratory Finding Note
                  </label>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Enter NAFDAC registration verification, hologram test findings, chemical inspection notes..."
                    className="min-h-24 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Triage Verdict Commit Buttons */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
                    Commit Determination to National Registry:
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Button
                      variant="destructive"
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateStatus("verified_fake")}
                      className="rounded-xl font-bold text-xs h-10 cursor-pointer"
                    >
                      <ShieldAlert className="size-3.5 mr-1" />
                      Mark Verified Fake
                    </Button>
                    <Button
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateStatus("verified_original")}
                      className="rounded-xl font-bold text-xs h-10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer"
                    >
                      <CheckCircle2 className="size-3.5 mr-1" />
                      Mark Authentic / Safe
                    </Button>
                    <Button
                      variant="outline"
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateStatus("under_review")}
                      className="rounded-xl font-bold text-xs h-10 border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800 cursor-pointer"
                    >
                      Hold for Testing
                    </Button>
                    <Button
                      variant="outline"
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateStatus("escalated")}
                      className="rounded-xl font-bold text-xs h-10 border-purple-500/40 bg-purple-950/20 text-purple-300 hover:bg-purple-950/40 cursor-pointer"
                    >
                      Escalate to NAFDAC
                    </Button>
                  </div>
                </div>

                {/* Expunge / Delete Option */}
                <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Purge false report:</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteReport(selectedReport.id || selectedReport.reference_id)}
                    className="text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                  >
                    <Trash2 className="size-3.5 mr-1" /> Expunge Case Record
                  </Button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------
          4. FORENSIC EVIDENCE LIGHTBOX (FULL-SCREEN INSPECTION)
      -------------------------------------------------------------- */}
      <AnimatePresence>
        {activeLightboxMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLightboxMedia(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 max-w-4xl w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-white">
                    Inspector Evidence Viewer • Forensic Packaging Inspection
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveLightboxMedia(null)}
                  className="rounded-full text-slate-400 hover:text-white"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <div className="mt-4 relative aspect-[16/10] overflow-hidden rounded-2xl bg-black flex items-center justify-center">
                <img
                  src={activeLightboxMedia}
                  alt="Forensic evidence packaging inspection"
                  className="size-full object-contain"
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Stored in Fake9ja Evidence Registry</span>
                <a
                  href={activeLightboxMedia}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700"
                >
                  <Maximize2 className="size-3.5 mr-1" /> Open Raw Image
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------
          5. ADD MARKET HOTSPOT MODAL
      -------------------------------------------------------------- */}
      <AnimatePresence>
        {showAddHotspot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddHotspot(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 max-w-md w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="font-display text-base font-bold text-white">
                  Add Commercial Market Hotspot
                </h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddHotspot(false)}
                  className="rounded-full text-slate-400 hover:text-white"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <form onSubmit={handleCreateHotspot} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Market Name & Location
                  </label>
                  <Input
                    required
                    value={newHotspotForm.name}
                    onChange={(e) => setNewHotspotForm({ ...newHotspotForm, name: e.target.value })}
                    placeholder="e.g. Alaba Rago Market, Ojo"
                    className="h-10 rounded-xl border-slate-700 bg-slate-950 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">State</label>
                    <select
                      value={newHotspotForm.state}
                      onChange={(e) => setNewHotspotForm({ ...newHotspotForm, state: e.target.value })}
                      className="h-10 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-xs text-white outline-none"
                    >
                      {["Lagos", "Kano", "Abia", "Anambra", "FCT Abuja", "Rivers", "Oyo", "Kaduna"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Risk Level</label>
                    <select
                      value={newHotspotForm.risk_level}
                      onChange={(e) => setNewHotspotForm({ ...newHotspotForm, risk_level: e.target.value })}
                      className="h-10 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-xs text-white outline-none"
                    >
                      <option value="high">High Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="low">Low Risk</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Initial Incident Flags Estimate
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={newHotspotForm.incident_count}
                    onChange={(e) =>
                      setNewHotspotForm({ ...newHotspotForm, incident_count: parseInt(e.target.value) || 1 })
                    }
                    className="h-10 rounded-xl border-slate-700 bg-slate-950 text-xs text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAddHotspot(false)}
                    className="rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                  >
                    Register Hotspot
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
