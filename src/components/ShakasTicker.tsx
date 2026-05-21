import { useEffect, useState } from "react";
import { ViberAvatar } from "@/components/ViberAvatar";

type TickerItem = {
  from: string;
  to: string;
  amount: number;
  minutesAgo: number;
  region: string;
};

const SEED: TickerItem[] = [
  { from: "sam", to: "maya_k", amount: 5, minutesAgo: 2, region: "Boracay" },
  { from: "alex", to: "rafa", amount: 3, minutesAgo: 4, region: "Rio" },
  { from: "jules", to: "dax", amount: 10, minutesAgo: 6, region: "Hood River" },
  { from: "kira", to: "luca.s", amount: 2, minutesAgo: 8, region: "Rio" },
  { from: "noa", to: "kai_w", amount: 5, minutesAgo: 11, region: "Boracay" },
  { from: "owen", to: "mel", amount: 3, minutesAgo: 13, region: "Hood River" },
  { from: "bea", to: "jess.v", amount: 2, minutesAgo: 17, region: "Boracay" },
  { from: "vini", to: "lara", amount: 5, minutesAgo: 21, region: "Rio" },
];

export function ShakasTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setIdx((i) => (i + 1) % SEED.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  const item = SEED[idx];
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-sunset/30 bg-sunset/5 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/80 backdrop-blur-sm">
      <span className="relative inline-flex size-2">
        <span className="absolute inset-0 animate-ping rounded-full bg-sunset opacity-70" />
        <span className="relative size-2 rounded-full bg-sunset" />
      </span>
      <span className="text-foreground/60">Shakas flowing</span>
      <span className="flex items-center gap-2 normal-case tracking-normal">
        <span className="font-semibold text-foreground">@{item.from}</span>
        <span className="text-foreground/40">→</span>
        <ViberAvatar handle={item.to} size={20} className="ring-1" />
        <span className="font-semibold text-foreground">@{item.to}</span>
        <span className="text-sunset">· {item.amount} 🤙</span>
        <span className="text-foreground/40">· {item.minutesAgo}m</span>
      </span>
    </div>
  );
}
