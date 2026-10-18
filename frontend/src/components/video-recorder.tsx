import { motion } from "framer-motion";
import { Mic, Pause, Play, RotateCcw, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function VideoRecorder({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; onSave: () => void }) {
  const [phase, setPhase] = useState<"ready" | "countdown" | "recording" | "preview">("ready");
  const [count, setCount] = useState(3);
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (phase !== "countdown") return;
    if (count === 0) { setPhase("recording"); setSeconds(0); return; }
    const t = window.setTimeout(() => setCount((v) => v - 1), 700);
    return () => window.clearTimeout(t);
  }, [phase, count]);
  useEffect(() => {
    if (phase !== "recording" || paused) return;
    const t = window.setInterval(() => setSeconds((v) => v >= 59 ? 59 : v + 1), 1000);
    return () => window.clearInterval(t);
  }, [phase, paused]);
  const reset = () => { setPhase("ready"); setCount(3); setSeconds(0); setPaused(false); };
  return <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}><DialogContent className="max-h-[92vh] overflow-auto rounded-2xl border-border p-0 sm:max-w-2xl"><DialogHeader className="p-6 pb-0"><DialogTitle className="font-display text-2xl">Video complaint</DialogTitle><DialogDescription>Show the product, packaging and what made you suspicious.</DialogDescription></DialogHeader><div className="p-6"><div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-primary text-primary-foreground"><div className="absolute inset-0 hero-mesh opacity-20" /><div className="absolute left-4 top-4 rounded-full bg-background/15 px-3 py-1 text-xs font-bold backdrop-blur">{phase === "recording" ? `REC 00:${String(seconds).padStart(2,"0")}` : "CAMERA PREVIEW"}</div>{phase === "countdown" && <motion.strong key={count} initial={{ scale: .4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-display text-8xl">{count || "GO"}</motion.strong>}{phase === "ready" && <div className="max-w-sm px-8 text-center"><Mic className="mx-auto mb-4 size-10 text-accent"/><p className="text-lg font-bold">“Show the label and tell us where you bought it.”</p></div>}{phase === "recording" && <div className="flex h-24 items-end gap-1">{Array.from({length: 24},(_,i)=><motion.span key={i} className="w-1 rounded-full bg-accent" animate={{height:[12, 24+(i%7)*7, 12]}} transition={{duration:.55,repeat:Infinity,delay:i*.04}} />)}</div>}{phase === "preview" && <div className="text-center"><Play className="mx-auto size-16 fill-current"/><p className="mt-3 font-bold">Your 00:{String(seconds).padStart(2,"0")} complaint is ready</p></div>}<svg className="absolute bottom-3 right-3 size-20 -rotate-90" viewBox="0 0 36 36"><path d="M18 2.1a15.9 15.9 0 1 1 0 31.8 15.9 15.9 0 1 1 0-31.8" fill="none" className="stroke-primary-foreground/20" strokeWidth="2"/><path d="M18 2.1a15.9 15.9 0 1 1 0 31.8 15.9 15.9 0 1 1 0-31.8" fill="none" className="stroke-accent" strokeWidth="2" strokeDasharray={`${seconds * 1.67},100`}/></svg></div>{phase === "preview" && <div className="mt-5"><div className="relative h-12 rounded-lg bg-secondary"><div className="absolute inset-x-5 top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary/25"/><span className="absolute left-4 top-2 h-8 w-1 rounded-full bg-accent"/><span className="absolute right-4 top-2 h-8 w-1 rounded-full bg-accent"/></div><p className="mt-2 text-xs text-muted-foreground">Drag handles to trim your clip</p></div>}<div className="mt-6 flex flex-wrap justify-center gap-3">{phase === "ready" && <Button size="lg" onClick={() => setPhase("countdown")}><span className="size-3 rounded-full bg-destructive"/>Start recording</Button>}{phase === "recording" && <><Button variant="outline" size="icon" onClick={()=>setPaused(!paused)} aria-label={paused?"Resume":"Pause"}>{paused?<Play/>:<Pause/>}</Button><Button size="lg" onClick={()=>setPhase("preview")}><Square/>Finish</Button></>}{phase === "preview" && <><Button variant="outline" onClick={reset}><RotateCcw/>Retake</Button><Button onClick={()=>{onSave();onOpenChange(false)}}>Use this video</Button></>}</div></div></DialogContent></Dialog>;
}