import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Check,
  Copy,
  ExternalLink,
  Flame,
  Menu,
  Moon,
  Radar,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  Tag,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Fake9jaAPI } from "@/lib/api";
import { BrandMark } from "./brand-mark";

const nav = [
  { to: "/", label: "Home" },
  { to: "/community", label: "Incident Radar", badge: "Live" },
  { to: "/track", label: "Track Status" },
  { to: "/admin", label: "Review Desk" },
] as const;

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      window.localStorage.setItem("fake9ja-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      window.localStorage.setItem("fake9ja-theme", "light");
    }
  };

  return (
    <Button
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="rounded-xl cursor-pointer text-foreground hover:bg-secondary h-9 w-9 transition-colors"
    >
      {dark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-muted-foreground" />}
    </Button>
  );
}

// Brand & Manufacturer Data Portal Modal
export function BrandWatchModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [brand, setBrand] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tier, setTier] = useState<"starter" | "enterprise">("starter");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !email) {
      toast.error("Please enter your brand name and official email.");
      return;
    }
    setIsSubmitting(true);
    const res = await Fake9jaAPI.submitBrandWatch({
      brand_name: brand,
      company_name: company || brand,
      email,
      phone,
      tier,
    });
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success(res.message || "Brand verification data registered successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden rounded-2xl border-border bg-card p-0 shadow-2xl">
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 text-white">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <ShieldCheck className="size-4" /> Fake9ja Manufacturer Registry
          </div>
          <DialogTitle className="mt-2 font-display text-2xl font-bold text-white">
            Register Authentic Brand Data
          </DialogTitle>
          <DialogDescription className="mt-1 text-xs text-slate-300">
            Submit authentic barcode signatures and packaging designs to feed the AI model, helping train instant detection for cloned goods across Nigerian markets.
          </DialogDescription>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
            <Sparkles className="size-3 text-emerald-400" /> Feeding the National Anti-Adulteration AI Model
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30">
              <Check className="size-7" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">Brand Data Registered!</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              We received your brand details for <strong className="text-foreground">{brand}</strong>. Our anti-counterfeit AI training team will link your authentic packaging specifications with the national verification radar.
            </p>
            <Button
              className="mt-6 w-full rounded-xl font-bold"
              onClick={() => {
                setSubmitted(false);
                onOpenChange(false);
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setTier("starter")}
                className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                  tier === "starter"
                    ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/30"
                    : "border-border hover:border-border/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold">Standard Tier</strong>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Active</span>
                </div>
                <div className="mt-2 text-sm font-extrabold text-foreground">AI Packaging Scan</div>
                <p className="mt-1 text-[11px] text-muted-foreground">Up to 5 SKUs registered for neural vision matching</p>
              </div>

              <div
                onClick={() => setTier("enterprise")}
                className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                  tier === "enterprise"
                    ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/30"
                    : "border-border hover:border-border/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold">Enterprise Tier</strong>
                  <span className="text-[10px] font-semibold text-amber-500">36 States</span>
                </div>
                <div className="mt-2 text-sm font-extrabold text-foreground">Full Market Telemetry</div>
                <p className="mt-1 text-[11px] text-muted-foreground">Unlimited SKUs + Direct regulatory dossier dispatch</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Brand Name *</label>
                <Input
                  required
                  placeholder="e.g. Dangote, Amatem"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="mt-1 h-9 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Company / Manufacturer</label>
                <Input
                  placeholder="Official company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1 h-9 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Official Email *</label>
                <Input
                  required
                  type="email"
                  placeholder="brand@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 h-9 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
                <Input
                  placeholder="0803 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 h-9 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="rounded-xl bg-secondary/80 p-3 text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground block mb-0.5">Authenticity Dataset Agreement:</strong>
              By enrolling, you grant Fake9ja permission to index your official packaging barcodes and tamper marks solely to train open-source AI anti-adulteration models.
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl h-10 font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-sm shadow-emerald-600/30"
            >
              {isSubmitting ? "Registering Brand Data..." : "Enroll Brand into AI Verification Network"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [brandWatchOpen, setBrandWatchOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [path]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-500">
      {/* Top Mission Announcement Bar */}
      <div className="relative z-50 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-500/20 px-3 py-1.5 text-xs text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 sm:px-6">
          <div className="flex items-center gap-2 overflow-hidden text-[11px] sm:text-xs">
            <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="font-semibold text-emerald-300 shrink-0">Civic AI Initiative:</span>
            <span className="truncate text-slate-200">
              We are gathering nationwide data to train an AI model capable of solving <strong>80% of product adulteration</strong> in Nigeria.
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 shrink-0 text-[11px]">
            <button
              onClick={() => setBrandWatchOpen(true)}
              className="text-emerald-300 hover:text-white font-medium underline underline-offset-2 transition-colors cursor-pointer"
            >
              Brand Data Registry →
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Fake9ja Home" className="flex items-center">
            <BrandMark />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="relative rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground font-bold shadow-2xs" }}
              >
                <span className="flex items-center gap-1.5">
                  {item.label}
                  {"badge" in item && (
                    <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-extrabold text-emerald-500 uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </span>
              </Link>
            ))}

            <button
              onClick={() => setBrandWatchOpen(true)}
              className="rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-muted-foreground transition-all hover:bg-secondary hover:text-foreground cursor-pointer flex items-center gap-1.5"
            >
              <Building2 className="size-3.5 text-emerald-500" />
              Brand Registry
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              asChild
              className="rounded-xl font-bold text-xs h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-500/25 transition-all hover:shadow-md cursor-pointer"
            >
              <Link to="/report">
                <ShieldAlert className="size-3.5 mr-1" />
                Report a Fake
              </Link>
            </Button>
            <Button
              className="lg:hidden rounded-xl h-9 w-9 cursor-pointer"
              variant="ghost"
              size="icon"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation menu"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="border-t border-border bg-background px-4 py-4 lg:hidden shadow-xl"
            >
              <div className="flex flex-col gap-1.5">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
                    activeProps={{ className: "bg-secondary text-foreground font-bold" }}
                  >
                    <span>{item.label}</span>
                    {"badge" in item && (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}

                <button
                  onClick={() => {
                    setOpen(false);
                    setBrandWatchOpen(true);
                  }}
                  className="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="size-4 text-emerald-500" /> Brand Data Registry
                  </span>
                </button>

                <Button
                  asChild
                  className="mt-3 rounded-xl font-bold text-sm h-10 w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <Link to="/report">
                    <ShieldAlert className="size-4 mr-1.5" />
                    Contribute Fake Data Now
                  </Link>
                </Button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Brand Watch Modal */}
      <BrandWatchModal open={brandWatchOpen} onOpenChange={setBrandWatchOpen} />

      {/* Upgraded Footer */}
      <Footer onOpenBrandWatch={() => setBrandWatchOpen(true)} />
    </div>
  );
}

