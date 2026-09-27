import { ShieldAlert } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 select-none group">
      <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-950 p-2 shadow-sm shadow-emerald-500/20 ring-1 ring-emerald-400/30 transition-transform duration-300 group-hover:scale-105">
        <ShieldAlert className="size-5 text-emerald-300 transition-transform duration-300 group-hover:rotate-6" />
        <span className="absolute -bottom-0.5 -right-0.5 flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500"></span>
        </span>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-base font-extrabold tracking-tight text-foreground">
              FAKE<span className="text-emerald-500">9JA</span>
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
              RADAR
            </span>
          </div>
          <span className="block text-[10px] font-medium text-muted-foreground">
            Citizen Anti-Fake Intelligence
          </span>
        </div>
      )}
    </div>
  );
}