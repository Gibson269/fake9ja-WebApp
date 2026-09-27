import { motion } from "framer-motion";

const cells: [number, number, number][] = [
  [70,18,1],[100,22,2],[130,26,1],[160,24,1],[190,35,2],[220,40,1],
  [54,48,1],[84,52,2],[114,56,1],[144,58,3],[174,63,1],[204,70,2],[234,72,1],
  [39,78,1],[69,82,1],[99,86,3],[129,88,2],[159,93,1],[189,100,1],[219,104,2],
  [55,108,1],[85,112,2],[115,118,1],[145,122,3],[175,128,1],[205,134,2],
  [76,138,2],[106,144,1],[136,150,2],[166,157,1],[196,164,3],
  [99,170,1],[129,178,2],[159,185,1]
];

export function NigeriaMap() {
  return (
    <svg viewBox="0 0 285 225" className="mx-auto w-full max-w-lg" aria-label="Stylised activity map of Nigeria">
      <path d="M35 28 110 8l42 15 51 2 50 33-10 49-35 32-13 42-48 34-37-31-51-8-29-38 12-43L24 58Z" className="fill-secondary stroke-border" strokeWidth="3" />
      {cells.map(([x,y,v], i) => <motion.polygon key={i} points={`${x},${y} ${x+14},${y-8} ${x+28},${y} ${x+28},${y+16} ${x+14},${y+24} ${x},${y+16}`} className={v === 3 ? "fill-destructive" : v === 2 ? "fill-accent" : "fill-primary/25"} initial={{ opacity: .25, scale: .8 }} animate={{ opacity: [0.45, 1, 0.45], scale: [0.94, 1, 0.94] }} transition={{ duration: 2.4 + (i % 5) * .25, repeat: Infinity, delay: i * .04 }} />)}
    </svg>
  );
}