export function Footer({ onOpenBrandWatch }: { onOpenBrandWatch?: () => void }) {
  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur-md text-card-foreground pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <BrandMark />
            <p className="mt-3.5 max-w-md text-xs sm:text-sm leading-relaxed text-muted-foreground">
              <strong>Fake9ja</strong> is a citizen intelligence initiative gathering real-time counterfeit data across Nigerian markets. Every report feeds and refines our open AI model engineered to solve 80% of product adulteration in Nigeria.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
                <ShieldCheck className="size-3.5" /> 100% Whistleblower Anonymity
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-semibold text-muted-foreground">
                <Radar className="size-3.5" /> Real-time Market Signals
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">Platform</h4>
            <ul className="mt-3 space-y-2 text-xs font-medium text-muted-foreground">
              <li><Link to="/report" className="hover:text-emerald-500 transition-colors">Contribute Incident Data</Link></li>
              <li><Link to="/community" className="hover:text-emerald-500 transition-colors">Live Incident Radar</Link></li>
              <li><Link to="/track" className="hover:text-emerald-500 transition-colors">Track Reference ID</Link></li>
              <li><Link to="/admin" className="hover:text-emerald-500 transition-colors">AI Review Desk</Link></li>
              {onOpenBrandWatch && (
                <li>
                  <button onClick={onOpenBrandWatch} className="text-emerald-500 hover:underline font-semibold cursor-pointer">
                    Brand Data Registry
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">Mission & AI Vision</h4>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              We believe Nigerians have the power to solve product adulteration together. By crowdsourcing suspicious product barcodes, prices, and high-res imagery, we give regulators, retail stores, and citizens immediate verification capabilities.
            </p>
            <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-2.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Target: 80% reduction in adulterated goods through citizen-trained AI vision.
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Fake9ja Intelligence Network. All rights reserved.</div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span>Built by and for 200M+ Nigerians</span>
            <span>•</span>
            <span className="text-emerald-500 font-semibold">Stopping Adulteration Together</span>
          </div>
        </div>
      </div>
    </footer>
  );
}