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
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40 md:flex-row md:items-center">
          <span>© 2026 FRiNGE — The Living Globe</span>
          <span>Real people. Real places. Fresh signals.</span>
        </div>
      </div>
    </footer>
  );
}
