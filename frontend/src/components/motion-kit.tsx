import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, copy, align = "left" }: { eyebrow: string; title: string; copy?: string; align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
        <span className="h-px w-7 bg-accent" />{eyebrow}
      </div>
      <h2 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-5xl">{title}</h2>
      {copy && <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">{copy}</p>}
    </div>
  );
}