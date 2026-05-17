import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-extrabold tracking-tighter">FRiNGE</span>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              Signal Regions
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-foreground/50">
            The signal layer of the real world. Google Maps shows what exists.
            FRiNGE shows what's happening now.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            Product
          </h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/signal-regions" className="text-foreground/70 hover:text-foreground">Signal Regions</Link></li>
            <li><Link to="/now-map" className="text-foreground/70 hover:text-foreground">Now Map</Link></li>
            <li><Link to="/pricing" className="text-foreground/70 hover:text-foreground">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            Network
          </h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/vibers" className="text-foreground/70 hover:text-foreground">For Vibers</Link></li>
            <li><Link to="/businesses" className="text-foreground/70 hover:text-foreground">For Businesses</Link></li>
          </ul>

          <h4 className="mt-8 mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            Legal
          </h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/terms" className="text-foreground/70 hover:text-foreground">Terms of Service</Link></li>
            <li><Link to="/refunds" className="text-foreground/70 hover:text-foreground">Refund Policy</Link></li>
            <li><Link to="/privacy" className="text-foreground/70 hover:text-foreground">Privacy Notice</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40 md:flex-row md:items-center">
          <span>© 2026 FRiNGE Signal Network</span>
          <span>Real-time signal · Powered by people on the ground</span>
        </div>
      </div>
    </footer>
  );
}
