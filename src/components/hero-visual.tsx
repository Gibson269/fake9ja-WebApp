import { motion, useReducedMotion } from "framer-motion";

export function HeroVisual() {
  const reduced = useReducedMotion();
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]" aria-label="A shield inspecting product authenticity">
      <motion.div className="hero-blob absolute inset-[10%]" animate={reduced ? {} : { borderRadius: ["42% 58% 61% 39% / 45% 35% 65% 55%", "58% 42% 38% 62% / 58% 61% 39% 42%", "42% 58% 61% 39% / 45% 35% 65% 55%"], rotate: [0, 4, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 520 520" fill="none" aria-hidden="true">
        <g className="mesh-lines" stroke="currentColor" strokeWidth="1">
          {[80,140,200,260,320,380,440].map((x) => <path key={x} d={`M${x} 55 C${x-60} 180 ${x+70} 330 ${x-20} 475`} />)}
          {[90,155,220,285,350,415].map((y) => <path key={y} d={`M35 ${y} C180 ${y-40} 340 ${y+60} 485 ${y-15}`} />)}
        </g>
        <motion.g initial={reduced ? false : { y: 10 }} animate={reduced ? {} : { y: [-8, 8, -8] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
          <path d="M258 103 387 149v94c0 84-50 136-129 166-79-30-129-82-129-166v-94l129-46Z" className="fill-primary stroke-accent" strokeWidth="6" />
          <path d="m202 252 34 35 79-88" className="stroke-primary-foreground" strokeLinecap="round" strokeLinejoin="round" strokeWidth="17" />
        </motion.g>
        <motion.g initial={reduced ? false : { x: 10, y: -10 }} animate={reduced ? {} : { x: [-5, 8, -5], y: [4, -8, 4], rotate: [-2, 3, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <circle cx="370" cy="174" r="70" className="fill-background/80 stroke-foreground" strokeWidth="10" />
          <path d="m420 225 55 55" className="stroke-foreground" strokeLinecap="round" strokeWidth="18" />
          <path d="M344 176h52M370 150v52" className="stroke-accent" strokeLinecap="round" strokeWidth="9" />
        </motion.g>
        <g className="fill-accent">
          <circle cx="88" cy="144" r="7" /><circle cx="443" cy="374" r="8" /><circle cx="110" cy="390" r="5" />
        </g>
      </svg>
      <div className="absolute bottom-[8%] left-[4%] rounded-2xl border border-border bg-card/90 p-4 shadow-soft backdrop-blur-xl"><span className="block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Protected today</span><strong className="font-display text-2xl text-foreground">24,891 people</strong></div>
    </div>
  );
}