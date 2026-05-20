import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-extrabold tracking-tighter">FRiNGE</span>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              Discover Your Adventure
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-foreground/50">
            A real-time window into the physical world. No uploads. No edits. No filters.
            Only delete.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://www.instagram.com/fringe.travel"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="FRiNGE on Instagram"
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary/60 hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@fringe.travel"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="FRiNGE on TikTok"
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary/60 hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                <path d="M19.6 6.7a5.2 5.2 0 0 1-3.2-1.1 5.2 5.2 0 0 1-2-3.6h-3.1v12.6a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V8.9a5.7 5.7 0 1 0 5 5.6V9.4a8.3 8.3 0 0 0 5.1 1.7V8a5.4 5.4 0 0 1 0-1.3z" />
              </svg>
            </a>
            <a
              href="https://x.com/fringe_travel"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="FRiNGE on X"
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary/60 hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
                <path d="M18.244 2H21l-6.51 7.44L22 22h-6.79l-4.77-6.24L4.8 22H2l7.02-8.02L2 2h6.91l4.34 5.74L18.244 2zm-1.19 18h1.86L7.04 4H5.06l11.994 16z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            The Globe
          </h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/signal-regions" className="text-foreground/70 hover:text-foreground">Regions</Link></li>
            
            <li><Link to="/pricing" className="text-foreground/70 hover:text-foreground">Support FRiNGE</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            Network
          </h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/vibers" className="text-foreground/70 hover:text-foreground">Become a Viber</Link></li>
            
          </ul>

          <h4 className="mt-8 mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            Legal
          </h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/terms" className="text-foreground/70 hover:text-foreground">Terms of Service</Link></li>
            <li><Link to="/refunds" className="text-foreground/70 hover:text-foreground">Refund Policy</Link></li>
            <li><Link to="/privacy" className="text-foreground/70 hover:text-foreground">Privacy Notice</Link></li>
            <li><Link to="/investors" className="text-foreground/50 hover:text-foreground">Investors</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40 md:flex-row md:items-center">
          <span>© 2026 FRiNGE, The Living Globe</span>
          <span>Real people. Real places. Fresh signals.</span>
        </div>
      </div>
    </footer>
  );
}
