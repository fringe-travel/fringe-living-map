import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const STORAGE_KEY = "fringe.foundingBanner.dismissed";

export function FoundingMemberBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) !== "1") setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative w-full border-b border-primary/30 bg-gradient-to-r from-primary/15 via-sunset/10 to-primary/15">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-4 px-4 py-2.5 pr-12 sm:pr-4">
        <p className="text-center text-xs font-medium text-foreground sm:text-sm">
          <span className="font-mono uppercase tracking-[0.18em] text-primary">
            Founding Members ·
          </span>{" "}
          Only 2,000 seats. $100 one-time. Lifetime access.
        </p>
        <Link
          to="/pricing"
          className="shrink-0 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:scale-105 sm:text-sm"
        >
          Claim your pass
        </Link>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
      >
        ×
      </button>
    </div>
  );
}
